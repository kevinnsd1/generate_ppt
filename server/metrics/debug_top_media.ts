import { handleArticleByMedia } from './articles';
const normalizeData = require('../utils/dataNormalizer');
import pptxgen from 'pptxgenjs';

// Mock Data from contoh.json (partial body for brevity)
const rawData: any = {
    "titleContent": "",
    "responseType": {
        "name": "table"
    },
    "metric": "article_by_media",
    "visualization": "table",
    "details": {
        "numericWithGrowth": null,
        "nameValue": null,
        "chronologicalGroup": null,
        "chronological": null,
        "user": null,
        "peakTime": null,
        "table": {},
        "groupSentiment": null,
        "groupPosition": null,
        "streamOutput": null,
        "numericOutput": null,
        "onlineMediaStream": null,
        "offlineMediaStream": null,
        "socialMediaSummary": null,
        "summary": null
    },
    "granularity": "1 day"
};

const pres = new pptxgen();
const slide = pres.addSlide();

console.log("Initialized real PptxGenJS instance.");

const position = { x: 1, y: 1, w: 5, h: 5 };
const options = {
    chosenTableColors: {
        oddRowFill: 'E7F4F9',
        evenRowFill: 'FFFFFF',
        headerFill: '00BAEC',
        headerFontColor: 'FFFFFF'
    }
};

console.log("Starting Debug Script...");

try {
    const normalized = normalizeData(rawData);
    console.log("Normalized Data Table keys:", Object.keys(normalized.table || {}));

    handleArticleByMedia(normalized, slide, position, options);
    console.log("Handler executed successfully.");
} catch (error: any) {
    console.error("Caught Error:", error);
    console.error(error.stack);
}
