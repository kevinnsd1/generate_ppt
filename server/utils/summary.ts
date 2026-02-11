/**
 * Summary Box Rendering Utility
 * Renders a text summary box on PowerPoint slides
 */

import { getSummaryBoxPosition } from './position';

/**
 * Render summary box on slide with text content
 * @param {object} slide - PPTXGenJS slide object
 * @param {object} pptx - PPTXGenJS instance
 * @param {object} summaryConfig - {enabled: boolean, text: string, position: 'left'|'top'}
 */
function renderSummaryBox(slide: any, pptx: any, summaryConfig: any) {
    if (!summaryConfig || !summaryConfig.enabled || !summaryConfig.text) {
        return; // No summary to render
    }

    const summaryPos = getSummaryBoxPosition(summaryConfig.position);

    if (!summaryPos) {
        console.warn(`Invalid summary position: ${summaryConfig.position}`);
        return;
    }

    // NO BACKGROUND BOX - just render text directly
    // Add summary text (no background, no padding needed)
    slide.addText(summaryConfig.text, {
        x: summaryPos.x,
        y: summaryPos.y,
        w: summaryPos.w,
        h: summaryPos.h,
        fontSize: 10,
        color: '9D9D9C',  // Black text
        valign: 'top',
        align: 'justify',  // Justify alignment
        fontFace: 'rubik',
        lineSpacing: 16,
        wrap: true
    });
}

/**
 * Get white card configuration adjusted for summary box
 * @param {object} summaryConfig - {enabled: boolean, position: 'left'|'top'}
 * @returns {object} White card configuration {x, y, w, h}
 */
function getWhiteCardConfig(summaryConfig: any) {
    // Default config (no summary)
    const defaultConfig = {
        x: 0.35,
        y: 1.1,
        w: 12.8,
        h: 6.08
    };

    // If summary disabled, return default
    if (!summaryConfig || !summaryConfig.enabled || !summaryConfig.position) {
        return defaultConfig;
    }

    const summaryPosition = summaryConfig.position;

    // Adjusted config for summary LEFT
    if (summaryPosition === 'left') {
        return {
            x: 2.9,    // shifted right to make room for summary (0.5 + 2.3 + 0.1 spacing)
            y: 1.1,    // y stays same
            w: 10.15,  // reduced width (12.8 - 2.65)
            h: 6.0     // increased height to 6.0 (was 6.08 in original code but reduced elsewhere, ensure matches content)
        };
    }

    // Adjusted config for summary TOP
    if (summaryPosition === 'top') {
        return {
            x: 0.35,   // x stays same
            y: 2.3,    // shifted down (1.1 + 0.95 + 0.25 spacing)
            w: 12.8,   // width stays same
            h: 4.88    // reduced height (6.08 - 1.2)
        };
    }

    // Fallback to default
    return defaultConfig;
}

export {
    renderSummaryBox,
    getWhiteCardConfig,
};
