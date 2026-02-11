function getHashTags(inputText: string) {
    var regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var matches = [];
    var match;

    while ((match = regex.exec(inputText))) {
        matches.push(match[1]);
    }

    return matches.length;
}

function generateModelDataText(title: string, data: any) {
    let value = data?.value || 0;
    let growth = data?.growth || 0;
    //   let past = data?.past;
    let upOrDown = '⬆  ';
    if (growth < 0) {
        upOrDown = '⬇  ';
    }
    let result = [
        {
            text: ' ' + title,
            options: {
                transparency: 10,
                padding: 0.3,
                fontSize: 16,
                fontFamily: 'Roboto, sans-serif',
                color: '#0d0d0c',
                align: 'left',
                breakLine: true,
            },
        },
        {
            text: ' ' + value.toLocaleString('id-ID'),
            options: {
                margin: 0,
                fontSize: 24,
                bold: false,
                lineHeight: 130,
                fontFamily: 'Red Hat Display',
                color: '#051c26',
                fontWeight: 700,
                align: 'left',
                breakLine: true,
            },
        },
        {
            text: growth + '%' + ' ' + upOrDown,
            options: {
                fontSize: 14,
                color: growth < 0 ? '#c00000' : '#309ac7',
                align: 'right',
                fontFamily: 'Red Hat Display',
            },
        },
    ];
    return result;
}

function generateModelDataTextOnm(title: string, data: any) {
    let value = data?.value || 0;

    let result = [
        {
            text: '  ⛶ ' + title,
            options: {
                transparency: 10,
                padding: 0.3,
                fontSize: 16,
                fontFamily: 'Roboto, sans-serif',
                color: '0d0d0c',
                align: 'left',
                breakLine: true,
            },
        },
        {
            text: ' ' + value.toLocaleString('id-ID'),
            options: {
                margin: 0,
                fontSize: 24,
                bold: false,
                lineHeight: 130,
                fontFamily: 'Red Hat Display',
                color: '051c26',
                fontWeight: 700,
                align: 'left',
                breakLine: true,
            },
        },
    ];
    return result;
}

interface SizePosition {
    x: number;
    y: number;
    w?: number;
    h?: number;
}

function generateText(sizePosition: SizePosition) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: 2.75,
        h: 1.55,
        shape: 'roundRect',
        margin: 0.8,
        fill: { color: 'FFFFFF' },
        rectRadius: 0.3,
        line: { color: 'cccccc', width: 1 },
    };
    return result;
}

function generateTextSummary(sizePosition: SizePosition) {
    let result = {
        x: sizePosition.x,
        y: sizePosition.y,
        w: 11.5,
        h: 5.1,
        shape: 'roundRect',
        margin: 0.5,
        fill: { color: 'FFFFFF' },
        rectRadius: 0.3,
        line: { color: 'cccccc', width: 1 },
        autoFit: true,
        fontSize: 16,
    };
    return result;
}

export {
    getHashTags,
    generateModelDataText,
    generateModelDataTextOnm,
    generateText,
    generateTextSummary,
}
