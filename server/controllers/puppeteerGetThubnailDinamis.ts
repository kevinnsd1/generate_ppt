import { Browser, Page, HTTPRequest, HTTPResponse } from 'puppeteer';
import axios from 'axios';
import { URL } from 'url';

interface GenerateDynamicThumbnailParams {
  browser: Browser;
  url: string;
  socialMedia?: string;
}

interface ThumbnailResult {
  data: Buffer;
  type: string;
  url: string;
  base64: string;
  source: string;
}

export const generateDynamicThumbnail = async ({
  browser,
  url,
  socialMedia,
}: GenerateDynamicThumbnailParams): Promise<ThumbnailResult | null> => {
  return await DynamicThumbnailService.generateThumbnail({ browser, url, socialMedia });
};

// Improved DynamicThumbnailService with better error handling
class DynamicThumbnailService {
  /**
   * Get appropriate user agent for specific domains
   */
  static getUserAgent(domain: string): string {
    // E-commerce sites often work better with WhatsApp user agent
    if (domain.includes('tokopedia.com')) {
      return 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    } else if (['shopee.co.id', 'bukalapak.com', 'blibli.com'].some((site) => domain.includes(site))) {
      return 'WhatsApp/2.23.2.72 A';
    } else if (domain.includes('tiktok.com')) {
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
    } else if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    } else if (domain.includes('amazon.com') || domain.includes('amazon.co.id')) {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  }

  /**
   * Check if post/page appears to be deleted or empty
   */
  static async checkIfPostDeleted(page: Page, domain: string): Promise<boolean> {
    try {
      // Common indicators that a post is deleted or doesn't exist
      const deletedIndicators = [
        // Generic error messages
        'not found',
        '404',
        'page not found',
        'content not available',
        'post not found',
        'this post is no longer available',
        'content removed',
        'page does not exist',

        // Platform-specific indicators
        'tweet is unavailable', // Twitter
        'this video is unavailable', // TikTok/YouTube
        "this content isn't available", // Instagram/Facebook
        'produk tidak ditemukan', // Tokopedia
        'produk tidak tersedia', // Shopee
      ];

      // Check page title and content for deletion indicators
      const pageTitle = await page.title();
      const bodyText = await page.evaluate(() => {
        return document.body ? document.body.innerText.toLowerCase() : '';
      });

      const combinedText = (pageTitle + ' ' + bodyText).toLowerCase();

      // Check if any deletion indicator is present
      for (const indicator of deletedIndicators) {
        if (combinedText.includes(indicator.toLowerCase())) {
          //console.log(`Post appears to be deleted. Found indicator: "${indicator}"`);
          return true;
        }
      }

      // Platform-specific checks
      if (domain.includes('twitter.com') || domain.includes('x.com')) {
        // Check for Twitter-specific deletion indicators
        const tweetUnavailable = await page.$('[data-testid="empty_state_header_text"]');
        if (tweetUnavailable) {
          return true;
        }
      }

      if (domain.includes('tiktok.com')) {
        // Check for TikTok-specific deletion indicators
        const videoUnavailable = await page.$('[data-e2e="video-not-available"]');
        if (videoUnavailable) {
          return true;
        }
      }

      if (domain.includes('instagram.com')) {
        // Check for Instagram-specific deletion indicators
        const postUnavailable = await page.$('[data-testid="error-page"]');
        if (postUnavailable) {
          return true;
        }
      }

      // Check if page is mostly empty (less than 100 characters of meaningful content)
      if (bodyText.trim().length < 100) {
        //console.log('Page appears to be empty or has very little content');
        return true;
      }

      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      //console.error('Error checking if post is deleted:', errorMessage);
      // If we can't determine, assume it might be deleted to be safe
      return true;
    }
  }

  /**
   * Get element content using multiple selectors
   */
  static async getElementContent(page: Page, selectors: string[]): Promise<string | null> {
    for (const selector of selectors) {
      try {
        // Special handling for data-testid and data-e2e selectors
        if (selector.includes('[data-testid') || selector.includes('[data-e2e')) {
          const element = await page.$(selector);
          if (element) {
            const text = await element.evaluate((el) => (el as HTMLElement).innerText?.trim());
            if (text) return text;
          }
        } else {
          const element = await page.$(selector);
          if (element) {
            // Try content attribute first, then inner text
            const content = await element.evaluate((el) => el.getAttribute('content'));
            if (content?.trim()) return content.trim();

            const text = await element.evaluate((el) => (el as HTMLElement).innerText?.trim());
            if (text) return text;
          }
        }
      } catch (error) {
        //const errorMessage = error instanceof Error ? error.message : String(error);
        //console.error(`Error getting element content with selector ${selector}:`, errorMessage);
        continue;
      }
    }
    return null;
  }

  /**
   * Get actual image URL from relative or protocol-relative URLs
   */
  static getActualImageUrl(baseUrl: string, imageUrl: string | null | undefined): string | null {
    if (!imageUrl || imageUrl.trim() === '' || imageUrl.startsWith('data:')) {
      return null;
    }

    // Skip very small images or common placeholders, but allow YouTube thumbnails
    if (
      ['svg', 'placeholder', 'default'].some((x) => imageUrl.toLowerCase().includes(x)) &&
      !imageUrl.toLowerCase().includes('ytimg.com')
    ) {
      return null;
    }

    // Allow .gif for YouTube (some thumbnails might be gif)
    if (imageUrl.toLowerCase().includes('.gif') && !imageUrl.toLowerCase().includes('ytimg.com')) {
      return null;
    }

    if (imageUrl.startsWith('//')) {
      return `https:${imageUrl}`;
    } else if (!imageUrl.startsWith('http')) {
      const base = baseUrl.replace(/\/$/, '');
      const img = imageUrl.replace(/^\//, '');
      return `${base}/${img}`;
    }

    return imageUrl;
  }

  /**
   * Get main image URL based on domain-specific logic
   */
  static async getMainImageUrl(page: Page, baseUrl: string, domain: string): Promise<string | null> {
    try {
      // First check if the post is deleted
      const isDeleted = await this.checkIfPostDeleted(page, domain);
      if (isDeleted) {
        throw new Error('POST_DELETED_OR_NOT_EXIST');
      }

      // E-commerce specific image handling
      if (domain.includes('tokopedia.com')) {
        const tokpedSelectors = [
          '[data-testid="PDPImageMain"] img',
          '.css-1c345mg img',
          '.fade-appear-done img',
          'img[alt*="product"]',
        ];

        for (const selector of tokpedSelectors) {
          try {
            const element = await page.$(selector);
            if (element) {
              let src = await element.evaluate((el) => el.getAttribute('src') || el.getAttribute('data-src'));
              const actualUrl = this.getActualImageUrl(baseUrl, src);
              if (actualUrl && actualUrl.includes('product')) {
                return actualUrl;
              }
            }
          } catch (error) {
            continue;
          }
        }
      } else if (domain.includes('shopee.co.id')) {
        const shopeeSelectors = [
          '[class*="product-image"] img',
          '.pdp-product-image img',
          '._2zr5iX img',
          'img[alt*="product"]',
          'div[style*="background-image"]',
        ];

        for (const selector of shopeeSelectors) {
          try {
            if (selector.includes('background-image')) {
              const element = await page.$(selector);
              if (element) {
                const style = await element.evaluate((el) => el.getAttribute('style'));
                if (style && style.includes('background-image')) {
                  const match = style.match(/background-image:\s*url\(["\']?([^"\']+)["\']?\)/);
                  if (match) {
                    const imgUrl = match[1];
                    const actualUrl = this.getActualImageUrl(baseUrl, imgUrl);
                    if (actualUrl) return actualUrl;
                  }
                }
              }
            } else {
              const element = await page.$(selector);
              if (element) {
                const src = await element.evaluate((el) => el.getAttribute('src') || el.getAttribute('data-src'));
                const actualUrl = this.getActualImageUrl(baseUrl, src);
                if (actualUrl) return actualUrl;
              }
            }
          } catch (error) {
            continue;
          }
        }
      } else if (domain.includes('amazon.com') || domain.includes('amazon.co.id')) {
        const amazonSelectors = ['#landingImage', '[data-old-hires]', '.a-dynamic-image', '#imgTagWrapperId img'];

        for (const selector of amazonSelectors) {
          try {
            const element = await page.$(selector);
            if (element) {
              // Amazon sometimes has high-res image in data attributes
              const src = await element.evaluate(
                (el) => el.getAttribute('data-old-hires') || el.getAttribute('src') || el.getAttribute('data-src'),
              );
              const actualUrl = this.getActualImageUrl(baseUrl, src);
              if (actualUrl) return actualUrl;
            }
          } catch (error) {
            continue;
          }
        }
      } else if (domain.includes('tiktok.com')) {
        // TikTok specific image handling
        const tiktokSelectors = ['[data-e2e="browse-video-cover"] img', 'img[alt*="video"]', 'video[poster]'];

        for (const selector of tiktokSelectors) {
          try {
            if (selector === 'video[poster]') {
              const element = await page.$(selector);
              if (element) {
                const poster = await element.evaluate((el) => el.getAttribute('poster'));
                if (poster) {
                  return this.getActualImageUrl(baseUrl, poster);
                }
              }
            } else {
              const element = await page.$(selector);
              if (element) {
                const src = await element.evaluate((el) => el.getAttribute('src'));
                const actualUrl = this.getActualImageUrl(baseUrl, src);
                if (actualUrl) return actualUrl;
              }
            }
          } catch (error) {
            continue;
          }
        }
      } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
        // Twitter specific image handling
        const tweetImage = await page.$('[data-testid="tweetPhoto"] img');
        if (tweetImage) {
          const src = await tweetImage.evaluate((el) => el.getAttribute('src'));
          const actualUrl = this.getActualImageUrl(baseUrl, src);
          if (actualUrl) return actualUrl;
        }
      }

      // Try meta tags for all platforms
      //console.log(`Trying meta tags for domain: ${domain}`);
      const metaSelectors = [
        'meta[property="og:image"]',
        'meta[name="twitter:image"]',
        'meta[property="og:image:url"]',
        'meta[name="twitter:image:src"]',
        'meta[property="og:image:secure_url"]',
      ];

      for (const selector of metaSelectors) {
        try {
          //console.log(`Trying meta selector: ${selector}`);
          const element = await page.$(selector);
          if (element) {
            const imageUrl = await element.evaluate((el) => el.getAttribute('content'));
            //console.log(`Found meta image URL: ${imageUrl}`);
            if (imageUrl) {
              const actualUrl = this.getActualImageUrl(baseUrl, imageUrl);
              //console.log(`Processed meta image URL: ${actualUrl}`);
              if (actualUrl) return actualUrl;
            }
          }
        } catch (error) {
          //const errorMessage = error instanceof Error ? error.message : String(error);
          //console.error(`Error with meta selector ${selector}:`, errorMessage);
          continue;
        }
      }

      // Fallback to largest image (only for non-ecommerce sites to avoid clutter)
      if (!['tokopedia.com', 'shopee.co.id', 'amazon.com'].some((site) => domain.includes(site))) {
        const images = await page.$$('img');
        let largestImage = null;
        let largestArea = 0;

        for (let i = 0; i < Math.min(images.length, 10); i++) {
          // Limit to first 10 images for performance
          try {
            const img = images[i];
            const src = await img.evaluate((el) => el.getAttribute('src'));
            const actualUrl = this.getActualImageUrl(baseUrl, src);
            if (!actualUrl) continue;

            const box = await img.boundingBox();
            if (box && box.width && box.height) {
              const area = box.width * box.height;
              if (area > largestArea && area > 10000) {
                // Minimum size threshold
                largestArea = area;
                largestImage = actualUrl;
              }
            }
          } catch (error) {
            continue;
          }
        }
        if (largestImage) return largestImage;
      }

      // If we reach here and haven't found an image, the post might be deleted/empty
      throw new Error('POST_DELETED_OR_NOT_EXIST');
    } catch (error) {
      //const errorMessage = error instanceof Error ? error.message : String(error);
      //console.error(`Error finding image for ${domain}:`, errorMessage);
      if (error instanceof Error && error.message === 'POST_DELETED_OR_NOT_EXIST') {
        throw error; // Re-throw this specific error
      }
      return null;
    }
  }

  /**
   * Setup page optimizations based on domain
   */
  static async setupPageOptimizations(page: Page, domain: string): Promise<void> {
    // Sites that need images for proper preview
    const needsImages = [
      'tokopedia.com',
      'shopee.co.id',
      'amazon.com',
      'bukalapak.com',
      'blibli.com',
      'youtube.com',
      'youtu.be',
    ];

    if (needsImages.some((site) => domain.includes(site))) {
      // Allow images for sites that need them
      await page.setRequestInterception(true);
      page.on('request', (request: HTTPRequest) => {
        const resourceType = request.resourceType();
        if (['document', 'script', 'xhr', 'fetch', 'image'].includes(resourceType)) {
          request.continue();
        } else {
          request.abort();
        }
      });
    } else {
      // Block unnecessary resources for faster loading
      await page.setRequestInterception(true);
      page.on('request', (request: HTTPRequest) => {
        const resourceType = request.resourceType();
        if (['document', 'script', 'xhr', 'fetch'].includes(resourceType)) {
          request.continue();
        } else {
          request.abort();
        }
      });
    }

    // Set viewport for mobile sites like TikTok
    if (domain.includes('tiktok.com')) {
      await page.setViewport({ width: 375, height: 667 });
    } else {
      await page.setViewport({ width: 1280, height: 720 });
    }
  }

  /**
   * Main function to generate dynamic thumbnail with improved error handling
   */
  static async generateThumbnail({
    browser,
    url,
    socialMedia,
  }: GenerateDynamicThumbnailParams): Promise<ThumbnailResult | null> {
    let page: Page | null = null;

    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;
      const userAgent = this.getUserAgent(domain);

      // Try API first
      try {
        const apiUrl = `https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${url}`;
        const response = await axios.get(apiUrl, {
          responseType: 'arraybuffer',
          timeout: 20000,
        });

        if (response.status === 200 && response.data && response.data.length > 0) {
          const buffer = Buffer.from(response.data, 'binary');
          return {
            data: buffer,
            type: response.headers['content-type'],
            url,
            base64: buffer.toString('base64'),
            source: 'api',
          };
        }
      } catch (apiError) {
        //const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
        //console.log(`API failed for ${url}, fallback to browser:`, errorMessage);
      }

      // Browser fallback with better error handling
      page = await browser.newPage();

      try {
        // Set timeouts and error handling
        page.setDefaultTimeout(15000);
        page.setDefaultNavigationTimeout(15000);

        await page.setUserAgent(userAgent);
        await page.setExtraHTTPHeaders({
          'Accept-Language': 'en-US,en;q=0.9',
        });

        // Setup optimizations
        await this.setupPageOptimizations(page, domain);

        //console.log(`Fetching preview for URL: ${url}`);

        // Navigate with error handling
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 15000,
        });

        if (!response || response.status() >= 400) {
          throw new Error(`Failed to load page: ${response ? response.status() : 'No response'}`);
        }

        const finalUrl = response.url();
        const parsedDomain = new URL(finalUrl).hostname;

        // Wait for specific content based on platform with timeouts
        await this.waitForPlatformContent(page, parsedDomain);

        // Get main image URL (this will throw POST_DELETED_OR_NOT_EXIST if needed)
        const mainImage = await this.getMainImageUrl(page, finalUrl, parsedDomain);

        if (!mainImage) {
          throw new Error('POST_DELETED_OR_NOT_EXIST');
        }

        //console.log(`Found main image: ${mainImage}`);

        // Navigate to the image URL and get the buffer
        const imageResponse = await page.goto(mainImage, {
          waitUntil: 'networkidle0',
          timeout: 20000,
        });

        if (!imageResponse || imageResponse.status() >= 400) {
          throw new Error(`Failed to load image: ${imageResponse ? imageResponse.status() : 'No response'}`);
        }

        const buffer = await imageResponse.buffer();

        return {
          data: buffer,
          type: imageResponse.headers()['content-type'],
          url: mainImage,
          base64: buffer.toString('base64'),
          source: 'direct',
        };
      } catch (browserError) {
        const errorMessage = browserError instanceof Error ? browserError.message : String(browserError);
        //console.error(`Browser error for ${url}:`, errorMessage);

        // Always close the page in browser errors
        if (page) {
          try {
            await page.close();
            page = null; // Set to null to prevent double closing
          } catch (closeError) {
            //const closeErrorMessage = closeError instanceof Error ? closeError.message : String(closeError);
            //console.error(`Error closing page after browser error:`, closeErrorMessage);
          }
        }

        // Re-throw specific errors
        if (errorMessage === 'POST_DELETED_OR_NOT_EXIST') {
          throw browserError;
        }

        throw new Error(`Browser processing failed: ${errorMessage}`);
      }
    } catch (error) {
      //const errorMessage = error instanceof Error ? error.message : String(error);
      //console.error(`Error generating thumbnail for URL ${url}:`, errorMessage);

      // Always ensure page is closed in case of any error
      if (page) {
        try {
          await page.close();
          page = null;
        } catch (closeError) {
          //const closeErrorMessage = closeError instanceof Error ? closeError.message : String(closeError);
          //console.error(`Error closing page in catch block:`, closeErrorMessage);
        }
      }

      // Re-throw the error for the calling code to handle
      throw error;
    } finally {
      // Final safety check to ensure page is always closed
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          //const closeErrorMessage = closeError instanceof Error ? closeError.message : String(closeError);
          //console.error(`Error closing page in finally block:`, closeErrorMessage);
        }
      }
    }
  }

  /**
   * Wait for platform-specific content to load
   */
  static async waitForPlatformContent(page: Page, domain: string): Promise<void> {
    const waitConfigs: { [key: string]: { selectors: string[]; timeout: number; extraWait: number } } = {
      'tokopedia.com': {
        selectors: ['[data-testid="lblPDPProductName"], meta[property="og:title"]'],
        timeout: 8000,
        extraWait: 2000,
      },
      'shopee.co.id': {
        selectors: ['[data-testid="pdp-product-title"], meta[property="og:title"]'],
        timeout: 8000,
        extraWait: 2000,
      },
      'amazon.com': {
        selectors: ['#productTitle, meta[property="og:title"]'],
        timeout: 8000,
        extraWait: 1000,
      },
      'tiktok.com': {
        selectors: ['[data-e2e="browse-video-desc"], [data-e2e="video-desc"]'],
        timeout: 5000,
        extraWait: 0,
      },
      'twitter.com': {
        selectors: ['[data-testid="tweetText"]'],
        timeout: 5000,
        extraWait: 0,
      },
      'x.com': {
        selectors: ['[data-testid="tweetText"]'],
        timeout: 5000,
        extraWait: 0,
      },
    };

    const configKey = Object.keys(waitConfigs).find((key) => domain.includes(key));

    if (configKey) {
      const { selectors, timeout, extraWait } = waitConfigs[configKey];
      try {
        await page.waitForSelector(selectors.join(', '), { timeout });
        if (extraWait > 0) {
          await page.waitForTimeout(extraWait);
        }
      } catch (error) {
        // //console.log(`Timeout waiting for ${domain} content, continuing...`);
      }
    }
  }
}
