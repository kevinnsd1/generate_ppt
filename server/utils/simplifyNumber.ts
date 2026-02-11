const calc = (number: number, comparison: number): string => {
    return parseFloat((number / comparison).toFixed(1)).toLocaleString('id-ID');
};

const simplifyNumber = (number: number): string => {
    if (number < 1000) {
        return parseFloat(number.toString()).toLocaleString('id-ID');
    }
    if (number >= 1000 && number < 1000000) {
        return `${calc(number, 1000)}K`;
    } else if (number >= 1000000 && number < 1000000000) {
        return `${calc(number, 1000000)}M`;
    } else if (number >= 1000000000 && number < 1000000000000) {
        return `${calc(number, 1000000000)}B`;
    } else return 'over 1B';
};

export = simplifyNumber;
