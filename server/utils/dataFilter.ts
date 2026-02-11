/**
 * Filter and limit nameValue data to top N items by value
 * Remaining items are grouped into "Others"
 */

interface NameValue {
    name: string;
    value: number;
}

interface GroupSentiment {
    brandName: string;
    positive: number;
    negative: number;
    neutral: number;
    total?: number;
}

function filterTopN(nameValue: NameValue[], topN: number = 10, includeOthers: boolean = true) {
    if (!nameValue || nameValue.length === 0) return [];

    // Sort by value descending
    const sorted = [...nameValue].sort((a, b) => b.value - a.value);

    // If data is already within limit, return as is
    if (sorted.length <= topN) {
        return sorted;
    }

    // Take top N
    const topItems = sorted.slice(0, topN);

    // Calculate "Others" from remaining items
    if (includeOthers) {
        const remaining = sorted.slice(topN);
        const othersValue = remaining.reduce((sum, item) => sum + item.value, 0);

        if (othersValue > 0) {
            topItems.push({
                name: 'Others',
                value: othersValue
            });
        }
    }

    return topItems;
}

/**
 * Filter and limit groupSentiment data to top N items by total sentiment count
 * Remaining items are grouped into "Others"
 */
function filterTopNGroupSentiment(groupSentiment: GroupSentiment[], topN: number = 10, includeOthers: boolean = true) {
    if (!groupSentiment || groupSentiment.length === 0) return [];

    // Calculate total for each item and sort by total descending
    const withTotals = groupSentiment.map(item => ({
        ...item,
        total: (item.positive || 0) + (item.negative || 0) + (item.neutral || 0)
    }));

    const sorted = withTotals.sort((a, b) => b.total! - a.total!);

    // If data is already within limit, return as is (without total field)
    if (sorted.length <= topN) {
        return sorted.map(({ total, ...rest }) => rest);
    }

    // Take top N
    const topItems = sorted.slice(0, topN);

    // Calculate "Others" from remaining items
    if (includeOthers) {
        const remaining = sorted.slice(topN);
        const othersPositive = remaining.reduce((sum, item) => sum + (item.positive || 0), 0);
        const othersNegative = remaining.reduce((sum, item) => sum + (item.negative || 0), 0);
        const othersNeutral = remaining.reduce((sum, item) => sum + (item.neutral || 0), 0);

        if (othersPositive + othersNegative + othersNeutral > 0) {
            topItems.push({
                brandName: 'Others',
                positive: othersPositive,
                negative: othersNegative,
                neutral: othersNeutral,
                total: othersPositive + othersNegative + othersNeutral // Just to match structure
            });
        }
    }

    // Remove total field from result
    return topItems.map(({ total, ...rest }) => rest);
}

export {
    filterTopN,
    filterTopNGroupSentiment
};
