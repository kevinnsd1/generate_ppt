
import {
    COLOR_SENTIMENT,
} from '../controllers/enums_charts';

interface SizePosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

function generateBarChartCategoryData(data: any[]) {
    const metrics = Object.keys(data[0]).slice(1);
    const onlyTalkTalkerMetrics = metrics.filter((metric) => metric === 'talk' || metric === 'talker');
    const socialMedias = data.map((item) => item.socialMedia);

    const transformedData = onlyTalkTalkerMetrics.map((metric) => {
        return {
            name: metric,
            labels: socialMedias,
            values: data.map((socialMedia) => socialMedia[metric]),
        };
    });
    return transformedData;
}

function generateModelDataBarSentimentAnalyst(data: any[]) {
    let result = [];

    let labelsValues = [];
    let positiveValues = [];
    let negativeValues = [];
    let neutralValues = [];
    for (let a = 0; a < data.length; a++) {
        labelsValues.push(data[a].brandName ? data[a].brandName.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '');
        positiveValues.push(data[a].positive);
        negativeValues.push(data[a].negative);
        neutralValues.push(data[a].neutral);
    }
    result.push({
        name: 'Positive',
        labels: labelsValues,
        values: positiveValues,
    });

    result.push({
        name: 'Negative',
        labels: labelsValues,
        values: negativeValues,
    });

    result.push({
        name: 'Neutral',
        labels: labelsValues,
        values: neutralValues,
    });

    return result;
}

function generateModelDataBarGroup(data: any[], granularity: string) {
    let result = [];
    for (let b = 0; b < data.length; b++) {
        let labels = [];
        let values = [];
        let dataGroup = data[b]?.values || [];
        for (let a = 0; a < dataGroup.length; a++) {
            let dateTimeStamp = dataGroup[a].timestamp;
            if (granularity == '1 hour') {
                dateTimeStamp = dataGroup[a].timestamp.toString().slice(11, 16);
            } else {
                dateTimeStamp = dataGroup[a].timestamp.toString().slice(0, 10);
            }
            labels.push(dateTimeStamp);
            values.push(dataGroup[a].value);
        }
        result.push({
            labels: labels,
            values: values,
            name: data[b].contentType ? data[b].contentType.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '',
        });
    }

    return result;
}

function generateModelDataBar(name: string, data: any[], granularity: string) {
    data.sort((a, b) => b.value - a.value);
    let labels = [];
    let values = [];
    for (let a = 0; a < data.length; a++) {
        let dateTimeStamp = data[a].timestamp;
        if (granularity == '1 hour') {
            dateTimeStamp = data[a].timestamp.toString().slice(11, 16);
        } else {
            dateTimeStamp = data[a].timestamp.toString().slice(0, 10);
        }
        labels.push(dateTimeStamp);
        values.push(data[a].value);
    }
    let result = [
        {
            labels: labels,
            values: values,
            name: name,
        },
    ];

    return result;
}

function generateModelDataBarFromNameValue(name: string, data: any[], sorting?: string) {
    let labels = [];
    let values = [];

    // ALWAYS sort descending for horizontal bars (highest at top)
    if (sorting == 'desc') {
        data.sort((a, b) => b.value - a.value); // Descending: 45, 33, 22, 17, 14
    } else if (sorting == 'asc') {
        data.sort((a, b) => a.value - b.value);
    }

    for (let a = 0; a < data.length; a++) {
        labels.push(data[a].name ? data[a].name.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '');
        values.push(data[a].value);
    }

    let result = [
        {
            labels: labels,
            values: values,
            name: name,
        },
    ];
    return result;
}

function generateModelDataStackBarFromNameValue(data: any[]) {
    const categories = [' '];
    let positiveVal = 0;
    let neutralVal = 0;
    let negativeVal = 0;
    data.forEach((el) => {
        if (el.name === 'positive') positiveVal = el.value;
        if (el.name === 'neutral') neutralVal = el.value;
        if (el.name === 'negative') negativeVal = el.value;
    });
    const totalVal = positiveVal + neutralVal + negativeVal;
    const series = [
        { name: 'Positive', labels: categories, values: [positiveVal / totalVal] },
        { name: 'Negative', labels: categories, values: [negativeVal / totalVal] },
        { name: 'Neutral', labels: categories, values: [neutralVal / totalVal] },
    ];
    return series;
}

function generateModelDataStackBarFromGroupSentiment(data: any[]) {
    const categories: string[] = [];
    const valuePositive: number[] = [];
    const valueNeutral: number[] = [];
    const valueNegative: number[] = [];
    data.forEach((el) => {
        categories.push(el.brandName);
        const totalVal = el.positive + el.neutral + el.negative;
        valuePositive.push(el.positive / totalVal);
        valueNeutral.push(el.neutral / totalVal);
        valueNegative.push(el.negative / totalVal);
    });

    const series = [
        { name: 'Positive', labels: categories, values: valuePositive },
        { name: 'Negative', labels: categories, values: valueNegative },
        { name: 'Neutral', labels: categories, values: valueNeutral },
    ];
    return series;
}

function generateBar(sizePosition: SizePosition, title: string, color: any, showLegend: boolean, barDir: string, metricName: string | null = null, dataCount: number | null = null, isStacked = false) {
    let result: any = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        // chartArea: { fill: { color: "F1F1F1" } },
        // plotArea: { fill: { color: "F1F1F1" } },
        //
        barDir: barDir,
        barGapWidthPct: 50, // Reduced from 219 to 50 for wider bars by default
        dataLabelRotation: 0,
        chartColors: color,
        chartColorsOpacity: 100,
        //
        //catAxisLabelColor: COLORS_ACCENT[0],
        catAxisLabelFontFace: 'Calibri',
        catAxisLabelFontSize: 11,
        catAxisLabelColor: '9D9D9C',  // Gray color for axis labels
        catAxisOrientation: 'minMax',
        //

        //
        valAxisLabelColor: '9D9D9C',  // Gray color for Y-axis
        valAxisLineShow: false,       // Hide Y-axis line (keep labels)
        catAxisLineShow: true,        // Show X-axis line (User request: Keep X line, Remove Y line)
        catGridLine: { style: 'none' }, // No vertical grid lines
        //
        dataBorder: { pt: 1, color: 'F1F1F1' },
        dataLabelColor: barDir === 'bar' ? 'FFFFFF' : '000000',  // White text inside horizontal bars
        dataLabelFontFace: 'rubik',
        dataLabelFontSize: 11,
        dataLabelBold: barDir === 'bar' ? true : false,  // Bold for horizontal bars
        dataLabelPosition: barDir === 'bar' ? 'inEnd' : 'outEnd',
        showValue: true,
        //
        showLegend: showLegend,
        legendPos: 'b',
        legendFontSize: 11,
        legendColor: '1a1a00',
        valAxisPos: 'l',
        //
        showTitle: false,
        title: title,
        valAxisHidden: barDir === 'bar',
        titleColor: '0088CC',
        titleFontFace: 'rubik',
        titleFontSize: 13,
        valGridLine: { style: 'none' }, // Remove horizontal grid lines (User request: only numbers)
    };

    if (isStacked) {
        result.barGrouping = 'stacked';
        // Adjust data labels for clarity in stacked mode
        result.dataLabelPosition = 'ctr';
    }

    if (metricName === 'talk_talker') {
        result.barGapWidthPct = 80;
    } else if (metricName === 'breakdown_by_media') {
        result.barGapWidthPct = 25;
    } else if (metricName === 'top_topic' || metricName === 'top_perception') {
        result.barGapWidthPct = 50; // Wider bars for Top Topic/Perception
    } else if (metricName === 'day_to_day_article' || metricName === 'day_to_day_sentiment') {
        result.dataLabelRotation = 270;
        result.dataLabelFontSize = 10;
    } else if (metricName === 'peak_day_comment' || metricName === 'peak_time_talk' || metricName === 'peak_day_talk' || metricName === 'peak_time_comment') {
        result.showValue = false;
        result.dataBorder = { style: 'none' }; // Remove border to prevent stacking effect
        result.catAxisLineShow = true; // Show X-axis line (User Request: "garis x nya ada")
        result.catGridLine = { style: 'none' }; // Hide vertical grid lines
        result.valAxisLineShow = false; // Hide vertical Y-axis line
        result.valAxisLabelColor = '9D9D9C'; // Show Y-axis labels (Gray)
        result.catAxisLabelColor = '9D9D9C'; // Explicitly show X-axis labels
        result.catAxisHidden = false; // Ensure X-axis is logically visible so labels render
    } else if (metricName === 'sentiment_analyst' || metricName === 'day_to_day_article' || metricName === 'day_to_day_sentiment') {
        result.dataLabelRotation = 270;
    } else if (metricName === 'talk_by_sentiment' || metricName === 'talk_by_media') {
        result.dataLabelRotation = 270;
    }

    // Dynamic bar width/thickness based on data count
    if (dataCount !== null) {
        if (barDir === 'col') {
            // Vertical bars: adjust gap (smaller gap = wider bars)
            if (dataCount <= 2) {
                result.barGapWidthPct = 150; // Was 500. Reduced to make bars wider.
            } else if (dataCount === 3) {
                result.barGapWidthPct = 100; // Was 350.
            } else if (dataCount === 4) {
                result.barGapWidthPct = 80; // Was 250.
            } else if (dataCount >= 5) {
                result.barGapWidthPct = 50; // Was 150.
            }
        } else if (barDir === 'bar') {
            // Horizontal bars: adjust gap (smaller gap = thicker bars)
            if (dataCount <= 2) {
                result.barGapWidthPct = 10; // Very few items = thick bars
            } else if (dataCount === 3) {
                result.barGapWidthPct = 25; // 3 items = medium-thick bars
            } else if (dataCount === 4) {
                result.barGapWidthPct = 40; // 4 items = medium bars
            } else if (dataCount >= 5) {
                result.barGapWidthPct = 50; // 5+ items = standard bars
            }
        }
    }

    return result;
}

function generateBarHorizontal(sizePosition: SizePosition, title: string, color: any, showLegend: boolean, barDir: string) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        barDir: 'bar',
        barGrouping: 'percentStacked',
        chartColors: ['F2AF00', '4472C4'],
        dataBorder: { pt: 1, color: 'F1F1F1' },
        catAxisHidden: true,
        valAxisHidden: true,
        valGridLine: { style: 'none' }, // changed from size:1, color:'cccccc' to match return type consistency?
        // Wait, original had valGridLine: { size: 1, color: 'cccccc' } at end, overturning validGridLine: {style: 'none'} at start??
        // The original code had valGridLine defined twice. I will keep the last one or merge.
        // Original:
        // valGridLine: { style: 'none' },
        // ...
        // valGridLine: { size: 1, color: 'cccccc' },
        // So the second one wins.
        showTitle: false,
        //
        layout: { x: 0.1, y: 0.1, w: 1, h: 1 },
        showDataTable: true,
        showDataTableKeys: true,
        showDataTableHorzBorder: false,
        showDataTableVertBorder: false,
        showDataTableOutline: false,
        dataTableFontSize: 10,
        // valGridLine: { size: 1, color: 'cccccc' }, // Moved this up to follow logic
    };
    // Applying the 2nd definition
    (result as any).valGridLine = { size: 1, color: 'cccccc' };

    return result;
}

function generateBarSentiment(sizePosition: SizePosition, title: string, color: any, showLegend: boolean, barDir: string) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        // chartArea: { fill: { color: "F1F1F1" } },
        // plotArea: { fill: { color: "F1F1F1" } },
        //
        barDir: barDir,
        barGapWidthPct: 50, // Reduced from 219 for wider bars
        chartColors: COLOR_SENTIMENT,
        chartColorsOpacity: 100,
        //
        //catAxisLabelColor: COLORS_ACCENT[0],
        catAxisLabelFontFace: 'Calibri',
        catAxisLabelFontSize: 11,
        catAxisLabelColor: '9D9D9C',  // Gray color
        catAxisOrientation: 'minMax',
        //

        valAxisLabelColor: '9D9D9C',  // Gray color
        //
        dataBorder: { pt: 1, color: 'F1F1F1' },
        dataLabelColor: '000000',
        dataLabelFontFace: 'Arial',
        dataLabelFontSize: 11,
        dataLabelPosition: 'outEnd',
        dataLabelRotation: 0, // User Request: Horizontal labels (like in the image)
        showValue: true,
        //
        valAxisLineShow: false, // User Request: Hide Y-axis line
        catAxisLineShow: true,  // User Request: Show X-axis line
        //
        showLegend: showLegend,
        legendPos: 'b',
        legendFontSize: 11,
        legendColor: '1a1a00',
        //
        showTitle: false,
        title: title,
        titleColor: '0088CC',
        titleFontFace: 'Arial',
        titleFontSize: 13,
        valGridLine: { size: 0.5, color: 'cccccc', opacity: 50 },
    };
    return result;
}

function generateStackBarSentiment(sizePosition: SizePosition, title: string, color: any, showLegend: boolean, barDir: string) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        barDir: 'bar',
        barGrouping: 'stacked',
        barGapWidthPct: 50, // Added to ensure wide stacked bars
        chartColors: COLOR_SENTIMENT,
        //
        showLegend: true,
        legendPos: 'b',
        //
        valAxisHidden: true,
        valGridLine: { size: 0.5, color: 'D9D9D9' },
        dataBorder: { pt: 1, color: 'FFFFFF' },
        showValue: true,
        showPercent: true,
        dataLabelFormatCode: `#%`,
        dataLabelColor: 'FFFFFF',
    };

    return result;
}

export {
    generateBarChartCategoryData,
    generateModelDataBarSentimentAnalyst,
    generateModelDataBarGroup,
    generateModelDataBar,
    generateModelDataBarFromNameValue,
    generateModelDataStackBarFromNameValue,
    generateModelDataStackBarFromGroupSentiment,
    generateBar,
    generateBarHorizontal,
    generateBarSentiment,
    generateStackBarSentiment,
};
