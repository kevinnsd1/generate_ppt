import pptxgen from 'pptxgenjs';
const { generateModelDataBar, generateBar } = require('../utils/bar');
const { generateModelDataLine, generateLine } = require('../utils/line');
const { generateModelDataText, generateText } = require('../utils/text');
const { generateTitleContent } = require('../utils/content');
import { SINGLE_COLOR } from '../controllers/enums_charts';

// Interface untuk data Potentials
interface PotentialsData {
    titleContent: string;
    visualization: string;
    chronological?: any;
    granularity?: string;
    metric: string;
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
 * Menangani pembuatan slide Potentials (Reach & Impression)
 */
function handlePotentials(data: PotentialsData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, metric, numericWithGrowth } = data;
    const pptx = new pptxgen();

    const metricLabels: { [key: string]: { label: string, total: string } } = {
        potential_reach: { label: "Potential Reach", total: "TOTAL REACH" },
        potential_impresion: { label: "Potential Impresion", total: "TOTAL IMPRESSION" },
    };

    const { label, total } = metricLabels[metric] || { label: metric, total: `TOTAL ${metric.toUpperCase()}` };

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLine(label, chronological, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            let lineConfig = generateLine(position, titleContent, customColors);
            lineConfig.showTitle = false;
            slide.addChart(pptx.charts.AREA, modelData, lineConfig);
            slide.addText(titleContent, generateTitleContent(position));
        },

        bar_chart: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataBar(label, chronological, granularity);
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'col', metric),
            );
        },

        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataText(total, numericWithGrowth);
            slide.addText(modelData, generateText(position));
        }
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handlePotentials
}
