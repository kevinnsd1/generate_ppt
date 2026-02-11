
// Remove symbols and convert to a number
const convertToNumber = (value: string) => {
    if (value[value.length - 1] === '%') return parseFloat(value.replace(/[,%]/g, ''));
    return parseFloat(value.replace(/[,.%]/g, ''));
};

interface SizePosition {
    x: number;
    y: number;
    w: number;
    h?: number;
}

function generateModelDataTable(data: any, oddColor?: string, evenColor?: string, headerFill?: string, headerFontColor?: string, headerFontSize = 11, bodyFontSize = 11) {
    let result = [];
    let tmpResultHeader = [];
    let header = data?.header || [];
    let body = data?.body || [];

    const finalHeaderFill = headerFill || '00BAEC';  // Light cyan header
    const finalHeaderFontColor = headerFontColor || 'FFFFFF';  // White header text
    const finalOddColor = oddColor || 'E7F4F9';  // Very light blue for odd rows
    const finalEvenColor = evenColor || 'FFFFFF';  // White for even rows

    header.forEach((model: string) => {
        tmpResultHeader.push({
            text: model,
            options: {
                fill: finalHeaderFill,
                color: finalHeaderFontColor,
                valign: 'middle',
                align: 'center',
                bold: true,
                fontSize: headerFontSize,
                border: null  // Remove border
            },
        });
    });
    result.push(tmpResultHeader);

    body.forEach((model: any, idx: number) => {
        let cells = model?.cells || [];
        let tmpResultRow = [];
        cells.forEach((model2: any, idx2: number) => {
            let cell = model2.value;
            const isEven = idx % 2 === 0;
            //   const cellName = model2.name || '';

            // Username column (index 1) should be blue
            const isUsernameColumn = idx2 === 1; // Simplification: assume 2nd col is key

            tmpResultRow.push({
                text: (cell !== null && cell !== undefined) ? cell : '-',
                options: {
                    fill: isEven ? finalEvenColor : finalOddColor,
                    fontSize: bodyFontSize,
                    border: null,  // Remove border
                    color: isUsernameColumn ? '0070C0' : '000000',  // Blue for username, black for others
                }
            });
        });
        result.push(tmpResultRow);
    });

    return result;
}

function generateAdvanceMetricTable(data: any, metrics: any) {
    let result = [];
    let tmpResultHeader = [];
    let header = data?.header || [];
    let body = data?.body || [];
    const highlightColorFill = '00BAEC';  // Blue highlight for max values

    header.forEach((model: string) => {
        tmpResultHeader.push({
            text: model,
            options: { fill: 'FFFFFF', color: '00BAEC', valign: 'middle', align: 'center', bold: true, border: null },
        });
    });
    result.push(tmpResultHeader);

    body.forEach((model: any) => {
        let cells = model?.cells || [];
        let tmpResultRow = [];

        // Check if this is Average/Total row (first cell contains 'average' or 'total')
        const firstCellValue = cells[0]?.value?.toString().toLowerCase() || '';
        const isAverageRow = firstCellValue.includes('average') || firstCellValue.includes('total');
        const rowBgColor = isAverageRow ? 'CCF2F9' : 'FFFFFF';  // Semi-transparent cyan for average, white for others

        cells.forEach((model2: any) => {
            let cellValue = model2.value;
            const cellName = model2.name;
            if (!metrics[cellName]) {
                tmpResultRow.push({ text: cellValue, options: { fill: rowBgColor, border: null, color: isAverageRow ? '00BAEC' : '000000' } });
                return;
            }
            const maxValue = metrics[cellName].max;
            const maxValueStyles = { fill: highlightColorFill, color: 'FFFFFF', bold: false, border: null };
            const safeValue = (cellValue !== null && cellValue !== undefined) ? cellValue.toLocaleString('id-ID') : '-';
            tmpResultRow.push({
                text: safeValue,
                options: maxValue === cellValue && maxValue !== 0 ? maxValueStyles : { fill: rowBgColor, border: null, color: isAverageRow ? '00BAEC' : '000000' },
            });
        });
        result.push(tmpResultRow);
    });

    return result;
}

// get average values & metrics name from data table
function getAverageAndMetrics(data: any[]) {
    const averageRow = {
        cells: [{ name: 'Group', value: 'Average' }],
    };

    // Object to store sums & max for each metric
    let metrics: any = {};

    // convert all metric values to number
    data.forEach((row) => {
        row.cells.forEach((cell: any) => {
            const convertedValue = convertToNumber(cell.value);
            if (!isNaN(convertedValue)) {
                cell.value = convertedValue;
            }
        });
    });

    data.forEach((row) => {
        const cells = row.cells;
        cells.forEach((cell: any) => {
            const cellMetricValue = cell.value;
            if (isNaN(cellMetricValue)) return;

            // add new property to metric if not exist
            if (!metrics[cell.name]) {
                metrics[cell.name] = { sum: 0, max: 0 };
            }
            metrics[cell.name].sum += cellMetricValue;
            if (cellMetricValue > metrics[cell.name].max) metrics[cell.name].max = cellMetricValue;
        });
    });

    // Calculate averages and push to averageRow array
    for (let key in metrics) {
        let average = metrics[key].sum / data.length;
        averageRow.cells.push({ name: key, value: average.toLocaleString('id-ID') });
    }

    return { averageRow, metrics };
}

function generateModelDataTableSentiment(data: any) {
    let result = [];
    let body = data || [];

    result.push([
        {
            text: 'Sentiment',
            options: { fill: '0088cc', color: 'ffffff', valign: 'middle' },
        },
        {
            text: 'Value',
            options: { fill: '0088cc', color: 'ffffff', valign: 'middle' },
        },
    ]);

    body.forEach((model2: any) => {
        let name = model2.name;
        let value = model2.value;
        result.push([{ text: name }, { text: value }]);
    });

    return result;
}



function generateCategoryTalkTable(data: any) {
    let result = [];
    let header = data?.header || [];
    let body = data?.body || [];

    // Colors
    const blueColor = '00BAEC';
    const greenColor = '21BF73';
    const redColor = 'FD5E53';
    const headerBg = 'FFFFFF';
    const oddRowBg = 'E1F8FA';
    const evenRowBg = 'FFFFFF';

    // Column Text Colors mapping (Index 0: Blue, 1: Green, 2: Blue, 3: Red)
    const colColors = [blueColor, greenColor, '4472C4', redColor];

    // 1. Generate Header
    let headerRow = [];
    header.forEach((text: string, idx: number) => {
        headerRow.push({
            text: text.toUpperCase(),
            options: {
                fill: headerBg,
                color: colColors[idx] || blueColor, // Fallback
                valign: 'middle',
                align: 'center',
                bold: true,
                fontSize: 14 // Increased from 12
            },
        });
    });
    result.push(headerRow);

    // 2. Generate Body
    body.forEach((row: any, rowIdx: number) => {
        let cells = row?.cells || [];
        let tableRow = [];
        const isOdd = rowIdx % 2 === 0; // 0-indexed: 0 is 1st row (Odd visual)
        const rowFill = isOdd ? oddRowBg : evenRowBg;

        cells.forEach((cell: any, colIdx: number) => {
            let cellValue = cell.value;
            tableRow.push({
                text: cellValue,
                options: {
                    fill: rowFill,
                    color: colColors[colIdx] || '000000',
                    valign: 'middle',
                    align: 'center',
                    fontSize: 12, // Increased from 10
                    underline: colIdx !== 0 // Underline content columns (except category)
                }
            });
        });
        result.push(tableRow);
    });

    return result;
}

function generateTable(sizePosition: SizePosition, customColW: any = null, noBorder = false, customRowH = 0.18) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        border: null,  // Remove outer border
        autoPage: true,
        autoPageRepeatHeader: true,
        verbose: false,
        fontSize: 10,  // Reduced from 11 
        margin: 0.08,  // Reduced margin
        align: 'center',
        valign: 'middle',
        rowH: customRowH,
        colW: customColW || [2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    };
    return result;
}

export {
    generateModelDataTable,
    generateAdvanceMetricTable,
    getAverageAndMetrics,
    generateModelDataTableSentiment,
    generateCategoryTalkTable,
    generateTable,
};
