/**
 * Helper function to clean nameValue data
 * Converts PowerShell string format "@{name=...; value=...}" to proper JSON objects
 */
function cleanNameValueData(nameValue: any[]) {
    if (!Array.isArray(nameValue) || nameValue.length === 0) {
        return [];
    }

    // Check if first item is already a proper object
    if (typeof nameValue[0] === 'object' && nameValue[0] !== null && !nameValue[0].hasOwnProperty('@odata.type')) {
        return nameValue; // Already in correct format
    }

    // If it's PowerShell string format, parse it
    return nameValue.map(item => {
        if (typeof item === 'string' && item.startsWith('@{')) {
            try {
                // Parse PowerShell format: "@{name=um; value=170}"
                const cleaned = item.replace(/^@{/, '{').replace(/}$/, '}');
                const nameMatch = cleaned.match(/name=([^;]+)/);
                const valueMatch = cleaned.match(/value=([^}]+)/);

                if (nameMatch && valueMatch) {
                    return {
                        name: nameMatch[1].trim(),
                        value: parseFloat(valueMatch[1].trim()) || 0
                    };
                }
            } catch (e) {
                console.warn('Failed to parse nameValue item:', item, e);
            }
        }

        // If already object or other format, return as-is
        return item;
    }).filter(item => item && item.name); // Filter out invalid items
}

function normalizeData(data: any) {
    // Clean nameValue data before returning
    const rawNameValue = data.details?.nameValue || [];
    const cleanedNameValue = cleanNameValueData(rawNameValue);

    return {
        titleContent: data.titleContent,
        responseType: data.responseType?.name || '',
        metric: data.metric || '',
        visualization: data?.visualization || '',
        granularity: data?.granularity || '',
        details: data.details || {},

        // unwrap details biar gampang
        chronological: data.details?.chronological?.values || [],
        groupSentiment: data.details?.groupSentiment || [],
        chronologicalGroup: data.details?.chronologicalGroup || [],
        nameValue: cleanedNameValue, // Use cleaned data
        numericWithGrowth: data.details?.numericWithGrowth || {},
        numericOutput: data.details?.numericOutput || {},
        groupPosition: data.details?.groupPosition || [],
        comparison: data.details?.comparison || [],
        streamOutput: data.details?.streamOutput || [],
        onlineMediaStream: data.details?.onlineMediaStream || [],
        peaktime: data.details?.peaktime,
        table: data.details?.table || {},
        socialMediaSummary: data.details?.socialMediaSummary,
        summary: data.details?.summary || '',
    };
}

export = normalizeData;
