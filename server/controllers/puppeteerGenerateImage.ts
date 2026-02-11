
import { Browser, Page, ConsoleMessage } from 'puppeteer';
import * as templateBrandPositioning from './templateBrandPositioning';
import * as templateSamplePost from './templateSamplePost';
import * as templateSampleTalk from './templateSampleTalk';
import * as templateSampleArticle from './templateSampleArticle';
import * as templateWordcloud from './templateWordcloud';
import * as templatePie3D from './templatePie3D';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface BaseImageParams {
  browser: Browser;
  pathDir: string;
  id?: string;
  data: any; // Using any for data as the structures might be complex, can refine later
  colors?: any; // Using any for colors as well
}

export const generatePie3DImage = async ({ browser, pathDir, id, data, colors }: BaseImageParams) => {
  let imageName = 'chart-pie3d-' + id + '.png';

  const page = await browser.newPage();

  // Enable console log from browser to node console
  page.on('console', (msg: ConsoleMessage) => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', (err: Error) => console.log('BROWSER ERROR:', err.toString()));

  // Adjust viewport size for chart
  await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 });
  await page.setContent(templatePie3D.getHtml(data, colors), { waitUntil: 'networkidle0' });

  // Wait for chart to render (SVG presence)
  try {
    await page.waitForSelector('.highcharts-container', { visible: true, timeout: 10000 });
  } catch (e) {
    console.warn('Timeout waiting for Highcharts, taking screenshot anyway');
  }

  // Force a small delay to ensure animation settles
  await delay(100);

  await page.screenshot({
    type: 'png',
    path: `${pathDir}${imageName}`,
    omitBackground: true // Transparent background
  });

  await page.close();

  return imageName;
};

export const generateBrandPositioningImage = async ({ browser, pathDir, id, data, colors }: BaseImageParams) => {
  let imageName = 'chart-' + id + '.png';

  const page = await browser.newPage();
  await page.setViewport({ width: 1160, height: 520 });
  await page.setContent(templateBrandPositioning.getHtml(data, colors));

  // Wait for chart to render
  try {
    await page.waitForSelector('#chart svg', { visible: true, timeout: 10000 });
  } catch (e) {
    console.warn('Timeout waiting for Brand Positioning chart SVG, taking screenshot anyway');
  }

  // Force a small delay to ensure rendering/animation settles
  await delay(100);

  await page.screenshot({
    type: 'png',
    path: `${pathDir}${imageName}`,
  });

  await page.close();

  return imageName;
};

export const generateSamplePostImage = async ({ browser, pathDir, data }: BaseImageParams) => {
  let imageName = 'chart-' + data.id + '.png';

  const page = await browser.newPage();
  await page.setViewport({ width: 460, height: 830 });
  await page.setContent(templateSamplePost.getHtml(data));
  await page.screenshot({
    type: 'png',
    path: `${pathDir}${imageName}`,
  });

  await page.close();

  return imageName;
};

export const generateSampleArticleImage = async ({ browser, pathDir, data }: BaseImageParams) => {
  let imageName = 'chart-' + data.id + '.png';

  const page = await browser.newPage();
  await page.setViewport({ width: 313, height: 235 });
  await page.setContent(templateSampleArticle.getHtml(data));
  await page.screenshot({
    type: 'png',
    path: `${pathDir}${imageName}`,
  });

  await page.close();

  return imageName;
};

export const generateSampleTalkImage = async ({ browser, pathDir, data }: BaseImageParams) => {
  let imageName = 'chart-' + data.id + '.png';

  const page = await browser.newPage();
  await page.setViewport({ width: 610, height: 220 });
  await page.setContent(templateSampleTalk.getHtml(data));
  await page.screenshot({
    type: 'png',
    path: `${pathDir}${imageName}`,
  });

  await page.close();

  return imageName;
};

export const generateWordcloudImage = async ({ browser, pathDir, id, data }: BaseImageParams) => {
  const imageName = `wordcloud-${Date.now()}.png`;
  const page = await browser.newPage();

  await page.setContent(templateWordcloud.getHtml(data));
  await page.waitForSelector('svg');

  const element = await page.$('svg'); // get element
  if (element) {
    await element.screenshot({ type: 'png', path: `${pathDir}${imageName}` });
  }

  await page.close();
  return imageName;
};
