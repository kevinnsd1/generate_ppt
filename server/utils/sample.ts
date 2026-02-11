
interface SizePosition {
    x: number;
    y: number;
    w: number;
    h: number;
}

function generateSamplePostPpt(sizePosition: SizePosition, path: string) {
    let result = {
        path: path,
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
    };
    return result;
}

function generateSamplePostLink(sizePosition: SizePosition, path: string) {
    return {
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
        hyperlink: { url: path },
        align: 'center',
    };
}

function generateSampleArticleLink(sizePosition: SizePosition, path: string) {
    return { x: sizePosition.x, y: sizePosition.y, hyperlink: { url: path } };
}

function generateSampleTalkPpt(sizePosition: SizePosition, path: string) {
    let result = {
        path: path,
        x: sizePosition.x,
        y: sizePosition.y,
        w: sizePosition.w,
        h: sizePosition.h,
    };
    return result;
}

function generateSampleTalkLink(sizePosition: SizePosition, path: string) {
    return {
        x: sizePosition.x,
        y: sizePosition.y,
        hyperlink: { url: path },
        margin: 0.123,
        color: '#063970',
        fontSize: 10,
    };
}

export {
    generateSamplePostPpt,
    generateSamplePostLink,
    generateSampleArticleLink,
    generateSampleTalkPpt,
    generateSampleTalkLink,
};
