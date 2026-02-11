const { generateTitleContent } = require('./content');

/**
 * Add "Data Not Available" message when chart has no data
 * @param {Object} slide - PowerPoint slide object
 * @param {Object} position - Position configuration {x, y, w, h}
 * @param {String} titleContent - Optional title to display above message
 */
function addNoDataMessage(slide: any, position: any, titleContent: string = '') {
    // Add title if exists
    if (titleContent && titleContent.trim().length > 0) {
        slide.addText(titleContent, generateTitleContent(position));
    }

    // Calculate message position (below title if exists)
    const messageY = titleContent ? position.y + 0.5 : position.y;
    const messageH = titleContent ? position.h - 0.5 : position.h;

    // Add "Data Not Available" message
    slide.addText('Data Not Available', {
        x: position.x,
        y: messageY,
        w: position.w,
        h: messageH,
        align: 'center',
        valign: 'middle',
        fontSize: 16,
        color: '999999',
        bold: true
    });
}

/**
 * Check if data array is empty or null
 * @param {Array} data - Data array to check
 * @returns {Boolean} - True if data is empty/null
 */
function isDataEmpty(data: any): boolean {
    return !data || !Array.isArray(data) || data.length === 0;
}

export {
    addNoDataMessage,
    isDataEmpty
};
