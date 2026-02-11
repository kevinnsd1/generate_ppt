const { getAverageAndMetrics, generateAdvanceMetricTable, generateTable } = require('../utils/table');
const { generateTitleContent } = require('../utils/content');
import pptxgen from 'pptxgenjs';

// Interface for Advance Metric Data
interface AdvanceMetricData {
    titleContent: string;
    visualization: string;
    table: any; // Using any for complex table structure
    details?: {
        table: any;
    };
}

// Interface for position
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Handle Advance Metric Slide Generation
 * @param data Metric data
 * @param slide pptxgenjs Slide object
 * @param position Position on slide
 */
function handleAdvanceMetric(data: AdvanceMetricData, slide: any, position: Position) {
    let finalTable = data.table || data.details?.table;
    const { titleContent } = data;
    let visualization = data.visualization ? data.visualization.trim().toLowerCase() : '';

    // Validation for empty table
    if (!finalTable || !finalTable.body || finalTable.body.length === 0) {
        console.log(`[handleAdvanceMetric] Table data is empty for ${titleContent}`);
        if (titleContent) {
            slide.addText(titleContent, generateTitleContent(position));
            slide.addText('Data Not Available', {
                x: position.x, y: position.y + 1, w: position.w,
                align: 'center', color: '888888', fontSize: 14
            });
        }
        return;
    }

    const handlers: { [key: string]: () => void } = {
        table: () => {
            let adjustedPosition = { ...position };

            // Adjust y position
            adjustedPosition.y -= 0.5;

            slide.addText(titleContent, generateTitleContent(adjustedPosition));

            const { averageRow: avgRowData, metrics } = getAverageAndMetrics(finalTable.body);

            let modelData = generateAdvanceMetricTable(finalTable, metrics);

            // create average row cells
            let avgRowCells: any[] = [];
            if (avgRowData && avgRowData.cells) {
                avgRowData.cells.forEach((model2: any) => {
                    let cell = model2.value;
                    avgRowCells.push({ text: cell, options: { fill: 'CCF2F9', color: '00BAEC', bold: false } });
                });
                modelData.push(avgRowCells);
            }

            // Calculate dynamic column widths based on available width
            // Default distribution logic from generateTable fallback: [2.0, 2.0, 1.0...] for 10 columns = 12 units
            // We scale this to fit adjustedPosition.w
            const baseColWidths = [2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
            const totalBaseWidth = baseColWidths.reduce((a, b) => a + b, 0);
            const scaleFactor = adjustedPosition.w / totalBaseWidth;
            const dynamicColWidths = baseColWidths.map(w => w * scaleFactor);

            let tableOptions = generateTable(adjustedPosition, dynamicColWidths);
            tableOptions.rowH = 0.04;
            tableOptions.fontSize = 9;
            slide.addTable(modelData, tableOptions);
        },
    };

    if (handlers[visualization]) {
        handlers[visualization]();
    } else {
        console.log(`[handleAdvanceMetric] No handler for visualization: ${visualization}`);
        slide.addText(titleContent, generateTitleContent(position));
        slide.addText(`Visualization not found: '${visualization}'`, {
            x: position.x, y: position.y + 1, w: position.w,
            align: 'center', color: 'FF0000', fontSize: 14
        });
    }
}

/**
 * Handle Advance Metric ONM Slide Generation
 * @param data Metric data
 * @param slide pptxgenjs Slide object
 * @param position Position on slide
 */
function handleAdvanceMetricOnm(data: AdvanceMetricData, slide: any, position: Position) {
    let finalTable = data.table || data.details?.table;
    const { titleContent } = data;
    let visualization = data.visualization ? data.visualization.trim().toLowerCase() : '';

    // Validation for empty table
    if (!finalTable || !finalTable.body || finalTable.body.length === 0) {
        console.log(`[handleAdvanceMetricOnm] Table data is empty for ${titleContent}`);
        if (titleContent) {
            slide.addText(titleContent, generateTitleContent(position));
            slide.addText('Data Not Available', {
                x: position.x, y: position.y + 1, w: position.w,
                align: 'center', color: '888888', fontSize: 14
            });
        }
        return;
    }

    const handlers: { [key: string]: () => void } = {
        table: () => {
            slide.addText(titleContent, generateTitleContent(position));
            const { averageRow: avgRowData, metrics } = getAverageAndMetrics(finalTable.body);
            let modelData = generateAdvanceMetricTable(finalTable, metrics);

            // create average row cells
            let avgRowCells: any[] = [];
            if (avgRowData && avgRowData.cells) {
                avgRowData.cells.forEach((model2: any) => {
                    let cell = model2.value;
                    avgRowCells.push({ text: cell, options: { fill: 'CCF2F9', color: '00BAEC', bold: false } });
                });
                modelData.push(avgRowCells);
            }

            slide.addTable(modelData, generateTable(position));
        },
    };

    if (handlers[visualization]) {
        handlers[visualization]();
    } else {
        console.log(`[handleAdvanceMetricOnm] No handler for visualization: ${visualization}`);
        slide.addText(titleContent, generateTitleContent(position));
        slide.addText(`Visualization not found: '${visualization}'`, {
            x: position.x, y: position.y + 1, w: position.w,
            align: 'center', color: 'FF0000', fontSize: 14
        });
    }
}

export {
    handleAdvanceMetric,
    handleAdvanceMetricOnm
};
