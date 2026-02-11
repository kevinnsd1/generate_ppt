import { handleAdvanceMetricOnm } from './advance';
import pptxgen from 'pptxgenjs';

// Mock data based on error log structure but with some content to bypass empty check
const mockData = {
    titleContent: "TEST TOP MEDIA",
    visualization: "table",
    table: {
        header: ["Rank", "Media", "Share", "Sentiment"],
        body: [
            {
                cells: [
                    { name: 'rank', value: '1' },
                    { name: 'media', value: 'Detik.com' },
                    { name: 'share', value: '50%' },
                    { name: 'sentiment', value: 'Positive' }
                ]
            },
            {
                cells: [
                    { name: 'rank', value: '2' },
                    { name: 'media', value: 'Kompas.com' },
                    { name: 'share', value: 30 }, // Number type
                    { name: 'sentiment', value: 'Neutral' }
                ]
            }
        ],
        rowCount: 2
    }
};

const mockPosition = { x: 1, y: 1, w: 5, h: 5 };

async function runDebug() {
    console.log("Starting Debug for Advance Metric Onm...");

    // 1. Mock Slide Object that logs calls instead of actual PPTX operations
    const slideMock: any = {
        addText: (text: string, opts: any) => console.log(`[Slide] addText: "${text}" at`, opts ? JSON.stringify(opts.x) + ',' + JSON.stringify(opts.y) : 'no opts'),
        addTable: (data: any[], opts: any) => {
            console.log(`[Slide] addTable called with ${data.length} rows.`);
            // Deep check for undefined/null in data
            data.forEach((row, rIdx) => {
                row.forEach((cell: any, cIdx: number) => {
                    if (cell.text === undefined || cell.text === null) {
                        console.error(`[CRITICAL] Row ${rIdx} Cell ${cIdx} has undefined/null text!`);
                    }
                });
            });
            console.log("Table data sample row 1:", JSON.stringify(data[0], null, 2));
        }
    };

    console.log("\n--- Testing handleAdvanceMetricOnm with valid mixed data ---");
    handleAdvanceMetricOnm(mockData, slideMock, mockPosition);

    console.log("\n--- Testing handleAdvanceMetricOnm with potential bad data (null value) ---");
    const badData = JSON.parse(JSON.stringify(mockData));
    if (badData.table.body[0].cells[2]) {
        badData.table.body[0].cells[2].value = null; // Set 'share' to null
    }
    handleAdvanceMetricOnm(badData, slideMock, mockPosition);
}

runDebug();
