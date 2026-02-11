import pptxgen from 'pptxgenjs';
const { generateModelDataBar, generateModelDataBarFromNameValue, generateBarChartCategoryData, generateBar } = require('../utils/bar');
const { generateModelDataLine, generateLine } = require('../utils/line');
const { generateModelDataText, generateText } = require('../utils/text');
const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateModelDataPie, generatePie } = require('../utils/pie');
const { generateTitleContent } = require('../utils/content');
import { COLORS_ACCENT, SINGLE_COLOR } from '../controllers/enums_charts';

// Shared interfaces
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface TableColors {
    oddRowFill: string;
    evenRowFill: string;
    headerFill: string;
    headerFontColor: string;
}

interface CommonData {
    titleContent: string;
    visualization: string;
    metric?: string;
    chronological?: any;
    granularity?: string;
    numericWithGrowth?: any;
}

// Specific Data Interfaces
interface PostTypeData extends CommonData {
    nameValue?: any[];
    table?: any;
}

interface InterestData extends CommonData {
    table?: any;
}

interface ConversationData extends CommonData {
    socialMediaSummary?: any;
}

/**
 * Menangani pembuatan slide Post Type
 */
function handlePostType(data: PostTypeData, slide: any, position: Position, options: { chosenTableColors?: TableColors } = {}) {
    const { titleContent, visualization, nameValue, table, metric } = data;
    const { chosenTableColors } = options;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        pie: () => {
            let modelData = generateModelDataPie('Post Type', nameValue, 'desc');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.PIE, modelData, generatePie(position, titleContent));
        },

        bar_chart: () => {
            let modelData = generateModelDataBarFromNameValue('Post Type', nameValue, 'desc');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, COLORS_ACCENT, false, 'col', metric),
            );
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
                    chosenTableColors.headerFontColor
                )
                : generateModelDataTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Post Made
 */
function handlePostMade(data: CommonData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, metric, numericWithGrowth } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLine('Postmade', chronological, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            // slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors));
        },

        bar_chart: () => {
            let modelData = generateModelDataBar('Postmade', chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'col', metric),
            );
        },

        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataText('TOTAL POSTMADE', numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Engagements
 */
function handleEngagements(data: CommonData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, metric, numericWithGrowth } = data;
    const pptx = new pptxgen();

    const metricLabels: { [key: string]: string } = {
        engagement: "Engagement",
        like: "Like",
        share: "Share",
        comment: "Comment",
        engagement_rate: "Engagement Rate",
    };

    const label = (metric && metricLabels[metric]) ? metricLabels[metric] : (metric || '');

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLine(label, chronological, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            // slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors));
        },

        bar_chart: () => {
            let modelData = generateModelDataBar(label, chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'col', metric),
            );
        },

        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataText(`TOTAL ${label.toUpperCase()}`, numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Interest (Table)
 */
function handleInterest(data: InterestData, slide: any, position: Position, options: { chosenTableColors?: TableColors } = {}) {
    const { titleContent, visualization, table } = data;
    const { chosenTableColors } = options;

    const handlers: { [key: string]: () => void } = {
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
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Conversation
 */
function handleConversation(data: ConversationData, slide: any, position: Position) {
    const { titleContent, visualization, socialMediaSummary } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        bar_chart: () => {
            slide.addText(titleContent, generateTitleContent(position));
            const chartData = generateBarChartCategoryData(socialMediaSummary);
            slide.addChart(pptx.charts.BAR, chartData, generateBar(position, titleContent, COLORS_ACCENT, true, 'col'));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handlePostType,
    handlePostMade,
    handleEngagements,
    handleInterest,
    handleConversation
}
