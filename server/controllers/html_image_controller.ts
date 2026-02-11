
// import db from '../models/index';
// import { QueryTypes } from 'sequelize';
// import SuccessResponse from '../utils/successResponse';
// import ErrorResponse from '../utils/errorResponse';
// import MasterSlide from './master';
// import asyncHandler from '../middleware/async';
// import async from 'async';
// const successResponse = new SuccessResponse();
// import GlobalHelper from '../helpers/GlobalHelper';
// const globalHelper = new GlobalHelper();
// import * as template from './template';
// import * as templateBrandPositioning from './templateBrandPositioning';
// import * as templateSamplePost from './templateSamplePost';
// import * as templateSampleTalk from './templateSampleTalk';
// import puppeteer from 'puppeteer';
// import path from 'path';

// let pathDir = '/mnt/data/export/';
// //let pathDir = "C:\\repository\\customReport\\custom-report-generator\\files\\";

// exports.generateHtmlToImagePeakTime = asyncHandler(async (req: any, res: any, next: any) => {
//   const { title, description, img } = await req.body;

//   const browser = await puppeteer.launch();

//   const page = await browser.newPage();
//   await page.setDefaultNavigationTimeout(100000);
//   await page.setViewport({ width: 630, height: 275 });

//   await page.setContent(template.getHtml(title, description, img));

//   const image = await page.screenshot({
//     type: "png",
//     path: `${pathDir}/chart-` + globalHelper.generateUUID() + `.png`,
//   });
//   await browser.close();
//   console.log("image is " + image);
//   let advancedResults = {
//     reportName: "reportName",
//   };
//   res.sendFile(path.join(__dirname, "./public/image.png"));
//   successResponse.resultSuccessful(req, res, advancedResults);
// });

// exports.generateBrandPositioning = asyncHandler(async (req: any, res: any, next: any) => {
//   const data = await req.body.data;
//   const colors = await req.body.colors;
//   let imageName = "chart-" + req.body.id + ".png";
//   try {
//     const browser = await puppeteer.launch();

//     const page = await browser.newPage();
//     await page.setDefaultNavigationTimeout(100000);
//     await page.setViewport({ width: 1160, height: 520 }); // brand-positioning

//     await page.setContent(templateBrandPositioning.getHtml(data, colors));

//     const image = await page.screenshot({
//       type: "png",
//       path: `${pathDir}${imageName}`,
//     });
//     await browser.close();
//   } catch (error) {
//     await browser.close();
//     next(error);
//   }

//   let advancedResults = {
//     imageName: imageName,
//   };
//   successResponse.resultSuccessful(req, res, advancedResults);
// });

// exports.generateSamplePost = asyncHandler(async (req: any, res: any, next: any) => {
//   const browser = await puppeteer.launch();
//   let imageName = "chart-" + req.body.id + ".png";
//   try {
//     const data = await req.body;
//     const page = await browser.newPage();
//     await page.setDefaultNavigationTimeout(100000);
//     await page.setViewport({ width: 460, height: 830 }); // sample-post
//     await page.setContent(templateSamplePost.getHtml(data));
//     const image = await page.screenshot({
//       type: "png",
//       path: `${pathDir}${imageName}`,
//     });
//     await browser.close();
//   } catch (error) {
//     console.log(error);
//     await browser.close();
//     next(error);
//   }

//   let advancedResults = {
//     imageName: imageName,
//   };
//   successResponse.resultSuccessful(req, res, advancedResults);
// });

// exports.generateSampleTalk = asyncHandler(async (req: any, res: any, next: any) => {
//   const browser = await puppeteer.launch();
//   let imageName = "chart-" + req.body.id + ".png";
//   try {
//     const data = await req.body;
//     const page = await browser.newPage();
//     await page.setDefaultNavigationTimeout(100000);
//     //await page.setViewport({ width: 460, height: 830 }); // sample-post
//     await page.setViewport({ width: 610, height: 220 }); // sample-talk
//     await page.setContent(templateSampleTalk.getHtml(data));

//     const image = await page.screenshot({
//       type: "png",
//       path: `${pathDir}${imageName}`,
//     });
//     await browser.close();
//   } catch (error) {
//     await browser.close();
//   }

//   let advancedResults = {
//     imageName: imageName,
//   };
//   successResponse.resultSuccessful(req, res, advancedResults);
// });
