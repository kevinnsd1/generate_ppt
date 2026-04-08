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
import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer';
import { generateInstagramImage } from './puppeteerGetInstagramThumbnail';
import { generateTweetThumbnail } from './puppeteerGetTwitterThumbnail';
import { generateFacebookThumbnail } from './puppeteerGetFacebookThumbnail';
import { generateWordcloudImage } from './puppeteerGenerateImage';
// import * as metricHandlers from '../metrics';
import metricHandlers from '../metrics';
import normalizeData = require('../utils/dataNormalizer');
import { addLineSeparator } from '../utils/line';
import { generateTitleContentSlide, generateSubTitleContentSlide } from '../utils/content';
import komdigiSlideHandlers from './komdigi_slides';
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
  // Process data to see if we need to split slides (e.g. max tables rows, or max chart points)
  slides = splitSlidesWithLargeData(slides);

  // No need for physical filename/path logic anymore, returning as Buffer
  // let randomString = (Math.random() + 1).toString(36).substring(7);
  // let fileName = formattedReportName + '-' + randomString + '.pptx';
  // let fullPathAndFileName = path + fileName;

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
  const tempDir = pathExpress.join(__dirname, '../../exports/temp/');
  let tempFiles: string[] = []; // Track temp files for cleanup

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].contents && slides[i].contents.length > 0 && slides[i].contents[0].data) {
      slides[i].contents[0].data.forEach((el: any) => {
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
            } else {
              allFetch.push(
                axios.get(`https://crawlercluster.dashboard.nolimit.id/media-preview/thumbnail?link=${post.link}`, {
                  responseType: 'arraybuffer',
                  timeout: 45000,
                }),
              );
            }
          });
        } else if (visualization == 'wordcloud') {
          const wcData = el.details || {};

          // Helper function to generate white background image and return path
          const fetchAndRenderWordcloud = async (sideData: any, side: string) => {
            if (!sideData) return { success: false };

            // 1. If payload provides nameValue or data array, use the native D3 Wordcloud generator
            let dataArr = sideData.nameValue || sideData.data;
            if (Array.isArray(dataArr) && dataArr.length > 0) {
              try {
                const b64 = await generateWordcloudImage({
                  browser,
                  pathDir: '',
                  data: dataArr,
                  id: `komdigi_${side}_${Date.now()}`,
                });
                return { success: !!b64, base64: b64, side };
              } catch (e) {
                console.error(`Native wordcloud generation failed for ${side}`, e);
                // Fallback to image property if native fails
              }
            }

            // 2. If it's a URL or Base64 string, wrap in white HTML background
            const imageSrc = sideData.image;
            if (!imageSrc) return { success: false };

            try {
              const wcPage = await browser.newPage();
              await wcPage.setViewport({ width: 800, height: 400 });

              await wcPage.setContent(
                `
                <body style="margin:0;background:white;display:flex;align-items:center;justify-content:center;min-height:100vh;">
                  <img style="max-width:100%;max-height:100%;object-fit:contain;" src="${imageSrc}" />
                </body>
              `,
                { waitUntil: 'networkidle0' },
              );

              const b64 = await wcPage.screenshot({ omitBackground: false, encoding: 'base64' });
              await wcPage.close();
              return { success: !!b64, base64: b64, side };
            } catch (e) {
              console.error(`Puppeteer screenshot failed for wordcloud ${side}`, e);
              return { success: false };
            }
          };

          if (wcData.left) {
            allFetch.push(fetchAndRenderWordcloud(wcData.left, 'left'));
          }
          if (wcData.right) {
            allFetch.push(fetchAndRenderWordcloud(wcData.right, 'right'));
          }
        }
      });
    }
  }

  try {
    const allResponse = await Promise.allSettled(allFetch);
    let resIdx = 0;
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    for (let i = 0; i < slides.length; i++) {
      if (slides[i].contents && slides[i].contents.length > 0 && slides[i].contents[0].data) {
        slides[i].contents[0].data.forEach((el: any, idx1: number) => {
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
          } else if (visualization == 'wordcloud') {
            const wcData = el.details || {};
            if (wcData.left) {
              const result = (allResponse[resIdx] as PromiseFulfilledResult<any>)?.value;
              if (result && result.success && result.side === 'left') {
                slides[i].contents[0].data[idx1].details.left.image = 'data:image/png;base64,' + result.base64;
              }
              resIdx++;
            }
            if (wcData.right) {
              const result = (allResponse[resIdx] as PromiseFulfilledResult<any>)?.value;
              if (result && result.success && result.side === 'right') {
                slides[i].contents[0].data[idx1].details.right.image = 'data:image/png;base64,' + result.base64;
              }
              resIdx++;
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error pre-fetching images:', error);
  }
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
        const isPageOne =
          slide.pagePosition === 0 ||
          slide.pagePosition === '0' ||
          slide.pagePosition === 1 ||
          slide.pagePosition === '1';

        console.log(
          `[Generate PPT] Slide ${i}: titleSlide check. isFirst=${isFirstSlide}, hasSub=${hasSubtitle}, pg=${slide.pagePosition}`,
        );

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
      } else if (komdigiSlideHandlers[id] || komdigiSlideHandlers[slideType]) {
        // ======================================================
        // KOMDIGI SPECIFIC CUSTOM SLIDES (Refactored)
        // ======================================================
        const handler = komdigiSlideHandlers[id] || komdigiSlideHandlers[slideType];
        handler(pptx, contents[0], titleSlide);
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
          console.log(
            `DEBUG: slideType=${slideType}, counter=${counter}, summaryConfig=${JSON.stringify(summaryConfig)}, generatedPos=${JSON.stringify(generatedPos)}`,
          );
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
  // Always append TERIMA KASIH closing slide at the end of every report
  try {
    const closingSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

    // Large light blue background box — fills most of the slide (below header area)
    closingSlide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.6, y: 1.85, w: 12.13, h: 5.2,
      fill: 'E0F7FA',
      line: { type: 'none' },
    });

    // Darker blue accent box on top-right corner of the blue box
    closingSlide.addShape(pptx.shapes.RECTANGLE, {
      x: 10.7, y: 1.85, w: 2.03, h: 0.7,
      fill: 'B2EBF2',
      line: { type: 'none' },
    });

    // TERIMA KASIH text — vertically centered in the blue box
    closingSlide.addText('TERIMA KASIH', {
      x: 1.0, y: 3.6, w: 9.0, h: 1.5,
      fontSize: 48,
      bold: true,
      color: '1A1A1A',
      fontFace: 'Arial',
      valign: 'middle',
      align: 'left',
    });

    console.log('[Generate PPT] TERIMA KASIH closing slide added.');
  } catch (closingErr) {
    console.error('[Generate PPT] Failed to add closing slide:', closingErr);
  }



  const buffer = (await pptx.write('nodebuffer')) as Buffer;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.setHeader('Content-Disposition', `attachment; filename="${formattedReportName}.pptx"`);

  browser.close();
  res.send(buffer);

  // Cleanup: delete temp files
  setTimeout(() => {
    tempFiles.forEach((file) => {
      try {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    });
  }, 5000); // Wait 5s to ensure PPTXGenJS is done reading them

  console.log(`Finished generate ppt (Buffer) for: ${reportName}`);
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

function splitSlidesWithLargeData(slides: Slide[]): Slide[] {
  let newSlides: Slide[] = [];

  const MAX_ROWS = 10; // Max table rows per slide
  const MAX_DAYS_HOURLY = 10; // Max days per hourly chart slide

  slides.forEach((slide) => {
    const isTopSummary = slide.summary && slide.summary.enabled && slide.summary.position === 'top';
    if (isTopSummary) {
      newSlides.push(slide);
      return;
    }

    let needsSplit = false;
    let splitType = ''; // 'table' | 'hourly' | 'chart'
    let maxSplits = 0;

    // ---- SCAN: detect if anything needs splitting ----
    if (slide.contents && slide.contents.length > 0) {
      slide.contents.forEach((content: any) => {
        if (!content.data) return;
        content.data.forEach((d: any) => {
          // --- TABLE ---
          if (d.visualization === 'table' && d.details?.table?.body?.length > MAX_ROWS) {
            needsSplit = true;
            splitType = 'table';
            maxSplits = Math.max(maxSplits, Math.ceil(d.details.table.body.length / MAX_ROWS));
          }

          // --- HOURLY LINE: split by unique calendar days ---
          if (d.visualization === 'hourly_line' && d.details?.series?.length > 0) {
            const firstSeries = d.details.series[0];
            if (!firstSeries?.data?.length) return;

            // Collect unique date strings from timestamps
            const uniqueDays: string[] = [];
            firstSeries.data.forEach((pt: any) => {
              const ts = pt.timestamp || '';
              const date = new Date(ts);
              if (!isNaN(date.getTime())) {
                // Use UTC date string as unique key (YYYY-MM-DD)
                const dayKey = date.toISOString().slice(0, 10);
                if (!uniqueDays.includes(dayKey)) uniqueDays.push(dayKey);
              }
            });

            if (uniqueDays.length > MAX_DAYS_HOURLY) {
              needsSplit = true;
              splitType = 'hourly';
              maxSplits = Math.max(maxSplits, Math.ceil(uniqueDays.length / MAX_DAYS_HOURLY));
            }
          }

          // --- OTHER LINE CHARTS: split by raw data point count ---
          if ((d.visualization === 'trend_line' || d.visualization === 'line_chart') && d.details?.series?.length > 0) {
            const dataLen = d.details.series[0].data?.length || 0;
            if (dataLen > MAX_ROWS) {
              needsSplit = true;
              splitType = 'chart';
              maxSplits = Math.max(maxSplits, Math.ceil(dataLen / MAX_ROWS));
            }
          }
        });
      });
    }

    // ---- NO SPLIT NEEDED ----
    if (!needsSplit) {
      newSlides.push(slide);
      return;
    }

    // ---- PERFORM SPLIT ----

    // For hourly charts: pre-compute the day ranges so each clone knows which days to keep
    let dayChunks: string[][] = [];
    if (splitType === 'hourly') {
      // Collect all unique days from the first series
      const allDays: string[] = [];
      slide.contents.forEach((content: any) => {
        if (!content.data) return;
        content.data.forEach((d: any) => {
          if (d.visualization === 'hourly_line' && d.details?.series?.[0]?.data) {
            d.details.series[0].data.forEach((pt: any) => {
              const ts = pt.timestamp || '';
              const date = new Date(ts);
              if (!isNaN(date.getTime())) {
                const dayKey = date.toISOString().slice(0, 10);
                if (!allDays.includes(dayKey)) allDays.push(dayKey);
              }
            });
          }
        });
      });
      // Chunk the day list into groups of MAX_DAYS_HOURLY
      for (let i = 0; i < allDays.length; i += MAX_DAYS_HOURLY) {
        dayChunks.push(allDays.slice(i, i + MAX_DAYS_HOURLY));
      }
      maxSplits = dayChunks.length;
    }

    for (let i = 0; i < maxSplits; i++) {
      const slideClone = JSON.parse(JSON.stringify(slide));

      slideClone.contents.forEach((content: any) => {
        if (!content.data) return;
        content.data.forEach((d: any) => {
          // TABLE split
          if (splitType === 'table' && d.visualization === 'table' && d.details?.table?.body) {
            const start = i * MAX_ROWS;
            const end = start + MAX_ROWS;
            d.details.table.body = d.details.table.body.slice(start, end);
          }

          // HOURLY split — keep only data points whose date is within the day chunk
          if (splitType === 'hourly' && d.visualization === 'hourly_line' && d.details?.series) {
            const allowedDays = new Set(dayChunks[i]);
            d.details.series.forEach((s: any) => {
              if (s.data) {
                s.data = s.data.filter((pt: any) => {
                  const ts = pt.timestamp || '';
                  const date = new Date(ts);
                  if (!isNaN(date.getTime())) {
                    return allowedDays.has(date.toISOString().slice(0, 10));
                  }
                  return false;
                });
              }
            });
          }

          // OTHER CHART split (raw index-based)
          if (
            splitType === 'chart' &&
            (d.visualization === 'trend_line' || d.visualization === 'line_chart') &&
            d.details?.series
          ) {
            const start = i * MAX_ROWS;
            const end = start + MAX_ROWS;
            d.details.series.forEach((s: any) => {
              if (s.data) s.data = s.data.slice(start, end);
            });
          }
        });
      });

      newSlides.push(slideClone);
    }
  });
  return newSlides;
}
