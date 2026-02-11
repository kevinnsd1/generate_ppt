import pptxgen from 'pptxgenjs';
const { generateModelDataBarGroup, generateBar } = require('../utils/bar');
const { generateModelDataLineGroup, generateLine } = require('../utils/line');
const { generateModelDataText, generateText, generateModelDataTextOnm } = require('../utils/text');
const { generateTitleContent } = require('../utils/content');
const { addNoDataMessage } = require('../utils/noDataMessage');
import { COLORS_ACCENT } from '../controllers/enums_charts';

// Interface untuk data NewsTotalArticle
interface NewsTotalArticleData {
    titleContent: string;
    visualization: string;
    chronologicalGroup?: any;
    granularity?: string;
    numericWithGrowth?: any;
    metric?: string;
}

// Interface untuk data Totals
interface TotalsData {
    titleContent: string;
    visualization: string;
    numericOutput?: any;
    metric: string;
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

function handleNewsTotalArticle(data: NewsTotalArticleData, slide: any, position: Position) {
    const { titleContent, visualization, chronologicalGroup, granularity, numericWithGrowth, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            // Check for empty data
            if (!chronologicalGroup || chronologicalGroup.length === 0) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            let modelData = generateModelDataLineGroup(chronologicalGroup, granularity);

            // Determine colors based on number of series
            let customColors = ['003366']; // Default Dark Blue
            const isMultiSeries = chronologicalGroup && chronologicalGroup.length > 1;

            if (isMultiSeries) {
                customColors = ['003366', '00BAEC']; // Dark Blue, Light Blue for contrast
            }

            // Check for Day to Day specific styling
            const isDayToDay = titleContent.toUpperCase().includes('DAY TO DAY');

            // Calculate data count for rotation logic (use first series as representative)
            const dataCount = chronologicalGroup[0]?.values?.length || 0;

            // Increase height for Day to Day Article
            if (isDayToDay) {
                position.h = position.h * 0.9;
                position.y = position.y + 0.1;
            }

            // Add title in top-left corner for Day to Day charts
            if (isDayToDay) {
                const titleConfig = {
                    ...generateTitleContent(position),
                    align: 'left',
                    x: position.x,
                    y: position.y - 0.65,
                    w: position.w,
                };
                slide.addText(titleContent, titleConfig);
            }

            let lineConfig = generateLine(position, titleContent, customColors, dataCount);

            // Show legend for multi-series to distinguish lines, hide for single series Day to Day
            lineConfig.showLegend = isMultiSeries;
            lineConfig.showTitle = false; // Hide built-in title

            // Ensure we use LINE chart as requested
            slide.addChart(pptx.charts.LINE, modelData, lineConfig);
        },

        solid_chart: () => {
            // Check for empty data
            if (!chronologicalGroup || chronologicalGroup.length === 0) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            let modelData = generateModelDataLineGroup(chronologicalGroup, granularity);

            // Determine colors based on number of series
            let customColors = ['003366']; // Default Dark Blue
            const isMultiSeries = chronologicalGroup && chronologicalGroup.length > 1;

            if (isMultiSeries) {
                customColors = ['003366', '00BAEC']; // Dark Blue, Light Blue for contrast
            }

            // Check for Day to Day specific styling
            const isDayToDay = titleContent.toUpperCase().includes('DAY TO DAY');

            // Calculate data count for rotation logic (use first series as representative)
            const dataCount = chronologicalGroup[0]?.values?.length || 0;

            // Increase height for Day to Day Article
            if (isDayToDay) {
                position.h = position.h * 0.9;
                position.y = position.y + 0.1;
            }

            // Add title in top-left corner for Day to Day charts
            if (isDayToDay) {
                const titleConfig = {
                    ...generateTitleContent(position),
                    align: 'left',
                    x: position.x,
                    y: position.y - 0.65,
                    w: position.w,
                };
                slide.addText(titleContent, titleConfig);
            }

            let lineConfig = generateLine(position, titleContent, customColors, dataCount);

            // Show legend for multi-series to distinguish lines, hide for single series Day to Day
            lineConfig.showLegend = isMultiSeries;
            lineConfig.showTitle = false; // Hide built-in title

            // Ensure we use AREA chart as requested
            slide.addChart(pptx.charts.AREA, modelData, lineConfig);
        },

        bar_chart: () => {
            let modelData = generateModelDataBarGroup(chronologicalGroup, granularity);
            slide.addText(titleContent, generateTitleContent(position));

            // Custom config for Online Media style matching article_portal
            // Using defined colors directly as in original file logic
            const barConfig = generateBar(position, titleContent, ['00BAEC', '003366'], true, 'bar');
            barConfig.showValue = true;
            barConfig.dataLabelPosition = 'ctr';
            barConfig.dataLabelColor = 'FFFFFF';
            barConfig.dataLabelFontSize = 12;

            // Article Portal style matching
            barConfig.barGapWidthPct = 10; // Fat bars
            barConfig.catAxisLineShow = true;
            barConfig.valAxisLineShow = false;
            barConfig.valAxisHidden = false; // Show numbers

            barConfig.showLegend = false;

            slide.addChart(pptx.charts.BAR, modelData, barConfig);
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

function handleTotals(data: TotalsData, slide: any, position: Position) {
    const { titleContent, visualization, numericOutput, metric } = data;

    const metricLabels: { [key: string]: string } = {
        total_article: 'TOTAL ARTICLE',
        total_media: 'TOTAL MEDIA',
        total_pr_value: '',
    };

    const label = metricLabels[metric] || metric;

    const handlers: { [key: string]: () => void } = {
        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            let modelData = generateModelDataTextOnm(label, numericOutput);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handleNewsTotalArticle,
    handleTotals
};
