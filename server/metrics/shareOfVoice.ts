import pptxgen from 'pptxgenjs';
const { generateModelDataBarFromNameValue, generateBar } = require('../utils/bar');
const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateModelDataPie, generatePie } = require('../utils/pie');
const { generateTitleContent } = require('../utils/content');
const { filterTopN } = require('../utils/dataFilter');
import { COLORS_ACCENT } from '../controllers/enums_charts';

// Interface untuk data ShareOfVoice
interface ShareOfVoiceData {
    titleContent: string;
    visualization: string;
    nameValue: any[];
    table?: any;
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
interface ShareOfVoiceOptions {
    chosenTableColors?: {
        oddRowFill: string;
        evenRowFill: string;
        headerFill: string;
        headerFontColor: string;
    };
}

/**
 * Menangani pembuatan slide Share of Voice
 */
function handleShareOfVoices(data: ShareOfVoiceData, slide: any, position: Position, options: ShareOfVoiceOptions = {}) {
    const { titleContent, visualization, nameValue, table, metric } = data;
    const { chosenTableColors } = options;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        pie: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopN(nameValue, 10, true);
            let modelData = generateModelDataPie('Share Of Voice', filteredData, 'desc');
            slide.addChart(pptx.charts.PIE, modelData, generatePie(position, titleContent, metric));
            slide.addText(titleContent, generateTitleContent(position));
        },

        bar_chart: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopN(nameValue, 10, true);
            let modelData = generateModelDataBarFromNameValue('Share Of Voice', filteredData, 'desc');
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, COLORS_ACCENT, true, 'col', metric),
            );
            slide.addText(titleContent, generateTitleContent(position));
        },

        bar_chart_horizontal: () => {
            // Filter to top 10 items, group rest as "Others"
            const filteredData = filterTopN(nameValue, 10, true);
            let modelData = generateModelDataBarFromNameValue('Share Of Voice', filteredData, 'asc');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, COLORS_ACCENT, true, 'bar', metric),
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

export {
    handleShareOfVoices
}
