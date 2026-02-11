import axios from 'axios';
import { Browser } from 'puppeteer';

interface GenerateInstagramImageParams {
  browser: Browser;
  url: string;
  socialMedia?: string;
}

interface InstagramImageResult {
  data: Buffer;
  type: string;
  url: string;
  base64: string;
  source: string;
}

export const generateInstagramImage = async ({
  browser,
  url,
  socialMedia,
}: GenerateInstagramImageParams): Promise<InstagramImageResult | undefined> => {
  // First attempt: Try API
  try {
    const apiUrl = `https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${url}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    if (response.status === 200) {
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
    // console.log('API attempt failed, falling back to browser scraping:', apiError.message);
  }

  // Second attempt: Browser scraping with optimized loading
  let page;
  try {
    page = await browser.newPage();

    // First try: Quick load for meta tags
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 45000,
    });

    // Check meta tags
    const metaImage = await page.evaluate(() => {
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const twitterImage = document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
      return ogImage || twitterImage || null;
    });

    if (metaImage) {
      // If meta image found, fetch it directly
      const response = await page.goto(metaImage, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      if (!response) throw new Error('Failed to load meta image');

      const buffer = await response.buffer();
      return {
        data: buffer,
        type: response.headers()['content-type'],
        url: metaImage,
        base64: buffer.toString('base64'),
        source: 'meta',
      };
    }

    // If no meta image, load full page
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    // Look for image in img tags
    const imageUrl = await page.evaluate(() => {
      const imgs = document.getElementsByTagName('img');
      for (const img of imgs) {
        const src = img.getAttribute('src');
        if (!src) continue;

        // Validate and normalize URL
        if (src.startsWith('http')) {
          return src;
        }
        if (src.startsWith('/')) {
          return new URL(src, window.location.origin).href;
        }
      }
      return null;
    });

    if (!imageUrl) {
      throw new Error(`No valid image found on the page for ${url}`);
    }

    const response = await page.goto(imageUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    if (!response) throw new Error('Failed to load image');

    const buffer = await response.buffer();
    return {
      data: buffer,
      type: response.headers()['content-type'],
      url: imageUrl,
      base64: buffer.toString('base64'),
      source: 'direct',
    };
  } catch (error) {
    // console.error('Error generating Instagram image:', error);
    throw error;
  } finally {
    if (page) {
      await page.close().catch(console.error);
    }
  }
};
