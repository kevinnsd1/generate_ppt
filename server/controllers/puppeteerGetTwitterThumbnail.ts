
import puppeteer, { Browser, Page, HTTPRequest, HTTPResponse } from 'puppeteer';
import axios from 'axios';

interface GenerateTweetThumbnailParams {
  url: string;
  socialMedia: string;
  browser: Browser;
}

interface TweetThumbnailResult {
  data: Buffer;
  type: string;
  url: string;
  base64?: string;
  source: string;
  error?: string;
  message?: string;
}

export const generateTweetThumbnail = async ({
  url,
  socialMedia,
  browser,
}: GenerateTweetThumbnailParams): Promise<TweetThumbnailResult | undefined> => {
  // Prepare for rate limiting and blocking scenarios
  const MAX_RETRIES = 1;
  const SCREENSHOT_TIMEOUT = 45000; // 45 seconds total for screenshot operation

  let retries = 0;
  let page: Page | null = null;

  while (retries <= MAX_RETRIES) {
    try {
      // APPROACH 1: API ENDPOINT (fastest)
      try {
        // console.log(`[${new Date().toISOString()}] Attempting API endpoint for: ${url}`);
        const response = await axios.get(
          `https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${url}`,
          {
            responseType: 'arraybuffer',
            timeout: 7000, // Increased timeout for API
          },
        );

        if (response.status === 200 && response.data && response.data.length > 0) {
          // console.log(`[${new Date().toISOString()}] Successfully retrieved thumbnail from API`);
          const base64Data = Buffer.from(response.data, 'binary').toString('base64');
          return {
            data: Buffer.from(response.data),
            type: response.headers['content-type'],
            url: url,
            base64: base64Data,
            source: 'api',
          };
        }
      } catch (apiError) {
        // console.log(`[${new Date().toISOString()}] API attempt failed: ${(apiError as Error).message}`);
      }

      // APPROACH 2: BROWSER-BASED APPROACH
      // console.log(`[${new Date().toISOString()}] Creating new page for: ${url} (Retry: ${retries})`);

      // Create new page with more compatible settings
      page = await browser.newPage();

      // Apply minimal stealth mode settings to avoid detection issues
      await applyMinimalStealthMode(page);

      // Set a standard viewport size more commonly used
      await page.setViewport({ width: 470, height: 700 });

      // Storage for GraphQL data
      const graphqlResponses: { url: string; data: any }[] = [];

      // Create a promise that will reject after timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), SCREENSHOT_TIMEOUT);
      });

      // Track GraphQL requests for structured data
      await page.setRequestInterception(true);

      page.on('request', (request: HTTPRequest) => {
        const reqUrl = request.url();

        // Track GraphQL API calls
        if (reqUrl.includes('api.x.com/graphql') || reqUrl.includes('/i/api/graphql')) {
          // console.log(`[${new Date().toISOString()}] Detected GraphQL request: ${reqUrl.substring(0, 100)}...`);
        }

        // Let requests go through
        request.continue();
      });

      // log response for GraphQL requests and check for empty tweet data
      page.on('response', async (response: HTTPResponse) => {
        const respUrl = response.url();
        if (respUrl.includes('api.x.com/graphql') || respUrl.includes('/i/api/graphql')) {
          // console.log(`[${new Date().toISOString()}] Detected GraphQL response: ${respUrl.substring(0, 100)}...`);

          // Specifically check for TweetResultByRestId endpoint
          if (respUrl.includes('TweetResultByRestId')) {
            try {
              const responseData = await response.json();
              graphqlResponses.push({ url: respUrl, data: responseData });

              // console.log(`[${new Date().toISOString()}] GraphQL response data: ${JSON.stringify(responseData)}`);

              // Check if response data is empty
              if (
                responseData &&
                responseData.data &&
                responseData.data.tweetResult &&
                Object.keys(responseData.data.tweetResult).length === 0
              ) {
                // console.log(`[${new Date().toISOString()}] Empty tweet data detected in GraphQL response`);
                throw new Error('EMPTY_TWEET_DATA');
              }
            } catch (jsonError) {
              // console.warn(`[${new Date().toISOString()}] Failed to parse GraphQL response: ${(jsonError as Error).message}`);
            }
          }
        }
      });

      // Main screenshot operation wrapped in a promise
      const screenshotPromise = (async (): Promise<TweetThumbnailResult | undefined> => {
        if (!page) throw new Error('Page not initialized');
        // More forgiving navigationOptions
        const navigationOptions = {
          waitUntil: 'networkidle2' as const, // Wait until the network is mostly idle
          timeout: 75000, // 30 seconds
        };

        // console.log(`[${new Date().toISOString()}] Navigating to: ${url}`);
        await page.goto(url, navigationOptions);

        // Wait for page to stabilize
        // console.log(`[${new Date().toISOString()}] Waiting for page to stabilize...`);
        await page.waitForTimeout(10000);

        // Look for tweet content
        // console.log(`[${new Date().toISOString()}] Looking for tweet content...`);

        // Check if we have tweet content using various selectors
        const tweetVisible = await page.evaluate(() => {
          const selectors = [
            'article[data-testid="tweet"]',
            '[data-testid="tweetText"]',
            '[data-testid="tweetPhoto"]',
            '.css-1dbjc4n', // Common Twitter/X class
          ];

          for (const selector of selectors) {
            const element = document.querySelector(selector) as HTMLElement;
            if (element && element.offsetParent !== null) {
              return true;
            }
          }
          return false;
        });

        if (!tweetVisible) {
          // console.log(`[${new Date().toISOString()}] Tweet not found, waiting longer...`);
          // Wait longer and scroll down a bit to trigger lazy loading
          await page.evaluate(() => window.scrollBy(0, 300));
          await page.waitForTimeout(5000);
        }

        // Check GraphQL responses for empty tweet data
        const emptyTweetResponses = graphqlResponses.filter(
          (resp) =>
            resp.url.includes('TweetResultByRestId') &&
            resp.data &&
            resp.data.data &&
            resp.data.data.tweetResult &&
            Object.keys(resp.data.data.tweetResult).length === 0,
        );

        if (emptyTweetResponses.length > 0) {
          // console.log(`[${new Date().toISOString()}] Empty tweet data confirmed in GraphQL responses`);
          return {
            data: Buffer.alloc(0), // Empty buffer
            type: '',
            url: '',
            error: 'EMPTY_TWEET_DATA',
            message: 'Tweet data is empty or unavailable',
            source: 'graphql-check',
          };
        }

        // Check for any images that could be the thumbnail
        const imageUrl = await page.evaluate(() => {
          // Look for Twitter meta tags first (most reliable)
          const ogImage = document.querySelector('meta[property="og:image"], meta[name="twitter:image"]');
          if (ogImage && ogImage.getAttribute('content') && !ogImage.getAttribute('content')?.includes('icon')) {
            return ogImage.getAttribute('content');
          }

          // Look for tweet images
          const mediaImages = Array.from(document.querySelectorAll('img')).filter(
            (img) => img.src && img.src.includes('media') && img.width > 200,
          );

          if (mediaImages.length > 0) {
            return mediaImages[0].src;
          }

          // Look for video thumbnails
          const videoElement = document.querySelector('video[poster]') as HTMLVideoElement;
          if (videoElement && videoElement.poster) {
            return videoElement.poster;
          }

          return null;
        });

        if (imageUrl) {
          // console.log(`[${new Date().toISOString()}] Found image URL: ${imageUrl}`);
          try {
            const imageResponse = await axios.get(imageUrl, {
              responseType: 'arraybuffer',
              timeout: 5000,
            });

            // console.log(`[${new Date().toISOString()}] Successfully fetched image`);
            return {
              data: Buffer.from(imageResponse.data),
              type: imageResponse.headers['content-type'] || 'image/jpeg',
              url: imageUrl,
              source: 'page-image',
            };
          } catch (imageError) {
            // console.warn(`[${new Date().toISOString()}] Failed to fetch image: ${(imageError as Error).message}`);
            // Continue to screenshot approach
          }
        }

        // Take screenshot approach with fixed dimensions as requested
        // console.log(`[${new Date().toISOString()}] Taking screenshot with fixed dimensions`);

        // Wait for fonts and images to load better
        await page.waitForTimeout(2000);

        // Use the exact fixed dimensions as specified
        const screenshotBuffer = await page.screenshot({
          type: 'png',
          fullPage: false,
          // path: `D:/AA No Limit/Project/export/tweet-screenshot-${new Date().getTime()}.png`,
          clip: {
            x: 70,
            y: 35,
            width: 400,
            height: 420,
          },
        });

        // console.log(`[${new Date().toISOString()}] Screenshot captured successfully: ${screenshotBuffer.length} bytes`);

        return {
          data: screenshotBuffer as Buffer,
          type: 'image/png',
          url: url,
          source: 'screenshot',
        };
      })();

      // Race between timeout and screenshot operation
      const result = await Promise.race([screenshotPromise, timeoutPromise]) as TweetThumbnailResult;

      await page.close();
      page = null; // Mark page as closed
      // console.log(`[${new Date().toISOString()}] Page closed, returning result`);

      // Check if result contains an error flag for empty tweet data
      if (result && result.error === 'EMPTY_TWEET_DATA') {
        // console.log(`[${new Date().toISOString()}] Returning default none thumbnail due to empty tweet data`);
        // You can either throw an error or return a specific object indicating empty tweet data
        throw new Error('EMPTY_TWEET_DATA'); // This will be caught in the catch block
      }

      return result;
    } catch (error) {
      // console.error(`[${new Date().toISOString()}] Error (retry ${retries}): ${(error as Error).message}`);

      // If this is specifically an empty tweet data error, handle it specially
      if ((error as Error).message === 'EMPTY_TWEET_DATA') {
        // console.log(`[${new Date().toISOString()}] Detected empty tweet data, returning with default thumbnail flag`);

        if (page) {
          try {
            await page.close();
            page = null;
          } catch (closeError) {
            // console.warn(`[${new Date().toISOString()}] Failed to close page: ${(closeError as Error).message}`);
          }
        }

        throw error; // This will be caught in the catch block
      }

      if (page) {
        try {
          await page.close();
          page = null;
          // console.log(`[${new Date().toISOString()}] Cleaned up page after error`);
        } catch (closeError) {
          // console.warn(`[${new Date().toISOString()}] Failed to close page: ${(closeError as Error).message}`);
        }
      }

      retries++;
      if (retries <= MAX_RETRIES) {
        // console.log(`[${new Date().toISOString()}] Retrying... (${retries}/${MAX_RETRIES})`);
        // Exponential backoff with jitter to avoid detection patterns
        const baseDelay = 2000 * retries;
        const jitter = Math.floor(Math.random() * 1000);
        await new Promise((resolve) => setTimeout(resolve, baseDelay + jitter));
      } else {
        throw new Error(`Failed after ${MAX_RETRIES} retries: ${(error as Error).message}`);
      }
    }
  }
};

// Helper function to apply minimal stealth mode to page
async function applyMinimalStealthMode(page: Page) {
  // Set a realistic user agent that's more compatible with x.com
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  );

  // Add essential headers that won't trigger privacy extensions
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    Referer: 'https://x.com/', // Updated to X.com from Twitter.com
  });

  // Only apply minimal fingerprint protection to avoid detection
  await page.evaluateOnNewDocument(() => {
    // Only modify webdriver property which is the most commonly checked
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });

    // Add realistic language settings
    Object.defineProperty(navigator, 'language', {
      get: () => 'en-US',
    });
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });

  // Optional: disable cache to ensure fresh content
  await page.setCacheEnabled(false);

  // No request interception to avoid conflicts with privacy extensions
}

// Helper function to extract tweet ID from URL (optional utility)
function extractTweetId(url: string) {
  try {
    // Extract ID from Twitter/X URLs
    const regex = /twitter\.com\/\w+\/status\/(\d+)|x\.com\/\w+\/status\/(\d+)/;
    const match = url.match(regex);
    if (match) {
      return match[1] || match[2];
    }
    return null;
  } catch (e) {
    // console.error('Error extracting tweet ID:', e);
    return null;
  }
}
