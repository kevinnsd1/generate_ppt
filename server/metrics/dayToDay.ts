import pptxgen from 'pptxgenjs';
const { generateModelDataBarGroup, generateBar } = require('../utils/bar');
const { generateModelDataLineGroup, generateLine } = require('../utils/line');
const { generateTitleContent } = require('../utils/content');
import { COLORS_ACCENT } from '../controllers/enums_charts';

// Interface untuk data DayToDay
interface DayToDayData {
    titleContent: string;
    visualization: string;
    chronologicalGroup: any; // Menggunakan any karena struktur data kompleks dari utils
    granularity: string;
    metric: string;
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Menangani pembuatan slide Day to Day (Line & Bar Chart)
 */
function handleDayToDays(data: DayToDayData, slide: any, position: Position) {
    const { titleContent, visualization, chronologicalGroup, granularity, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLineGroup(chronologicalGroup, granularity);
            const customColors = ['003366']; // Dark Blue for Area Chart
            // Menggunakan tipe chart AREA untuk efek filled sesuai request
            slide.addChart(pptx.charts.AREA, modelData, generateLine(position, titleContent, customColors));
        },
        bar_chart: () => {
            let modelData = generateModelDataBarGroup(chronologicalGroup, granularity);
            if (metric == 'day_to_day_article' || metric == 'day_to_day_media') {
                slide.addChart(
                    pptx.charts.BAR,
                    modelData,
                    generateBar(position, titleContent, COLORS_ACCENT, true, 'col'),
                );
            } else {
                slide.addChart(
                    pptx.charts.BAR,
                    modelData,
                    generateBar(position, titleContent, COLORS_ACCENT, true, 'col', metric),
                );
            };
            slide.addText(titleContent, generateTitleContent(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide Day to Day Sentiment (Area Chart & Bar Chart)
 */
function handleDayToDaySentiment(data: DayToDayData, slide: any, position: Position) {
    const { titleContent, visualization, chronologicalGroup, granularity, metric } = data;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        line_chart: () => {
            let modelData = generateModelDataLineGroup(chronologicalGroup, granularity);

            // Warna sentiment: Positif (Hijau), Negatif (Merah), Netral (Biru)
            // Urutan warna disesuaikan dengan metric
            if (metric == 'day_to_day_sentiment_sosmed') {
                slide.addChart(
                    pptx.charts.AREA,
                    modelData,
                    generateLine(position, titleContent, ['#00E396', '#FF4560', '#008FFB']),
                );
            } else {
                slide.addChart(
                    pptx.charts.AREA,
                    modelData,
                    generateLine(position, titleContent, ['#00E396', '#008FFB', '#FF4560']),
                );
            };
        },

        bar_chart: () => {
            let modelData = generateModelDataBarGroup(chronologicalGroup, granularity);
            slide.addChart(pptx.charts.BAR, modelData, generateBar(position, titleContent, COLORS_ACCENT, true, 'col'));
            slide.addText(titleContent, generateTitleContent(position));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handleDayToDays,
    handleDayToDaySentiment
}
