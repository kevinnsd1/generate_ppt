import { COLORS_ACCENT } from '../controllers/enums_charts';

interface SizePosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateModelDataLine(name: string, data: any[], granularity: string) {
    let labels = [];
    let values = [];
    for (let a = 0; a < data.length; a++) {
        let dateTimeStamp = data[a].timestamp;
        if (granularity == '1 hour') {
            dateTimeStamp = data[a].timestamp.toString().slice(11, 16);
        } else {
            const datePart = data[a].timestamp.toString().slice(0, 10);
            const [y, m, d] = datePart.split('-');
            const year2Digit = y.slice(-2); // Last 2 digits of year
            dateTimeStamp = `${d}-${monthNames[parseInt(m)]}-${year2Digit}`;
        }
        labels.push(dateTimeStamp);
        values.push(data[a].value);
    }
    // Capitalize first letter of every word for legend (Title Case)
    const capitalizedName = name ? name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : name;
    let result = [
        {
            labels: labels,
            values: values,
            name: capitalizedName,
        },
    ];
    return result;
}

function generateModelDataLineGroup(data: any[], granularity: string) {
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
                const datePart = dataGroup[a].timestamp.toString().slice(0, 10);
                const [y, m, d] = datePart.split('-');
                const year2Digit = y.slice(-2); // Last 2 digits of year
                dateTimeStamp = `${d}-${monthNames[parseInt(m)]}-${year2Digit}`;
            }
            labels.push(dateTimeStamp);
            values.push(dataGroup[a].value);
        }
        // Capitalize first letter of every word for legend (Title Case)
        const contentType = data[b].contentType || '';
        const capitalizedName = contentType.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        result.push({
            labels: labels,
            values: values,
            name: capitalizedName,
        });
    }

    return result;
}

function generateLine(sizePosition: SizePosition, title: string, colors: any = COLORS_ACCENT, dataCount = 0) {
    const isTitleExist = !!title || title.length > 0;

    // Make chart height standard to fit legend
    const heightIncrease = 1.0;
    const yOffset = 0.0; // Reset offset to standard position (lowered from -0.3/-0.1)

    // Smart label rotation: rotate only if many data points (crowded)
    // If <= 7 points, labels are sparse enough to be horizontal (Flat)
    // If > 7 points, rotate to prevent overlap (Slanted)
    const labelRotation = dataCount > 7 ? -45 : 0;

    let result = {
        x: sizePosition.x,
        y: sizePosition.y + yOffset,
        w: sizePosition.w,
        h: sizePosition.h * heightIncrease,

        catAxisLabelFontFace: 'rubik',
        catAxisLabelFontSize: 9, // Reduced font size
        catAxisLabelColor: '9D9D9C',  // Gray color for X-axis (dates)
        catAxisOrientation: 'minMax',
        catAxisLabelRotate: labelRotation, // Dynamic rotation
        catGridLine: { style: 'none' }, // Hide vertical grid lines

        valAxisLabelColor: '9D9D9C',  // Gray color for Y-axis (numbers)
        valAxisLineShow: false, // Hide Y-axis line (left vertical line)

        showLegend: true,
        legendPos: 'b',
        legendFontSize: 11,
        chartColors: colors,
        showTitle: isTitleExist,
        lineDataSymbol: 'none',
        title: title,
        titleColor: '003366',
        titleFontFace: 'Arial',
        titleFontSize: 13,
        titleBold: true,

        dataLabelColor: 'FFFFFF',
        dataLabelFontFace: 'Calibri',
        dataLabelFontSize: 11,
        dataLabelPosition: 'b',

        valGridLine: { style: 'none' }, // Hide horizontal gridlines
        lineSize: 2.8,
        titleAlign: 'l', // Title at the far left
    };
    return result;
}

function addLineSeparator(slideType: string, slide: any, pptx: any, summaryConfig: any = null) {
    // COMPLETELY DISABLED - No line separators rendered
    return;
}

export {
    generateModelDataLine,
    generateModelDataLineGroup,
    generateLine,
    addLineSeparator,
};
