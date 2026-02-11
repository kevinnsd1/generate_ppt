import pptxgen from 'pptxgenjs';
const { generateModelDataBarFromNameValue, generateBar } = require('../utils/bar');
const { generateTitleContent } = require('../utils/content');

// Interface untuk data PeakMetrics
interface PeakMetricsData {
    titleContent: string;
    visualization: string;
    nameValue: any[]; // Array of {name, value} objects
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
 * Menangani pembuatan slide Peak Metrics (Peak Time, Peak Day)
 */
function handlePeakMetrics(data: PeakMetricsData, slide: any, position: Position) {
    const { titleContent, visualization, nameValue, metric } = data;
    const pptx = new pptxgen();

    const metricLabels: { [key: string]: string } = {
        peak_time_comment: "Peak Time",
        peak_day_comment: "Peak Day",
        peak_time_talk: "Peak Time",
        peak_day_talk: "Peak Day",
    };

    const label = metricLabels[metric] || metric;

    const handlers: { [key: string]: () => void } = {
        bar_chart: () => {
            let maxValue = -Infinity;
            let maxIndex = -1;

            nameValue.forEach((item: any, index: number) => {
                if (item.value > maxValue) {
                    maxValue = item.value;
                    maxIndex = index;
                }
            });

            const colors = nameValue.map((_, index) => index === maxIndex ? '00BAEC' : 'CCCCCC');

            // Single Chart: All bars with gray/blue colors, NO labels
            let modelData = generateModelDataBarFromNameValue(label, nameValue, 'none');
            const mainChartOptions = generateBar(position, titleContent, colors, false, 'col', data.metric, nameValue.length);
            mainChartOptions.showValue = false; // No labels on the chart itself

            slide.addChart(
                pptx.charts.BAR,
                modelData,
                mainChartOptions,
            );

            // Manually add a text label for the peak value only
            // Calculate the position of the peak bar
            const barCount = nameValue.length;
            const chartWidth = position.w;
            const chartHeight = position.h;
            const barWidth = chartWidth / barCount;

            // Better centering: bar center - half of text box width
            const textBoxWidth = 0.6;
            // Adjustment factor: Charts usually have axis labels/padding on left
            // The position.x is the chart AREA x, but the bars start after the y-axis labels
            // Adding a small manual nudge right (+0.15) to account for axis space
            const labelX = position.x + (maxIndex * barWidth) + (barWidth / 2) - (textBoxWidth / 2) + 0.15;

            // Place label very close to top of chart (right on top of tallest bar)
            const labelY = position.y + (chartHeight * 0.03); // 3% from top = right on the peak

            slide.addText(maxValue.toString(), {
                x: labelX,
                y: labelY,
                w: textBoxWidth,  // Wider to prevent text wrapping
                h: 0.3,
                fontSize: 11,
                bold: false,
                color: '000000',
                align: 'center',
                valign: 'middle',
                fontFace: 'rubik'
            });

            let titlePositionForPeakTime = { ...position };
            titlePositionForPeakTime.y -= 0.1;  // Move up slightly
            slide.addText(titleContent, generateTitleContent(titlePositionForPeakTime));
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

export {
    handlePeakMetrics
}
