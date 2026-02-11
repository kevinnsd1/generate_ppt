/**
 * Generate placeholder card for when data fails to load
 * Returns a simple text-based placeholder that maintains layout consistency
 */

interface PlaceholderOptions {
    message?: string;
    width?: number;
    height?: number;
}

function generatePlaceholderCard(options: PlaceholderOptions = {}) {
    const {
        message = 'Data Not Available',
        width = 600,
        height = 800
    } = options;

    // For now, return a simple placeholder object
    // This will be rendered as a gray box with text
    return {
        type: 'placeholder',
        message,
        width,
        height,
        // Use a gray placeholder image URL or base64
        // For PowerPoint, we'll generate a simple shape with text
        placeholder: true
    };
}

export = generatePlaceholderCard;
