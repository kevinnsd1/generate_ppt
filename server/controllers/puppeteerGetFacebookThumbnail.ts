import puppeteer, { Browser, Page } from 'puppeteer';
import axios from 'axios';

interface GenerateFacebookThumbnailParams {
  url: string;
  socialMedia?: string;
}

interface FacebookThumbnailResult {
  data: Buffer;
  type: string;
  url: string;
  base64: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateFacebookThumbnail = async ({
  url,
  socialMedia,
}: GenerateFacebookThumbnailParams): Promise<FacebookThumbnailResult | undefined> => {
  let browser: Browser | null = null;

  // First attempt: Try using the API
  try {
    const response = await axios.get(
      `https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${url}`,
      {
        responseType: 'arraybuffer',
      },
    );

    if (response.status === 200) {
      const base64Data = Buffer.from(response.data, 'binary').toString('base64');
      return {
        data: Buffer.from(response.data),
        type: response.headers['content-type'],
        url: url,
        base64: base64Data,
      };
    }
  } catch (apiError) {
    // console.log('API attempt failed, falling back to Puppeteer:', apiError.message);
  }

  // Second attempt: Use Puppeteer as fallback
  try {
    const delayTime = Math.floor(Math.random() * 4500) + 2500;
    await delay(delayTime);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-javascript',
        '--disable-canvas',
        '--disable-webgl',
        '--disable-video',
        '--disable-audio',
        '--block-new-web-contents',
        `--proxy-server=residential-proxy.scrapeops.io:8181`,
      ],
    });

    const page = await browser.newPage();

    // Authenticate proxy
    await page.authenticate({
      username: 'scrapeops',
      password: 'f3a1d44f-0a48-4bbc-bc07-3adbae8b6db2',
    });

    // Block all unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      const url = request.url();

      if (
        resourceType === 'document' ||
        (resourceType === 'image' && (url.includes('fbcdn.net') || url.includes('facebook.com')))
      ) {
        request.continue();
      } else {
        request.abort();
      }
    });

    // Set minimal headers
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate',
    });

    // Set small viewport
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 1,
    });

    // Try to get meta image first
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 35000,
      });

      const metaImage = await page.evaluate(() => {
        const ogImage = document.querySelector('meta[property="og:image"]');
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        return (ogImage && ogImage.getAttribute('content')) || (twitterImage && twitterImage.getAttribute('content')) || null;
      });

      if (metaImage) {
        const response = await page.goto(metaImage, {
          waitUntil: 'networkidle0',
          timeout: 15000,
        });

        if (!response) throw new Error('Failed to load meta image');

        const buffer = await response.buffer();
        return {
          data: buffer,
          type: response.headers()['content-type'],
          url: metaImage,
          base64: buffer.toString('base64'),
        };
      }

      // Search for images on the page if meta tags fail
      const imageUrl = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img[src*="scontent"]');
        for (const img of imgs) {
          // Type assertion or checking properties exist on Element
          const imageElement = img as HTMLImageElement;
          if (imageElement.width >= 100 && imageElement.height >= 100) {
            return imageElement.src;
          }
        }
        return null;
      });

      if (!imageUrl) {
        throw new Error('No valid image found on the page');
      }

      const response = await page.goto(imageUrl, {
        waitUntil: 'networkidle0',
        timeout: 25000,
      });

      if (!response) throw new Error('Failed to load image');

      const buffer = await response.buffer();
      return {
        data: buffer,
        type: response.headers()['content-type'],
        url: imageUrl,
        base64: buffer.toString('base64'),
      };
    } catch (error) {
      console.error('Error in first attempt, trying mobile version:', error);

      // Try mobile version with minimal settings
      const mobileUrl = url.replace('www.facebook.com', 'm.facebook.com');
      await page.goto(mobileUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      const imageUrl = await page.evaluate(() => {
        const img = document.querySelector('img[src*="scontent"]') as HTMLImageElement;
        return img ? img.src : null;
      });

      if (!imageUrl) {
        throw new Error('No valid image found on mobile version');
      }

      const response = await page.goto(imageUrl, {
        waitUntil: 'networkidle0',
        timeout: 20000,
      });

      if (!response) throw new Error('Failed to load image');

      const buffer = await response.buffer();
      return {
        data: buffer,
        type: response.headers()['content-type'],
        url: imageUrl,
        base64: buffer.toString('base64'),
      };
    }
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
