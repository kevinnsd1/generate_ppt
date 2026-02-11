import pptxgen from 'pptxgenjs';
const { generateModelDataBarFromNameValue, generateBar } = require('../utils/bar');
const { generateTitleContent } = require('../utils/content');
import { MEDIA_COLORS } from '../controllers/enums_charts';

// Interface for input data
interface BreakdownData {
    titleContent: string;
    visualization: string;
    nameValue: any;
    metric: string;
}

// Interface for slide position

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Handle breakdown slide generation based on visualization
 * @param data Chart requirements data
 * @param slide pptxgenjs Slide object
 * @param position Chart position on slide
 */
function handleBreakdown(data: BreakdownData, slide: any, position: Position) {
    const { titleContent, visualization, nameValue, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        bar_chart: () => {
            // Generate chart data
            let modelData = generateModelDataBarFromNameValue('Breakdown by Media', nameValue, 'none');

            // Add title content
            slide.addText(titleContent, generateTitleContent(position));

            // Add chart to slide
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                generateBar(position, titleContent, MEDIA_COLORS, false, 'col', metric),
            );
        },
    };

    // Jalankan handler jika visualisasi tersedia
    if (handlers[visualization]) handlers[visualization]();
}

export { handleBreakdown };
