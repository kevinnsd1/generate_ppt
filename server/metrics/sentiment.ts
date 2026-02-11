import pptxgen from 'pptxgenjs';
const {
    generateModelDataBarFromNameValue,
    generateModelDataBarSentimentAnalyst,
    generateModelDataStackBarFromGroupSentiment,
    generateBarSentiment,
    generateStackBarSentiment,
    generateModelDataStackBarFromNameValue,
} = require('../utils/bar');
const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateModelDataPie, generatePieSentiment } = require('../utils/pie');
const { generateTitleContent } = require('../utils/content');
const { addNoDataMessage, isDataEmpty } = require('../utils/noDataMessage');
const { filterTopNGroupSentiment } = require('../utils/dataFilter');
const { generatePie3DImage } = require('../controllers/puppeteerGenerateImage');
import { COLOR_SENTIMENT, COLOR_SENTIMENT_BLUE } from '../controllers/enums_charts';

// Interface untuk data Sentiment
interface SentimentData {
    titleContent: string;
    nameValue?: any[];
    table?: any;
    visualization: string;
}

// Interface untuk data Sentiment Analyst
interface SentimentAnalystData {
    titleContent: string;
    visualization: string;
    groupSentiment: any;
    metric?: string;
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

// Interface untuk Options
interface SentimentOptions {
    chosenTableColors?: {
        oddRowFill: string;
        evenRowFill: string;
        headerFill: string;
        headerFontColor: string;
    };
    id?: string;
    browser?: any;
    path?: string;
}

/**
 * Menangani pembuatan slide Sentiment
 */
async function handleSentiment(data: SentimentData, slide: any, position: Position, options: SentimentOptions) {
    const { titleContent, nameValue, table, visualization } = data;
    const { chosenTableColors, id, browser, path } = options;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => Promise<void> | void } = {
        pie: () => {
            // Check for empty data
            if (nameValue && isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            // Sort sentiment data to match COLOR_SENTIMENT order: Positive, Negative, Neutral
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedNameValue = nameValue
                ? nameValue.map((item: any) => ({ ...item })) // Create copy to avoid mutation
                    .sort((a: any, b: any) => {
                        const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                        const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                        // If name not found in order array, put it at the end
                        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                : [];

            let modelData = generateModelDataPie('Sentiment', sortedNameValue, 'none');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.PIE, modelData, generatePieSentiment(position, titleContent));
        },

        pie_3d: async () => {
            // Check for empty data
            if (nameValue && isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            // Sort sentiment data to match COLOR_SENTIMENT order: Positive, Negative, Neutral
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedNameValue = nameValue
                ? nameValue.map((item: any) => ({ ...item }))
                    .sort((a: any, b: any) => {
                        const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                        const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                : [];

            try {
                const pie3dImage = await generatePie3DImage({
                    browser,
                    pathDir: path,
                    id,
                    data: sortedNameValue,
                    colors: COLOR_SENTIMENT
                });

                slide.addText(titleContent, generateTitleContent(position));
                // Use generic image placement
                slide.addImage({
                    path: `${path}${pie3dImage}`,
                    x: position.x,
                    y: position.y,
                    w: position.w,
                    h: position.h
                });

            } catch (err: any) {
                console.error(`error: failed to generate pie 3d image for ${titleContent}`, err);
                slide.addText(`Chart Error: ${err.message}`, { x: position.x, y: position.y + 2, w: position.w, align: 'center', color: 'FF0000', fontSize: 14 });
            }
        },

        bar_chart: () => {
            // Sort sentiment data
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedNameValue = nameValue
                ? nameValue.map((item: any) => ({ ...item }))
                    .sort((a: any, b: any) => {
                        const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                        const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                : [];

            let modelData = generateModelDataBarFromNameValue('Sentiment', sortedNameValue, 'none');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.BAR, modelData, generateBarSentiment(position, titleContent, COLOR_SENTIMENT, 'col'));
        },

        bar_chart_horizontal: () => {
            // Redirect to stack_bar_chart to use correct Sentiment colors (Green/Red/Blue) and stacked visual
            if (handlers.stack_bar_chart) {
                handlers.stack_bar_chart();
            }
        },

        table: () => {
            let colWidths = [0.5, 2.5, 1.0, 1.0, 1.0];
            let adjustedPosition = { ...position, y: position.y - 0.2 };

            let modelData = chosenTableColors
                ? generateModelDataTable(
                    table,
                    chosenTableColors.oddRowFill,
                    chosenTableColors.evenRowFill,
                    chosenTableColors.headerFill,
                    chosenTableColors.headerFontColor,
                )
                : generateModelDataTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
        },

        stack_bar_chart: () => {
            // Sort sentiment data
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedNameValue = nameValue
                ? nameValue.map((item: any) => ({ ...item }))
                    .sort((a: any, b: any) => {
                        const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                        const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
                    })
                : [];

            let modelData = generateModelDataStackBarFromNameValue(sortedNameValue);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateStackBarSentiment(position, titleContent, COLOR_SENTIMENT_BLUE, 'bar'),
            );
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    }
}

/**
 * Menangani pembuatan slide Sentiment Analyst
 */
function handleSentimentAnalyst(data: SentimentAnalystData, slide: any, position: Position) {
    const { titleContent, visualization, groupSentiment, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        bar_chart: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopNGroupSentiment(groupSentiment, 10, true);
            // Auto-switch to Stacked Bar for bar_chart visualization
            let modelData = generateModelDataStackBarFromGroupSentiment(filteredData);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateStackBarSentiment(position, titleContent, COLOR_SENTIMENT_BLUE, 'bar', metric),
            );
        },

        stack_bar_chart: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopNGroupSentiment(groupSentiment, 10, true);
            let modelData = generateModelDataStackBarFromGroupSentiment(filteredData);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateStackBarSentiment(position, titleContent, COLOR_SENTIMENT_BLUE, 'bar', metric),
            );
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handleSentiment,
    handleSentimentAnalyst
};
