import pptxgen from 'pptxgenjs';
const { generateModelDataBar, generateModelDataBarGroup, generateBar } = require('../utils/bar');
const { generateModelDataLine, generateModelDataLineGroup, generateLine } = require('../utils/line');
const { generateModelDataText, generateText } = require('../utils/text');
const { generateTitleContent } = require('../utils/content');
import { COLORS_ACCENT, SINGLE_COLOR } from '../controllers/enums_charts';

// Interface untuk data Followers
interface FollowersData {
    titleContent: string;
    visualization: string;
    chronological?: any;
    granularity?: string;
    metric?: string;
    numericWithGrowth?: any;
    // Optional properties for safety
    chronologicalGroup?: any;
}

// Interface untuk data Followers Growth
interface FollowersGrowthData {
    titleContent: string;
    visualization: string;
    chronologicalGroup?: any;
    granularity?: string;
    metric?: string;
    numericWithGrowth?: any;
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Menangani pembuatan slide Followers
 */
function handleFollowers(data: FollowersData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, metric, numericWithGrowth } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLine('Followers', chronological, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors));
            slide.addText(titleContent, generateTitleContent(position));
        },

        bar_chart: () => {
            let modelData = generateModelDataBar('Followers', chronological, granularity);
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'col', metric),
            );
            slide.addText(titleContent, generateTitleContent(position));
        },

        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataText('TOTAL FOLLOWERS', numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Followers Growth
 */
function handleFollowersGrowth(data: FollowersGrowthData, slide: any, position: Position) {
    const { titleContent, visualization, chronologicalGroup, granularity, metric, numericWithGrowth } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLineGroup(chronologicalGroup, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors));
            slide.addText(titleContent, generateTitleContent(position));
        },

        bar_chart: () => {
            let modelData = generateModelDataBarGroup(chronologicalGroup, granularity);
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, COLORS_ACCENT, true, 'col', metric),
            );
            slide.addText(titleContent, generateTitleContent(position));
        },

        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataText('TOTAL FOLLOWERS GROUP', numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handleFollowers,
    handleFollowersGrowth
}
