
import pptxgen from 'pptxgenjs';

// MOCK CONSTANTS
const COLORS_ACCENT = ['3874CB', '61B258', 'FACB00', 'C23F38', '54B9D1'];
const COLOR_SENTIMENT = ['4CAF50', '5B9BD5', 'E74C3C'];

function generateModelDataPie(name: string, data: any[], sorting: string) {
    if (sorting == 'desc') data.sort((a, b) => b.value - a.value);
    let labels = data.map(d => d.name);
    let values = data.map(d => d.value);
    return [{ labels, values, name }];
}

function generatePieSentiment(sizePosition: any, title: string) {
    return {
        x: sizePosition.x,
        y: sizePosition.y - 0.4,
        w: sizePosition.w,
        h: sizePosition.h,
        chartColors: COLOR_SENTIMENT,
        dataBorder: { pt: '1', color: 'F1F1F1' },
        showLegend: true,
        title: title,
        showTitle: true
    };
}

// DATA FROM SLIDE 72
const slide72Data = {
    talk_by_sentiment: [
        { name: "positive", value: 2 },
        { name: "neutral", value: 134 },
        { name: "negative", value: 0 }
    ]
};

async function run() {
    console.log("Starting reproduction with OVERFLOW...");
    let pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';

    let slide = pptx.addSlide();
    slide.addText("Debug Overflow", { x: 0.5, y: 0.5, fontSize: 18 });

    try {
        const pieData = generateModelDataPie('Share Of Voice', slide72Data.talk_by_sentiment, 'desc');

        // CALCULATE EXACT OVERFLOW POSITIONS
        // Original: x: 7.04, w: 6, h: 2.5
        // Enlarged: w * 1.15, h * 1.15
        // x - (w * 0.075)

        const originalW = 6;
        const originalH = 2.5;
        const originalX = 7.04;
        const originalY = 2.4; // From repro previously

        const w = originalW * 1.15; // 6.9
        const h = originalH * 1.15; // 2.875
        const x = originalX - (originalW * 0.075); // 7.04 - 0.45 = 6.59
        const y = originalY - (originalH * 0.075); // 2.4 - 0.1875 = 2.2125

        // Current Right Edge: 6.59 + 6.9 = 13.49.
        // Slide Width: 13.33 approx.

        const piePos = { x, y, w, h };
        console.log("Pie Position:", piePos);

        const pieConfig = generatePieSentiment(piePos, "Sentiment Analysis Overflow");

        slide.addChart(pptx.charts.PIE_3D, pieData, pieConfig);

        console.log("Saving file...");
        await pptx.writeFile({ fileName: 'debug_overflow.pptx' });
        console.log("Success! File saved.");

    } catch (err) {
        console.error("ERROR GENERATING PPT:", err);
    }
}

run();
