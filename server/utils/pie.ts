import {
    COLORS_ACCENT,
    COLOR_SENTIMENT,
} from '../controllers/enums_charts';

interface PieData {
    name?: string;
    value: number;
}

interface SizePosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

function generateModelDataPie(name: string, data: PieData[], sorting?: string) {
    if (sorting == 'desc') {
        data.sort((a, b) => b.value - a.value);
    } else if (sorting == 'asc') {
        data.sort((a, b) => a.value - b.value);
    }
    let labels = [];
    let values = [];
    for (let a = 0; a < data.length; a++) {
        labels.push(data[a].name ? data[a].name!.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : '');
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

function generatePie(sizePosition: SizePosition, title: string, metricName: string | null = null) {
    let result: any = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        chartColors: COLORS_ACCENT,
        dataBorder: { pt: '1', color: 'F1F1F1' },
        showLegend: true,
        showPercent: true,
        legendPos: 'b',
        legendFontSize: 11,
        showLeaderLines: true,
        showTitle: false,
        title: title,
        titleColor: '0088CC',
        titleFontFace: 'Arial',
        titleFontSize: 13,
        dataLabelColor: 'FFFFFF',
        dataLabelPosition: 'ctr',
    };

    if (metricName === 'share_of_voice') {
        // result.holeSize = 50; // Removed for Pie chart
        result.legendPos = 'b';
    }
    return result;
}

function generatePieSentiment(sizePosition: SizePosition, title: string) {
    // Increase chart size and position higher to align with adjacent content
    const scaleFactor = 1.0; // Moderate size increase
    const yOffset = -0.4; // Move chart significantly up

    let result = {
        x: sizePosition.x,
        y: sizePosition.y + yOffset,
        w: sizePosition.w * scaleFactor,
        h: sizePosition.h * scaleFactor,
        chartColors: COLOR_SENTIMENT,
        dataBorder: { pt: '1', color: 'F1F1F1' },
        showLegend: true,
        showPercent: true,
        legendPos: 'b',
        legendFontSize: 11,
        showLeaderLines: false,  // No leader lines
        showTitle: false,
        title: title,
        titleColor: '0088CC',
        titleFontFace: 'Arial',
        titleFontSize: 13,
        dataLabelColor: 'FFFFFF',  // White color
        dataLabelFontSize: 14,  // Normal size since chart is bigger
        dataLabelPosition: 'inEnd',  // Position near outer edge, inside pie
    };
    return result;
}

export {
    generateModelDataPie,
    generatePie,
    generatePieSentiment,
};
