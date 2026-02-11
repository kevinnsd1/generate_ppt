const { generateTitleContent, generateBrandPositioning } = require('../utils/content');
const { generateBrandPositioningImage } = require('../controllers/puppeteerGenerateImage');

const env = process.env.NODE_ENV || 'development';
const config = require('../../server/config/config.json')[env];
let path = config.EXPORT_PATH;

// Interface untuk data BrandPosition
interface BrandPositionData {
    titleContent: string;
    visualization: string;
    groupPosition: any; // Menggunakan any karena struktur data chart complex
    comparison?: any[];
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

// Interface untuk options tambahan
interface BrandPositionOptions {
    id: string;
    browser: any; // Puppeteer browser instance
    path?: string;
}

/**
 * Menangani pembuatan slide Brand Positioning (Image generation via Puppeteer)
 */
async function handleBrandPosition(data: BrandPositionData, slide: any, position: Position, options: BrandPositionOptions) {
    const { titleContent, visualization, groupPosition, comparison } = data;
    const { id, browser, path: optionsPath } = options;

    // Use path from options (local dev override) or fallback to config (prod)
    const usePath = optionsPath || path;

    const handlers: { [key: string]: () => Promise<void> } = {
        positioning_map: async () => {
            try {
                slide.addText(titleContent, generateTitleContent(position));

                // Use comparison data if available, otherwise fallback to groupPosition
                const chartData = (comparison && comparison.length > 0) ? comparison : groupPosition;

                let colors = chartData?.[0]?.colors || [];

                const brandPositioningImage = await generateBrandPositioningImage({
                    browser,
                    pathDir: usePath,
                    id,
                    data: chartData,
                    colors,
                });

                slide.addImage(generateBrandPositioning(position, `${usePath}${brandPositioningImage}`));
            } catch (err: any) {
                console.error(`error: failed to generate brand positioning image for ${titleContent}`, err);
                console.error(err.stack); // Log stack trace
                // Show error on slide
                slide.addText(`Chart Error: ${err.message}`, { x: position.x, y: position.y + 2, w: position.w, align: 'center', color: 'FF0000', fontSize: 14 });
            }
        },
    };

    if (handlers[visualization]) {
        await handlers[visualization]();
    } else {
        console.warn(`No handler for brand positioning visualization: ${visualization}`);
    }
}

export {
    handleBrandPosition
};
