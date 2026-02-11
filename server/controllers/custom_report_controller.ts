
import db from '../models/index';
// import { QueryTypes, col } from 'sequelize';
import SuccessResponse from '../utils/successResponse';
// import ErrorResponse from '../utils/errorResponse';
import * as MasterSlide from './master';
import asyncHandler from '../middleware/async';
// import async from 'async';
import GlobalHelper from '../helpers/GlobalHelper';
import pptxgenjs from 'pptxgenjs';
import axios from 'axios';
import pathExpress from 'path';
import puppeteer, { Browser } from 'puppeteer';
import { generateInstagramImage } from './puppeteerGetInstagramThumbnail';
import { generateTweetThumbnail } from './puppeteerGetTwitterThumbnail';
import { generateFacebookThumbnail } from './puppeteerGetFacebookThumbnail';
// import * as metricHandlers from '../metrics';
import metricHandlers from '../metrics';
import normalizeData = require('../utils/dataNormalizer');
import { addLineSeparator } from '../utils/line';
import { generateTitleContentSlide, generateSubTitleContentSlide } from '../utils/content';
import { transformPosition, generatePositionWithSummary } from '../utils/position';
import { renderSummaryBox, getWhiteCardConfig } from '../utils/summary';
import { addNoDataMessage } from '../utils/noDataMessage';
// import configData from '../../config/config.json';

const successResponse = new SuccessResponse();
// const globalHelper = new GlobalHelper();

console.log('Reloading server for layout changes...', new Date().toISOString()); // Force reload

// add axios logger
axios.interceptors.request.use((x: any) => {
  const headers = {
    ...x.headers.common,
    ...x.headers[x.method],
    ...x.headers,
  };

  ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach((header) => {
    delete headers[header];
  });

  const printable = `${new Date()} | Request: ${x.method.toUpperCase()} | ${x.url} | ${JSON.stringify(x.data)} | ${JSON.stringify(headers)}`;
  console.log(printable);

  return x;
});

axios.interceptors.response.use((x: any) => {
  //const printable = `${new Date()} | Response: ${x.status} | ${ JSON.stringify(x.data) }`
  const printable = `${new Date()} | Response: ${x.status}`;
  console.log(printable);

  return x;
});

const env = process.env.NODE_ENV || 'development';
// Use require to avoid TS2307
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const configData = require('../config/config.json');
const config = (configData as any)[env];

// Override path for local development to avoid ENOENT
let path = pathExpress.join(__dirname, '../../exports/');
// let path = config.EXPORT_PATH;

export const webhookMessageBird = asyncHandler(async (req: any, res: any, next: any) => {
  console.log('webhook trigered ');
  console.log('req ', req);
  let advancedResults = {
    resultStatus: 'ok',
  };
  successResponse.resultSuccessful(req, res, advancedResults);
});

export const downloadFile = asyncHandler(async (req: any, res: any, next: any) => {
  let fileName = req.query.fileName;
  const filePath = pathExpress.join(path, fileName); // Change 'path' to your directory
  res.sendFile(filePath, fileName);
});

interface Slide {
  id: string;
  slideType: string;
  pagePosition: number | string;
  contents: Content[];
  summary?: any; // Using any to avoid conflict with unexported internal types in utils
}

interface Content {
  titleSlide?: string;
  subTitle?: string;
  data: Data[];
}

interface Data {
  visualization: string;
  metric?: string;
  titleContent?: string;
  details?: any;
}

// interface SummaryConfig {
//   enabled: boolean;
//   position?: 'left' | 'top';
//   text?: string;
// }

interface TableColorMap {
  [key: string]: {
    headerFill: string;
    oddRowFill: string;
    headerFontColor?: string;
    evenRowFill?: string;
  };
}

export const generatePpt = asyncHandler(async (req: any, res: any, next: any) => {
  let reportName = req.body.customReportName;
  let colorChoice = req.body.colorChoice || 'blue';
  const formattedReportName = reportName.replace('/', '-');
  let slides: Slide[] = req.body.slides;
  slides = splitSlidesWithLargeTables(slides);

  let randomString = (Math.random() + 1).toString(36).substring(7);
  let fileName = formattedReportName + '-' + randomString + '.pptx';
  let fullPathAndFileName = path + fileName;

  let advancedResults = {
    fileName: fileName,
    filePath: fullPathAndFileName,
  };

  let pptx = new pptxgenjs();
  pptx.layout = 'LAYOUT_WIDE';
  MasterSlide.createMasterSlides(pptx, colorChoice);
  ('use strict');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  const tableColorMap: TableColorMap = {
    red: {
      headerFill: '8A0000',
      oddRowFill: 'E8C999',
    },
    green: {
      headerFill: '386641',
      oddRowFill: '61B258',
    },
    navy: {
      headerFill: '3A6D8C',
      oddRowFill: 'D4EBF8',
    },
    yellow: {
      headerFill: 'FFB433',
      oddRowFill: 'FFF9BD',
    },
    lightBlue: {
      headerFill: '23B7CB',
      oddRowFill: 'E0F7FA',
    },
    blue: {
      headerFill: '00BAEC', // Light cyan to match reference
      oddRowFill: 'E7F4F9', // Very light blue for subtle alternating
      headerFontColor: 'FFFFFF',
      evenRowFill: 'FFFFFF',
    },
  };

  const chosenTableColors = tableColorMap[colorChoice];


  let allFetch: Promise<any>[] = [];
  for (let i = 0; i < slides.length; i++) {
    slides[i].contents[0].data.forEach((el) => {
      const visualization = el.visualization;
      if (visualization == 'sample_post' || visualization == 'sample_post_single') {
        el.details?.streamOutput?.forEach((post: any) => {
          if (post.socialMedia == 'instagram') {
            const instagramImage = generateInstagramImage({
              browser,
              url: post.link,
            });
            allFetch.push(instagramImage);
          } else if (post.socialMedia == 'twitter') {
            const twitterImage = generateTweetThumbnail({
              browser,
              url: post.link,
              socialMedia: post.socialMedia,
            });
            allFetch.push(twitterImage);
          } else if (post.socialMedia == 'facebook') {
            const facebookImage = generateFacebookThumbnail({
              url: post.link,
              socialMedia: post.socialMedia,
            });
            allFetch.push(facebookImage);
          }
          // else if (post.socialMedia == 'tiktok') {
          //   tiktokImage = generateDynamicThumbnail({
          //     browser,
          //     url: post.link,
          //     socialMedia: post.socialMedia,
          //   });
          //   allFetch.push(tiktokImage);
          // } else if (post.socialMedia == 'youtube') {
          //   youtubeImage = generateDynamicThumbnail({
          //     browser,
          //     url: post.link,
          //     socialMedia: post.socialMedia,
          //   });
          //   allFetch.push(youtubeImage);
          // }
          else {
            allFetch.push(
              axios.get(
                // `https://crawlercluster.dashboard.nolimit.id/media-preview/get-preview?social_media=${post.socialMedia}&uri=${post.link}&force_fetch=true`,
                `https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${post.link}`,
                {
                  responseType: 'arraybuffer',
                  timeout: 45000,
                },
              ),
            );
          }
        });
      }
    });
  }
  try {
    const allResponse = await Promise.allSettled(allFetch);
    let resIdx = 0;
    for (let i = 0; i < slides.length; i++) {
      slides[i].contents[0].data.forEach((el, idx1) => {
        const visualization = el.visualization;
        if (visualization == 'sample_post' || visualization == 'sample_post_single') {
          el.details?.streamOutput?.forEach((post: any, idx2: number) => {
            if (
              allResponse[resIdx].status == 'fulfilled' &&
              (allResponse[resIdx] as PromiseFulfilledResult<any>).value &&
              (allResponse[resIdx] as PromiseFulfilledResult<any>).value.data
            ) {
              slides[i].contents[0].data[idx1].details.streamOutput[idx2].imgBase64 = Buffer.from(
                (allResponse[resIdx] as PromiseFulfilledResult<any>).value.data,
                'binary',
              ).toString('base64');
            } else {
              slides[i].contents[0].data[idx1].details.streamOutput[idx2].imgBase64 = '';
            }
            resIdx++;
          });
        }
      });
    }
  } catch (error) { }
  console.log('end pre-fetching sample post :', new Date());

  for (let i = 0; i < slides.length; i++) {
    let slide = slides[i];
    let titleSlide = slide.contents[0]?.titleSlide || '';
    let subTitle = slide.contents[0]?.subTitle || '';
    let slideType = slide.slideType;
    let id = slide.id;
    // let page = slide.pagePosition;
    let contents = slide.contents;
    let summaryConfig = slide.summary || { enabled: false };

    for (let c = 0; c < contents.length; c++) {
      let content = contents[c];
      let datas = content.data;
      if (slideType == 'titleSlide') {
        const isFirstSlide = i === 0;
        const hasSubtitle = subTitle && subTitle.length > 0;
        // User clarified pagePosition starts at 0. Checking both 0 and 1 to be safe.
        const isPageOne = slide.pagePosition === 0 || slide.pagePosition === '0' || slide.pagePosition === 1 || slide.pagePosition === '1';

        console.log(`[Generate PPT] Slide ${i}: titleSlide check. isFirst=${isFirstSlide}, hasSub=${hasSubtitle}, pg=${slide.pagePosition}`);

        // Use TITLE_SLIDE (Design Cover) for the first slide check
        if (isFirstSlide || hasSubtitle || isPageOne) {
          console.log(`[Generate PPT] -> Using TITLE_SLIDE (Cover)`);
          let slide = pptx.addNewSlide({
            masterName: 'TITLE_SLIDE',
          });
          slide.addText(titleSlide, generateTitleContentSlide());
          slide.addText(subTitle || '', generateSubTitleContentSlide());
        } else {
          console.log(`[Generate PPT] -> Using SECTION_SLIDE`);
          // Simple Section Separator for subsequent pages without subtitle
          let slide = pptx.addNewSlide({
            masterName: 'SECTION_SLIDE',
          });
          slide.addText(titleSlide, { placeholder: 'separatorTitle' });
        }
      } else {
        let slide = pptx.addSlide({
          masterName: 'MASTER_PLAIN',
        });
        slide.addText(titleSlide, { placeholder: 'slideTitle' });

        // render summary box FIRST (before white card) so it appears outside
        if (summaryConfig.enabled && summaryConfig.text) {
          renderSummaryBox(slide, pptx, summaryConfig);
        }

        // Get adjusted white card configuration based on summary
        const cardConfig = getWhiteCardConfig(summaryConfig);

        if (slideType == 'threeOneContents') {
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: cardConfig.x,
            y: cardConfig.y,
            w: cardConfig.w - 0.4, // threeOneContents uses slightly smaller width
            h: cardConfig.h,
            fill: 'FFFFFF',
            shadow: { type: 'outer', color: 'aaaaaa', blur: 3, offset: 2, angle: 45, opacity: 0.5 },
            rectRadius: 0.1,
          });
        }

        if (slideType == 'twoContents') {
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: cardConfig.x,
            y: cardConfig.y,
            w: cardConfig.w,
            h: cardConfig.h,
            fill: 'FFFFFF',
            shadow: { type: 'outer', color: 'aaaaaa', blur: 3, offset: 2, angle: 45, opacity: 0.5 },
            rectRadius: 0.1,
          });
        }

        if (slideType == 'singleContents' || slideType == 'singleContent') {
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: cardConfig.x,
            y: cardConfig.y,
            w: cardConfig.w,
            h: cardConfig.h,
            fill: 'FFFFFF',
            shadow: { type: 'outer', color: 'aaaaaa', blur: 3, offset: 2, angle: 45, opacity: 0.5 },
            rectRadius: 0.1,
          });
        }

        if (slideType == 'twoOneContents' || slideType == 'oneTwoContents' || slideType == 'verticalFourContents') {
          slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
            x: cardConfig.x,
            y: cardConfig.y,
            w: cardConfig.w,
            h: cardConfig.h,
            fill: 'FFFFFF',
            shadow: { type: 'outer', color: 'aaaaaa', blur: 3, offset: 2, angle: 45, opacity: 0.5 },
            rectRadius: 0.1,
          });
        }

        // add line separator (skip if summary enabled)
        addLineSeparator(slideType, slide, pptx, summaryConfig);

        // Limit data items when summary is enabled at LEFT position in verticalFourContents
        // TOP summary doesn't need limit as vertical space is sufficient for all 4 items
        let effectiveDataLength = datas.length;
        if (
          slideType === 'verticalFourContents' &&
          summaryConfig &&
          summaryConfig.enabled &&
          summaryConfig.position === 'left'
        ) {
          effectiveDataLength = Math.min(datas.length, 3); // Max 3 items when summary is on left

        }

        for (let counter = 0; counter < effectiveDataLength; counter++) {
          let data = datas[counter];

          // Use Type Assertion if necessary or just ensure SummaryConfig is compatible
          let generatedPos = generatePositionWithSummary(slideType, counter, summaryConfig as any);
          console.log(`DEBUG: slideType=${slideType}, counter=${counter}, summaryConfig=${JSON.stringify(summaryConfig)}, generatedPos=${JSON.stringify(generatedPos)}`);
          let position = transformPosition(generatedPos, 0, 0.48);

          // Check if data item is empty (no metric and no visualization)
          if (!data.metric && !data.visualization) {
            // Render placeholder message instead of skipping
            addNoDataMessage(slide, position, data.titleContent || '');
            continue;
          }

          try {
            await generateSlide(
              pptx,
              slide,
              data,
              position,
              id,
              browser,
              counter,
              slideType,
              chosenTableColors,
              summaryConfig,
            );
          } catch (err) {
            console.error('Error generating slide item:', err);
            // console.error((err as Error).stack);
            // Do not throw, instead render error placeholder so other items can still render
            addNoDataMessage(slide, position, data.titleContent || 'Error Rendering Item');
          }
        }
      }
    }
  }

  pptx.addSlide('THANKS_SLIDE');

  await pptx.writeFile({ fileName: fullPathAndFileName });

  browser.close();
  successResponse.resultSuccessful(req, res, advancedResults);

  console.log(`Finished generate ppt for: ${fileName}`);
});

/**
 * @function generateSlide
 * @description
 * Fungsi utama untuk menghasilkan satu *slide* pada custom report PPTX.
 * Setiap metric memiliki handler masing-masing yang bertanggung jawab
 * untuk menentukan bagaimana data divisualisasikan (chart, table, image, dsb).
 *
 * Proses kerja:
 * 1. Data mentah dari API dinormalisasi lewat `normalizeData` agar struktur seragam.
 * 2. Metric diambil dari data yang telah dinormalisasi.
 * 3. Berdasarkan metric, fungsi ini mencari handler yang sesuai di `metricHandlers`.
 * 4. Jika ditemukan, handler tersebut dipanggil untuk menggambar elemen-elemen pada slide.
 * 5. Jika metric tidak memiliki handler (dan metric tidak null), akan muncul log peringatan di console.
 *
 */

async function generateSlide(
  pptx: any,
  slide: any,
  data: Data,
  position: any,
  id: string,
  browser: Browser,
  counter: number,
  slideType: string,
  chosenTableColors: any,
  summaryConfig: any, // Changed to any
) {
  // let integrationApi = "http://localhost:5432/api/v1/html_to_image/";
  const normalized = normalizeData(data);
  const metric = normalized.metric || '';

  const options = { id, browser, counter, slideType, chosenTableColors, summaryConfig, path };

  // Accessing metricHandlers dynamically using index signature if possible, or manual casting
  const handlers = metricHandlers as any;

  if (handlers[metric]) {
    await handlers[metric](normalized, slide, position, options);
  } else if (metric) {
    console.log(`No handler for metric: ${metric}`);
  }
}

function splitSlidesWithLargeTables(slides: Slide[]): Slide[] {
  let newSlides: Slide[] = [];

  slides.forEach((slide) => {
    // Check if Top Summary exists
    const isTopSummary = slide.summary && slide.summary.enabled && slide.summary.position === 'top';
    const isLeftSummary = slide.summary && slide.summary.enabled && slide.summary.position === 'left';

    let MAX_ROWS = 10;
    if (isTopSummary) MAX_ROWS = 100; // Truncate in handler
    if (isLeftSummary) MAX_ROWS = 10; // Truncate in handler (limit to 10)

    let needsSplit = false;
    let maxRows = 0;

    // Check if any content needs splitting
    if (slide.contents && slide.contents.length > 0) {
      slide.contents.forEach((content) => {
        if (content.data) {
          content.data.forEach((d) => {
            // Check if visualization is table and has body
            if (d.visualization === 'table' && d.details?.table?.body?.length > MAX_ROWS) {
              needsSplit = true;
              maxRows = Math.max(maxRows, d.details.table.body.length);
            }
          });
        }
      });
    }

    if (!needsSplit) {
      newSlides.push(slide);
    } else {
      // Perform Split
      let chunksCount = Math.ceil(maxRows / MAX_ROWS);
      for (let i = 0; i < chunksCount; i++) {
        // Deep copy slide to avoid ref issues
        let slideClone = JSON.parse(JSON.stringify(slide));

        // Update contents for this chunk
        slideClone.contents.forEach((content: Content) => {
          if (content.data) {
            content.data.forEach((d) => {
              if (d.visualization === 'table' && d.details?.table?.body) {
                let start = i * MAX_ROWS;
                let end = start + MAX_ROWS;
                // Slice the body
                let originalBody = d.details.table.body;
                let slicedBody = originalBody.slice(start, end);
                d.details.table.body = slicedBody;
              }
            });
          }
        });
        newSlides.push(slideClone);
      }
    }
  });
  return newSlides;
}
