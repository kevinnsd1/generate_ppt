import pptxgen from 'pptxgenjs';
const { generateTitleContent } = require('../utils/content');
const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateSamplePostPpt } = require('../utils/sample');
const { generateWordcloudImage } = require('../controllers/puppeteerGenerateImage');
import * as pathExpress from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require('../../server/config/config.json')[env];
// Override path for local development to avoid ENOENT
let exportPath = pathExpress.join(__dirname, '../../exports/');
// let exportPath = config.EXPORT_PATH;

// Interface untuk data WordCloud
interface WordCloudData {
    titleContent: string;
    table?: any;
    nameValue?: any[];
    visualization?: string;
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

// Interface untuk Options
interface WordCloudOptions {
    id: string;
    browser: any;
    chosenTableColors?: {
        oddRowFill: string;
        evenRowFill: string;
        headerFill: string;
        headerFontColor: string;
    };
}

/**
 * Menangani pembuatan slide Word Cloud
 */
async function handleWordCloud(data: WordCloudData, slide: any, position: Position, options: WordCloudOptions) {
    const { titleContent, table, nameValue } = data;
    let { visualization } = data;
    const { id, browser, chosenTableColors } = options;

    visualization = visualization ? visualization.trim().toLowerCase() : '';

    // Data validation
    if ((visualization === 'word_cloud' && (!nameValue || nameValue.length === 0)) ||
        (visualization === 'table' && (!table || !table.body || table.body.length === 0))) {
        console.log(`[handleWordCloud] Data is empty for ${titleContent}`);
        if (titleContent) {
            slide.addText(titleContent, generateTitleContent(position));
            slide.addText('Data Not Available', {
                x: position.x, y: position.y + 1, w: position.w,
                align: 'center', color: '888888', fontSize: 14
            });
        }
        return;
    }

    const handlers: { [key: string]: () => Promise<void> | void } = {
        table: () => {
            let colWidths = [0.5, 2.5, 1.0, 1.0, 1.0];
            let adjustedPosition = { ...position, y: position.y - 0.2 };

            let modelData = chosenTableColors
                ? generateModelDataTable(
                    table,
                    chosenTableColors.oddRowFill,
                    chosenTableColors.evenRowFill,
                    chosenTableColors.headerFill,
                    chosenTableColors.headerFontColor
                )
                : generateModelDataTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
        },

        word_cloud: async () => {
            slide.addText(titleContent, generateTitleContent(position));
            try {
                // Ensure path ends with separator for generateWordcloudImage
                const pathWithSlash = exportPath.endsWith(pathExpress.sep) ? exportPath : exportPath + pathExpress.sep;
                const image = await generateWordcloudImage({ browser, pathDir: pathWithSlash, data: nameValue, id });

                const fullImagePath = pathExpress.join(exportPath, image);
                slide.addImage(generateSamplePostPpt(position, fullImagePath));
            } catch (error: any) {
                console.error(`error: failed to generate wordcloud image`, error);
                // Show error detail on slide for debugging
                slide.addText(`Gagal Memuat Wordcloud: ${error.message || error}`, {
                    x: position.x, y: position.y + 1, w: position.w,
                    align: 'center', color: 'FF0000', fontSize: 10
                });
            }
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    } else {
        console.warn(`No handler for wordcloud visualization: ${visualization}`);
        slide.addText(titleContent, generateTitleContent(position));
        slide.addText(`Visualization not found: ${visualization}`, {
            x: position.x, y: position.y + 1, w: position.w,
            align: 'center', color: 'FF0000', fontSize: 14
        });
    }
}

export {
    handleWordCloud
};
