/**
 * Generate model data for bar chart with individual colors per bar
 * Supports sentiment-based coloring for Top Topic/Perception charts
 */
function generateModelDataBarWithColors(name: string, data: any[], sorting?: string) {
    let labels = [];
    let values = [];
    let colors = [];

    if (sorting == 'desc') {
        data.sort((a, b) => b.value - a.value);
    } else if (sorting == 'asc') {
        data.sort((a, b) => a.value - b.value);
    }

    for (let a = 0; a < data.length; a++) {
        labels.push(data[a].name);
        values.push(data[a].value);

        // Assign color based on sentiment
        const sentiment = data[a].sentiment || 'neutral';
        if (sentiment === 'positive') {
            colors.push('21BF73'); // Green
        } else if (sentiment === 'negative') {
            colors.push('FD5E53'); // Red
        } else {
            colors.push('1DA1F2'); // Blue for neutral
        }
    }

    let result = [
        {
            labels: labels,
            values: values,
            name: name,
            colors: colors, // Individual colors per bar
        },
    ];
    return result;
}

export {
    generateModelDataBarWithColors,
};
