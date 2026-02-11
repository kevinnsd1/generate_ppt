
import puppeteer from 'puppeteer';
// import * as template from './template';

// export const generateImage = async (req: any, res: any) => {

//   const { title, description, img } = await req.query;

//   const browser = await puppeteer.launch();

//   const page = await browser.newPage();

//   await page.setViewport({ width: 630, height: 275 });

//   await page.setContent(template.getHtml(title, description, img));

//   const image = await page.screenshot({ type: 'png' });
//   console.log("image is "+image)
//   res.statusCode = 200;
//   res.setHeader('Content-Type', `image/png`);
//   res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
//   res.end(image);
// };
