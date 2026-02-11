import pptxgen from 'pptxgenjs';
const { generateModelDataBar, generateModelDataBarFromNameValue, generateBar } = require('../utils/bar');
const { generateModelDataLine, generateModelDataLineGroup, generateLine } = require('../utils/line');
const { generateModelDataText, generateText } = require('../utils/text');
const { generateModelDataPie, generatePie, generatePieSentiment } = require('../utils/pie');
const { generateModelDataTable, generateTable, generateCategoryTalkTable } = require('../utils/table');
const { generateTitleContent } = require('../utils/content');
const { addNoDataMessage, isDataEmpty } = require('../utils/noDataMessage');
const { filterTopN } = require('../utils/dataFilter');
import { COLORS_ACCENT, SINGLE_COLOR, COLOR_SENTIMENT_BLUE } from '../controllers/enums_charts';

// Shared Interfaces
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface CommonData {
    titleContent: string;
    visualization: string;
    chronological?: any;
    granularity?: string;
    numericWithGrowth?: any;
    metric?: string;
}

// Handler-Specific Interfaces
interface TalkTalkerData extends CommonData {
    nameValue?: any[];
    chronologicalGroup?: any;
    table?: any;
}

interface TalkBySentimentData extends CommonData {
    nameValue?: any[];
    table?: any;
    details?: any;
}

interface Options {
    chosenTableColors?: {
        oddRowFill: string;
        evenRowFill: string;
        headerFill: string;
        headerFontColor: string;
    };
}


function handleTalk(data: CommonData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, numericWithGrowth, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            const modelData = generateModelDataLine('Talk', chronological, granularity);
            const titleUpper = titleContent.toUpperCase();
            const dataCount = chronological?.length || 0;

            // Increase height for Day to Day Talk
            if (titleUpper === 'DAY TO DAY TALK') {
                position.h = position.h * 0.9; // Moderate height increase
                position.y = position.y + 0.1; // Slight gap from top
            }

            if (titleUpper === 'DAY TO DAY TALK') {
                // Add title in top-left corner
                const titleConfig = {
                    ...generateTitleContent(position),
                    align: 'left',
                    x: position.x,
                    y: position.y - 0.65, // Position higher above chart
                    w: position.w,
                };
                slide.addText(titleContent, titleConfig);

                const customColors = ['003366'];
                let lineConfig = generateLine(position, titleContent, customColors, dataCount);
                lineConfig.showTitle = false; // Hide built-in title since we're adding custom one
                slide.addChart(pptx.charts.LINE, modelData, lineConfig);
            } else {
                const customColors = ['003366'];
                slide.addChart(pptx.charts.LINE, modelData, generateLine(position, titleContent, customColors, dataCount));
            }
        },
        solid_chart: () => {
            const modelData = generateModelDataLine('Talk', chronological, granularity);
            const titleUpper = titleContent.toUpperCase();
            const dataCount = chronological?.length || 0;

            // Increase height for Day to Day Talk
            if (titleUpper === 'DAY TO DAY TALK') {
                position.h = position.h * 0.9; // Moderate height increase
                position.y = position.y + 0.1; // Slight gap from top
            }

            if (titleUpper === 'DAY TO DAY TALK') {
                // Add title in top-left corner
                const titleConfig = {
                    ...generateTitleContent(position),
                    align: 'left',
                    x: position.x,
                    y: position.y - 0.65, // Position higher above chart
                    w: position.w,
                };
                slide.addText(titleContent, titleConfig);

                const customColors = ['003366'];
                let lineConfig = generateLine(position, titleContent, customColors, dataCount);
                lineConfig.showTitle = false; // Hide built-in title since we're adding custom one
                slide.addChart(pptx.charts.AREA, modelData, lineConfig);
            } else {
                const customColors = ['003366']; // Dark Blue for Area Chart
                slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors, dataCount));
            }
        },
        bar_chart: () => {
            console.log('handleTalk chronological:', JSON.stringify(chronological, null, 2));
            const modelData = generateModelDataLine('Talk', chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                // Changed 'col' to 'bar' for horizontal
                generateBar(position, titleContent, SINGLE_COLOR, false, 'bar', metric),
            );
        },
        bar_chart_horizontal: () => {
            const modelData = generateModelDataLine('Talk', chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'bar', metric),
            );
        },
        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            const modelData = generateModelDataText('TOTAL TALK', numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

function handleTalker(data: CommonData, slide: any, position: Position) {
    const { titleContent, visualization, chronological, granularity, numericWithGrowth, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            const modelData = generateModelDataLine('Talker', chronological, granularity);
            const customColors = ['003366'];
            const dataCount = chronological?.length || 0;
            slide.addChart(pptx.charts.LINE, modelData, generateLine(position, titleContent, customColors, dataCount));
        },
        solid_chart: () => {
            const modelData = generateModelDataLine('Talker', chronological, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            const dataCount = chronological?.length || 0;
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors, dataCount));
        },
        bar_chart: () => {
            const modelData = generateModelDataBar('Talker', chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                // Changed 'col' to 'bar' for horizontal
                generateBar(position, titleContent, SINGLE_COLOR, false, 'bar', metric),
            );
        },
        bar_chart_horizontal: () => {
            const modelData = generateModelDataBar('Talker', chronological, granularity);
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, SINGLE_COLOR, false, 'bar', metric),
            );
        },
        text: () => {
            slide.addText(titleContent, generateTitleContent(position));
            const modelData = generateModelDataText('TOTAL TALKER', numericWithGrowth);
            slide.addText(modelData, generateText(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

function handleTalkTalker(data: TalkTalkerData, slide: any, position: Position, options: Options = {}) {
    const { titleContent, visualization, nameValue, chronologicalGroup, granularity, table, metric } = data;
    const { chosenTableColors } = options;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        pie: () => {
            // Check for empty data
            if (nameValue && isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            const modelData = generateModelDataPie('Sentiment', nameValue, 'desc');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.PIE, modelData, generatePie(position, titleContent));
        },
        line_chart: () => {
            const modelData = generateModelDataLineGroup(chronologicalGroup, granularity);
            let customColors = ['003366'];
            if (chronologicalGroup && chronologicalGroup.length > 1) {
                customColors = ['00BAEC', 'F37021']; // Blue, Orange for multi-series
            }

            // Calculate data count for rotation
            const dataCount = chronologicalGroup[0]?.values?.length || 0;

            // Add title in top-left corner
            const titleConfig = {
                ...generateTitleContent(position),
                align: 'left',
                x: position.x,
                y: position.y - 0.65,
                w: position.w,
            };
            slide.addText(titleContent, titleConfig);

            let lineConfig = generateLine(position, titleContent, customColors, dataCount);
            lineConfig.showTitle = false;
            slide.addChart(pptx.charts.LINE, modelData, lineConfig);
        },
        solid_chart: () => {
            const modelData = generateModelDataLineGroup(chronologicalGroup, granularity);
            let customColors = ['003366']; // Dark Blue for Area Chart
            if (chronologicalGroup && chronologicalGroup.length > 1) {
                customColors = ['00BAEC', 'F37021']; // Blue, Orange for multi-series
            }

            // Calculate data count for rotation
            const dataCount = chronologicalGroup[0]?.values?.length || 0;

            // Add title in top-left corner
            const titleConfig = {
                ...generateTitleContent(position),
                align: 'left',
                x: position.x,
                y: position.y - 0.65,
                w: position.w,
            };
            slide.addText(titleContent, titleConfig);

            let lineConfig = generateLine(position, titleContent, customColors, dataCount);
            lineConfig.showTitle = false;
            slide.addChart(pptx.charts.AREA, modelData, lineConfig);
        },
        bar_chart: () => {
            // Check for empty data
            if (nameValue && isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }
            const titleUpper = titleContent.trim().toUpperCase();
            let sorting = 'desc';

            // Special handling for Social Media and Online Media
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA') {
                sorting = 'none'; // Disable automatic value-based sorting
                // Force sort by name ascending (Talk before Talker, Article before Media)
                if (nameValue) {
                    nameValue.sort((a: any, b: any) => a.name.localeCompare(b.name));
                }
            }

            const modelData = generateModelDataBarFromNameValue('Sentiment', nameValue, sorting);

            // FORCE HORIZONTAL for Social Media and Online Media as requested
            const isHorizontal = titleUpper.includes('TOP TOPIC') ||
                titleUpper.includes('TOP PERCEPTION') ||
                titleUpper.includes('POSITIVE TOPIC') ||
                titleUpper.includes('NEGATIVE TOPIC') ||
                titleUpper === 'SOCIAL MEDIA' ||
                titleUpper === 'ONLINE MEDIA' ||
                visualization === 'stack_bar_chart';

            const dir = isHorizontal ? 'bar' : 'col';

            let colors = COLORS_ACCENT;
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || visualization === 'stack_bar_chart') {
                colors = ['003366', '00BAEC']; // Dark Blue, Light Blue
            } else if (titleUpper.includes('TOP TOPIC') || titleUpper.includes('TOP PERCEPTION') || titleUpper.includes('POSITIVE TOPIC')) {
                colors = ['15C26B']; // Green Single Color
            } else if (titleUpper.includes('NEGATIVE TOPIC')) {
                colors = ['FF4444']; // Red Single Color
            }

            slide.addText(titleContent.toUpperCase(), generateTitleContent(position));

            // Generate bar config
            const barConfig = generateBar(position, titleContent, colors, false, dir, metric);

            // Hide grid lines for specific charts
            if (titleUpper.includes('TOP TOPIC') || titleUpper.includes('TOP PERCEPTION') ||
                titleUpper.includes('POSITIVE TOPIC') || titleUpper.includes('NEGATIVE TOPIC') ||
                titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA') { // Clean look for horizontal
                barConfig.valGridLine = { style: 'none' };
                barConfig.catGridLine = { style: 'none' };
                barConfig.catAxisLineShow = false;
            }

            // For Social Media and Online Media, specific config for HORIZONTAL
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || visualization === 'stack_bar_chart') {
                barConfig.showValue = true;
                barConfig.dataLabelPosition = 'ctr';
                barConfig.dataLabelColor = 'FFFFFF';
                barConfig.dataLabelFontSize = 12; // Match article_portal

                // Style matching article_portal
                barConfig.barGapWidthPct = 10; // Fat bars
                barConfig.catAxisLineShow = true; // Show category line
                barConfig.valAxisLineShow = false;
                barConfig.valAxisHidden = false; // Show value numbers at bottom

                barConfig.h = position.h * 0.85;
                barConfig.showLegend = false;

                // Ensure colors correspond to the reference (Light Blue first, then Dark Blue)
                barConfig.chartColors = ['00BAEC', '003366']; // Light Blue, Dark Blue
            }

            slide.addChart(
                pptx.charts.BAR,
                modelData,
                barConfig,
            );
        },
        bar_chart_horizontal: () => {
            // ... kept as legacy fallback if needed
            const modelData = generateModelDataBarFromNameValue('Value', nameValue, null);
            const customColors = ['00BAEC', '003366'];
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, customColors, false, 'bar', metric)
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
                    chosenTableColors.headerFontColor,
                )
                : generateModelDataTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
        },
        stack_bar_chart: () => {
            // Reuse bar_chart logic which now defaults to vertical
            if (handlers.bar_chart) {
                handlers.bar_chart();
            }
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

function handleTalkBySentiment(data: TalkBySentimentData, slide: any, position: Position, options: Options = {}) {
    const { titleContent, visualization, nameValue, metric } = data;
    // Prefer table from data root, fallback to details.table
    const table = data.table || data.details?.table;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        pie: () => {
            // Filter to top 10 items, group rest as "Others"
            // WINNING FILTER: Remove 0 values to prevent 3D Pie Chart corruption
            const filteredData = filterTopN(nameValue, 10, true).filter((item: any) => item.value > 0);

            // Sort sentiment data to match COLOR_SENTIMENT order: Positive, Negative, Neutral
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedData = filteredData
                .map((item: any) => ({ ...item })) // Create copy to avoid mutation
                .sort((a: any, b: any) => {
                    const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                    const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                    // If name not found in order array, keep original order (for non-sentiment items)
                    if (indexA === -1 && indexB === -1) return 0;
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                });

            let modelData = generateModelDataPie('Share Of Voice', sortedData, 'none');

            slide.addChart(pptx.charts.PIE, modelData, generatePieSentiment(position, titleContent));
            slide.addText(titleContent.toUpperCase(), generateTitleContent(position));
        },

        bar_chart: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopN(nameValue, 10, true);

            // Sort sentiment data to match COLOR_SENTIMENT order: Positive, Negative, Neutral
            const sentimentOrder = ['positive', 'negative', 'neutral'];
            const sortedData = filteredData
                .map((item: any) => ({ ...item })) // Create copy to avoid mutation
                .sort((a: any, b: any) => {
                    const indexA = sentimentOrder.indexOf(a.name?.toLowerCase());
                    const indexB = sentimentOrder.indexOf(b.name?.toLowerCase());
                    // If name not found in order array, keep original order (sorted by value)
                    if (indexA === -1 && indexB === -1) return 0;
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                });

            let modelData = generateModelDataBarFromNameValue('Share Of Voice', sortedData, 'none');
            // Force horizontal bar chart as requested
            const dir = 'bar';

            // Get base config with dataCount for dynamic width
            let barConfig = generateBar(position, titleContent, COLOR_SENTIMENT_BLUE, true, dir, metric, filteredData.length);

            // Hide grid lines and axis line for cleaner look
            barConfig.valGridLine = { style: 'none' };
            barConfig.catGridLine = { style: 'none' };
            barConfig.catAxisLineShow = false;
            // Note: barGapWidthPct is already set by generateBar based on dataCount

            slide.addChart(pptx.charts.BAR, modelData, barConfig);
            slide.addText(titleContent, generateTitleContent(position));
        },

        table: () => {
            // slide.addText(titleContent, generateTitleContent(position));
            let colWidths = [2.8, 3.3, 3.3, 3.3]; // Total ~12.7 inches (Max for 12.8 card)
            let adjustedPosition = { ...position, y: position.y - 0.2 };

            let modelData = generateCategoryTalkTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths, true, 0.5));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export { handleTalk, handleTalker, handleTalkTalker, handleTalkBySentiment };
