
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
      } else if (slideType == 'executiveSummary') {
        // ======================================================
        // EXECUTIVE SUMMARY SLIDE — 2 kolom bullet point
        // ======================================================
        const execSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

        // Judul di tengah atas
        execSlide.addText(titleSlide || 'RINGKASAN EKSEKUTIF', {
          x: 2.5, y: 1.45, w: 8.33, h: 0.55,
          fontSize: 22, bold: true, color: '1A1A1A',
          align: 'center', fontFace: 'Arial',
        });

        // Ambil data kolom dari payload
        const execData = contents[0]?.data?.[0]?.details?.columns || [];
        const colPositions = [
          { x: 0.4,  w: 6.13 },  // Kolom kiri (Media Sosial) - Wider
          { x: 6.8, w: 6.13 },  // Kolom kanan (Media Online) - Wider
        ];

        execData.forEach((col: any, colIdx: number) => {
          const pos = colPositions[colIdx];
          if (!pos) return;

          // Bangun array text runs untuk satu kolom
          const textRuns: any[] = [];

          // Header kolom (tebal, warna gelap)
          textRuns.push({
            text: col.header || '',
            options: { bold: true, fontSize: 13, color: '0D1B2A', breakLine: true },
          });

          // Setiap item dalam kolom
          (col.items || []).forEach((item: any) => {
            // Label bold + value biasa
            textRuns.push({
              text: `\u2022 `,
              options: { bold: false, fontSize: 11, color: '444444' },
            });
            if (item.label) {
              textRuns.push({
                text: `${item.label}: `,
                options: { bold: true, fontSize: 11, color: '0D1B2A' },
              });
            }
            textRuns.push({
              text: item.value || '',
              options: { bold: false, fontSize: 11, color: '1A1A1A', breakLine: true },
            });
          });

          execSlide.addText(textRuns, {
            x: pos.x, y: 2.3, w: pos.w, h: 4.8,
            valign: 'top', fontFace: 'Arial',
            align: 'justify', // Rata kanan-kiri
            lineSpacingMultiple: 1.1, // Beri jarak sedikit biar enak dibaca
          });
        });

      } else if (slideType == 'volumeChart') {
        // ======================================================
        // VOLUME CHART SLIDE — 2 summary + 2 bar charts
        // ======================================================
        const volSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

        // Judul Utama (Centered)
        volSlide.addText(titleSlide || 'VOLUME PERCAKAPAN DAN PEMBERITAAN', {
          x: 2.5, y: 1.45, w: 8.33, h: 0.55,
          fontSize: 22, bold: true, color: '1A1A1A',
          align: 'center', fontFace: 'Arial',
        });

        const volData = contents[0]?.data?.[0]?.details || {};

        // === LEFT SIDE (Media Sosial) ===
        const left = volData.left || {};
        // Label header kiri
        volSlide.addText(left.label || 'Media Sosial', {
          x: 0.6, y: 2.3, w: 6.0, h: 0.4,
          fontSize: 18, bold: true, color: '1A1A1A', align: 'center', fontFace: 'Arial'
        });
        // Summary Kiri
        volSlide.addText(left.summary || '', {
          x: 0.6, y: 2.75, w: 6.0, h: 1.5,
          fontSize: 11, color: '1A1A1A', align: 'justify', fontFace: 'Arial',
          lineSpacingMultiple: 1.1
        });
        // Chart Kiri (Bar)
        if (left.chart) {
          const chartData = [{
            name: 'Value',
            labels: left.chart.map((c: any) => c.name),
            values: left.chart.map((c: any) => c.value)
          }];
          volSlide.addChart(pptx.charts.BAR, chartData, {
            x: 0.6, y: 4.2, w: 6.0, h: 2.5,
            barDir: 'col',
            chartColors: ['00BAEC', 'F37021'], // Blue, Orange
            showValue: true,
            dataLabelPosition: 'outEnd',
            dataLabelFontSize: 10,
            valAxisHidden: false,
            valGridLine: { style: 'none' },
            catAxisLineShow: true,
            showLegend: true,
            legendPos: 'b'
          });
        }

        // === RIGHT SIDE (Media Online) ===
        const right = volData.right || {};
        // Label header kanan
        volSlide.addText(right.label || 'Media Online', {
          x: 6.75, y: 2.3, w: 6.0, h: 0.4,
          fontSize: 18, bold: true, color: '1A1A1A', align: 'center', fontFace: 'Arial'
        });
        // Summary Kanan
        volSlide.addText(right.summary || '', {
          x: 6.75, y: 2.75, w: 6.0, h: 1.5,
          fontSize: 11, color: '1A1A1A', align: 'justify', fontFace: 'Arial',
          lineSpacingMultiple: 1.1
        });
        // Chart Kanan (Bar)
        if (right.chart) {
          const chartData = [{
            name: 'Value',
            labels: right.chart.map((c: any) => c.name),
            values: right.chart.map((c: any) => c.value)
          }];
          volSlide.addChart(pptx.charts.BAR, chartData, {
            x: 6.75, y: 4.2, w: 6.0, h: 2.5,
            barDir: 'col',
            chartColors: ['00BAEC', 'F37021'], // Blue, Orange
            showValue: true,
            dataLabelPosition: 'outEnd',
            dataLabelFontSize: 10,
            valAxisHidden: false,
            valGridLine: { style: 'none' },
            catAxisLineShow: true,
            showLegend: true,
            legendPos: 'b'
          });
        }

        // Footer Note
        if (volData.footerNote) {
          volSlide.addText(volData.footerNote, {
            x: 0.6, y: 7.0, w: 12.13, h: 0.3,
            fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
          });
        }

      } else if (slideType == 'trendChart') {
        // ======================================================
        // TREND CHART SLIDE — 2 stacked line charts + sidebar
        // ======================================================
        const trSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
        const trData = contents[0]?.data?.[0]?.details || {};

        // Judul Utama (Centered)
        trSlide.addText(titleSlide || 'TREN HARIAN PERCAKAPAN DAN PEMBERITAAN', {
          x: 2.5, y: 1.45, w: 8.33, h: 0.55,
          fontSize: 20, bold: true, color: '1A1A1A',
          align: 'center', fontFace: 'Arial',
        });

        const chartX = 0.5;
        const chartW = 9.0;
        const summaryX = 9.8;
        const summaryW = 3.2;

        // --- TOP SECTION (PERCAKAPAN) ---
        const top = trData.topChart || {};
        trSlide.addText(top.label || 'PERCAKAPAN', {
          x: chartX, y: 1.8, w: chartW, h: 0.3,
          fontSize: 16, color: '666666', align: 'center', fontFace: 'Arial'
        });

        if (top.series) {
          const chartData = top.series.map((s: any) => ({
            name: s.name,
            labels: s.data.map((d: any) => {
               // Format d-MMM-yy (e.g. 6-Mar-26)
               const date = new Date(d.timestamp);
               const day = date.getDate();
               const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               const mon = months[date.getMonth()];
               const yr = date.getFullYear().toString().slice(-2);
               return `${day}-${mon}-${yr}`;
            }),
            values: s.data.map((d: any) => d.value)
          }));

          trSlide.addChart(pptx.charts.LINE, chartData, {
            x: chartX, y: 2.1, w: chartW, h: 2.4,
            chartColors: ['00BAEC', 'F37021'],
            lineDataSymbol: 'circle',
            lineDataSymbolSize: 6,
            showValue: true,
            dataLabelPosition: 't',
            dataLabelColor: '000000',
            dataLabelFontSize: 9,
            valAxisHidden: false,
            valAxisLineShow: true, // Show vertical line
            valGridLine: { style: 'none' },
            catAxisLineShow: true, // Show horizontal line
            catAxisLabelFontSize: 9,
            catAxisLabelRotate: -45,
            catAxisCrossingPos: 'autoZero', // Try to start axis from zero
            valAxisCrossingPos: 'autoZero',
            showLegend: true,
            legendPos: 'b'
          });
        }

        // Summary Top
        if (top.summary) {
          const bulletPoints = top.summary.map((s: string) => ({ text: s, options: { bullet: true, fontSize: 10, color: '1A1A1A' } }));
          trSlide.addText(bulletPoints, {
            x: summaryX, y: 2.1, w: summaryW, h: 2.4,
            valign: 'top', align: 'justify', fontFace: 'Arial', lineSpacingMultiple: 1.1
          });
        }

        // --- BOTTOM SECTION (PEMBERITAAN) ---
        const bottom = trData.bottomChart || {};
        trSlide.addText(bottom.label || 'PEMBERITAAN', {
          x: chartX, y: 4.6, w: chartW, h: 0.3,
          fontSize: 16, color: '666666', align: 'center', fontFace: 'Arial'
        });

        if (bottom.series) {
          const chartData = bottom.series.map((s: any) => ({
            name: s.name,
            labels: s.data.map((d: any) => {
               const date = new Date(d.timestamp);
               const day = date.getDate();
               const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               const mon = months[date.getMonth()];
               const yr = date.getFullYear().toString().slice(-2);
               return `${day}-${mon}-${yr}`;
            }),
            values: s.data.map((d: any) => d.value)
          }));

          trSlide.addChart(pptx.charts.LINE, chartData, {
            x: chartX, y: 4.9, w: chartW, h: 2.1,
            chartColors: ['00BAEC', 'F37021'],
            lineDataSymbol: 'circle',
            lineDataSymbolSize: 6,
            showValue: true,
            dataLabelPosition: 't',
            dataLabelColor: '000000',
            dataLabelFontSize: 9,
            valAxisHidden: false,
            valAxisLineShow: true, // Show vertical line
            valGridLine: { style: 'none' },
            catAxisLineShow: true, // Show horizontal line
            catAxisLabelFontSize: 9,
            catAxisLabelRotate: -45,
            catAxisCrossingPos: 'autoZero', // Try to start axis from zero
            valAxisCrossingPos: 'autoZero',
            showLegend: true,
            legendPos: 'b'
          });
        }

        // Summary Bottom
        if (bottom.summary) {
          const bulletPoints = bottom.summary.map((s: string) => ({ text: s, options: { bullet: true, fontSize: 10, color: '1A1A1A' } }));
          trSlide.addText(bulletPoints, {
            x: summaryX, y: 5.5, w: summaryW, h: 1.5,
            valign: 'top', align: 'justify', fontFace: 'Arial', lineSpacingMultiple: 1.1
          });
        }

        // Footer Note
        if (trData.footerNote) {
          trSlide.addText(trData.footerNote, {
            x: 0.6, y: 7.2, w: 12.13, h: 0.3,
            fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
          });
        }

      } else if (slideType == 'hourlyTrendChart') {
        // ======================================================
        // HOURLY TREND CHART SLIDE — Wide chart + Bottom summary
        // ======================================================
        const hrSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
        const hrData = contents[0]?.data?.[0]?.details || {};

        // Judul Utama (Centered)
        hrSlide.addText(titleSlide || 'TREN PERCAKAPAN PER JAM DI MEDIA SOSIAL', {
          x: 2.5, y: 1.45, w: 8.33, h: 0.55,
          fontSize: 20, bold: true, color: '1A1A1A',
          align: 'center', fontFace: 'Arial',
        });

        // --- CHART SECTION (Wide) ---
        if (hrData.series) {
          const chartData = hrData.series.map((s: any) => ({
            name: s.name,
            labels: s.data.map((d: any) => {
               // Show only hour if space is tight, or specific format
               // 03 6 9 12... 
               const date = new Date(d.timestamp);
               const hours = date.getHours();
               const day = date.getDate();
               const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
               const mon = months[date.getMonth()];
               // Return hours for major ticks, or combined
               return `${hours}\n${day}-${mon}`;
            }),
            values: s.data.map((d: any) => d.value)
          }));

          hrSlide.addChart(pptx.charts.LINE, chartData, {
            x: 0.6, y: 2.1, w: 12.13, h: 3.8,
            chartColors: ['00BAEC'], // Single Blue for Talk
            lineDataSymbol: 'none', // Too many points for symbols
            showValue: false, // Too many points for values
            valAxisHidden: false,
            valAxisLineShow: true,
            valGridLine: { style: 'none' },
            catAxisLineShow: true,
            catAxisLabelFontSize: 8,
            catAxisLabelRotate: 0,
            catAxisCrossingPos: 'autoZero',
            valAxisCrossingPos: 'autoZero',
            showLegend: false
          });
        }

        // --- SUMMARY SECTION (Bottom) ---
        if (hrData.summary) {
          const bulletPoints = hrData.summary.map((s: string) => ({ 
            text: s, 
            options: { bullet: true, fontSize: 11, color: '1A1A1A' } 
          }));
          hrSlide.addText(bulletPoints, {
            x: 0.6, y: 6.1, w: 12.13, h: 1.0,
            valign: 'top', align: 'justify', fontFace: 'Arial', lineSpacingMultiple: 1.1
          });
        }

        // Footer Note
        if (hrData.footerNote) {
          hrSlide.addText(hrData.footerNote, {
            x: 0.6, y: 7.2, w: 12.13, h: 0.3,
            fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
          });
        }

      } else if (slideType == 'socialMediaDetail') {
        // ======================================================
        // SOCIAL MEDIA DETAIL SLIDE — Pie Chart + Summary
        // ======================================================
        const smSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
        const smData = contents[0]?.data?.[0]?.details || {};

        // Judul Utama (Centered)
        smSlide.addText(titleSlide || 'RINCIAN MEDIA SOSIAL', {
          x: 2.5, y: 1.45, w: 8.33, h: 0.55,
          fontSize: 20, bold: true, color: '1A1A1A',
          align: 'center', fontFace: 'Arial',
        });

        // --- SUMMARY TEXT (Top) ---
        if (smData.summary) {
          smSlide.addText(smData.summary, {
            x: 1.25, y: 2.1, w: 10.5, h: 1.0,
            fontSize: 14, color: '1A1A1A', align: 'center', valign: 'top', fontFace: 'Arial',
            lineSpacingMultiple: 1.1
          });
        }

        // --- PIE CHART SECTION ---
        if (smData.chartData) {
          // Standard Platform Colors
          const colorMap: any = {
             'instagram': '833AB4', // Purple
             'twitter': '1DA1F2',   // Light Blue
             'tiktok': '000000',    // Black
             'youtube': 'FF0000',   // Red
             'facebook': '1877F2'   // Blue
          };

          const chartData = [{
            name: 'Platform Distribution',
            labels: smData.chartData.map((c: any) => {
              // Capitalize first letter for legend
              return c.name.charAt(0).toUpperCase() + c.name.slice(1);
            }),
            values: smData.chartData.map((c: any) => c.value)
          }];

          const chartColors = smData.chartData.map((c: any) => colorMap[c.name.toLowerCase()] || 'CCCCCC');

          smSlide.addChart(pptx.charts.PIE, chartData, {
            x: 3.25, y: 2.6, w: 6.83, h: 3.6, // Centered & moved up
            chartColors: chartColors,
            showValue: true,
            showPercent: false,
            dataLabelColor: '000000', // Black labels for visibility outside
            dataLabelFontSize: 10,
            dataLabelPosition: 'outEnd', // Fixed clipping by moving labels outside
            showLegend: true,
            legendPos: 'r',
            legendFontSize: 11,
          });
        }

        // --- TOTAL LABEL (Exactly Centered under chart) ---
        if (smData.totalLabel) {
          smSlide.addText(smData.totalLabel, {
            x: 0, y: 6.25, w: 13.33, h: 0.4, // Full width to ensure perfect centering
            fontSize: 20, bold: true, color: '1A1A1A', align: 'center', fontFace: 'Arial'
          });
        }

        // Footer Note (Exactly Centered with smaller gap)
        if (smData.footerNote) {
          smSlide.addText(smData.footerNote, {
            x: 0, y: 6.75, w: 13.33, h: 0.3, // Full width to ensure perfect centering
            fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
          });
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
