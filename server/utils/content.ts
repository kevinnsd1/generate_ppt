import { COLOR_SENTIMENT_ANALYST } from '../controllers/enums_charts';

interface SizePosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface ContentData {
    xTitle?: number;
    y: number;
    wTitle?: number;
    hTitle?: number;
}

function generateModelDataPrValue(data: any) {
    let name = data?.name || 0;
    let value = data?.value || 0;

    let result = [
        {
            text: 'PR Value',
            options: {
                transparency: 10,
                padding: 0.3,
                fontSize: 16,
                fontFamily: 'Roboto, sans-serif',
                color: '0d0d0c',
                align: 'left',
                breakLine: true,
            },
        },
        {
            text: name + ' ' + value.toLocaleString('id-ID'),
            options: {
                margin: 0,
                fontSize: 24,
                bold: false,
                lineHeight: 130,
                fontFamily: 'Red Hat Display',
                color: '051c26',
                fontWeight: 700,
                align: 'left',
                breakLine: true,
            },
        },
    ];
    return result;
}

function generateTitleContent(content: ContentData) {
    let result = {
        x: content.xTitle || 0.5, // Default/fallback if undefined
        y: content.y - 0.42,
        w: content.wTitle || 5.0, // Default/fallback
        h: content.hTitle || 0.38,
        fontSize: 18,
        fontFace: 'Arial',
        color: '003366',
        align: 'left',
        bold: false,  // Changed to false - no bold
        // Note: pptxgenjs doesn't have capitalize property
        // We need to transform text to uppercase where it's used
    };
    return result;
}

function generateTitleContentSlide() {
    let result = {
        x: 0.56,
        y: 3.08,
        w: 13.07,
        h: 1.83,
        align: 'left',
        fontSize: 54,
        color: 'FFFFFF',
        fontFace: 'Arial',
        bold: false, // Changed from true to false for "Medium" look
        // fill: "F1F1F1",
    };
    return result;
}

function generateSubTitleContentSlide() {
    let result = {
        x: 0.56,
        y: 4.26,
        w: 7.33,
        h: 0.74,
        align: 'left',
        fontSize: 24,
        color: 'FFFFFF',
        // fill: "F1F1F1",
    };
    return result;
}

function generateBrandPositioning(sizePosition: SizePosition, path: string) {
    let result = {
        path: path,
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
    };
    return result;
}

function generateSentimentAnalyst(sizePosition: SizePosition) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        //chartArea: { fill: { color: pptx.colors.BACKGROUND2 } },
        // plotArea: { fill: { color: 'DAE3F3' } },
        //plotArea: { fill: { color: pptx.colors.BACKGROUND1 }, border: { color: pptx.colors.BACKGROUND2, pt: 1 } },
        chartColors: COLOR_SENTIMENT_ANALYST,
        //
        barDir: 'col',
        barGapWidthPct: 219,
        //catAxisLabelColor: COLORS_ACCENT[0],
        catAxisLabelFontFace: 'Calibri',
        catAxisLabelFontSize: 11,
        catAxisOrientation: 'minMax',

        // dataLabelColor: 'FFFFFF',
        valAxisHidden: false,
        valAxisPos: 'l',
        dataLabelFontFace: 'Arial',
        dataLabelFontSize: 11,
        dataLabelPosition: 'outEnd',
        dataLabelRotation: 270,
        showValue: true,
        //
        showLegend: true,
        legendPos: 'b',
        valGridLine: { size: 0.5, color: 'cccccc', opacity: 50 },
        showTitle: false,
        //legendColor: COLORS_ACCENT[1]
    };
    return result;
}

/**
 * Helper function to add title text with automatic uppercase
 * @param {object} slide - PPTXGenJS slide object
 * @param {string} titleText - Title text to display
 * @param {object} position - Position object containing xTitle, y, etc
 */
function addTitleText(slide: any, titleText: string, position: ContentData) {
    const titleUpper = titleText.toUpperCase();
    slide.addText(titleUpper, generateTitleContent(position));
}

export {
    generateModelDataPrValue,
    generateTitleContent,
    generateTitleContentSlide,
    generateSubTitleContentSlide,
    generateBrandPositioning,
    generateSentimentAnalyst,
    addTitleText, // New helper function
};
