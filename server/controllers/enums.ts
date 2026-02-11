/**
 * enums.ts
 * Global variables and constants for PPT generation
 */

// ===== LIBRARY =====

// Check if running in browser (window exists) - in Node.js this will be false
export const TESTMODE: boolean = false; // Always false in Node.js environment

export const COMPRESS: boolean = true; // TEST: `compression` write prop

// ===== CONSTANTS =====

export const CUST_NAME: string = 'S.T.A.R. Laboratories';
export const USER_NAME: string = 'Barry Allen';
export const ARRSTRBITES: number[] = [130];
export const CHARSPERLINE: number = 130; // "Open Sans", 13px, 900px-colW = ~19 words/line ~130 chars/line

// ===== TABLES =====

export const TABLE_NAMES_F: string[] = [
    'Markiplier',
    'Jack',
    'Brian',
    'Paul',
    'Ev',
    'Ann',
    'Michelle',
    'Jenny',
    'Lara',
    'Kathryn',
    'Boni',
    'Joni',
    'JOJO',
];

export const TABLE_NAMES_L: string[] = [
    'Johnson',
    'Septiceye',
    'Lapston',
    'Lewis',
    'Clark',
    'Griswold',
    'Hart',
    'Cube',
    'Malloy',
    'Capri',
];

interface TableObject {
    name1: string;
    name2: string;
    name3: string;
    name4: string;
    name5: string;
    name6: string;
}

export const tableObject: TableObject[] = [
    {
        name1: 'adik',
        name2: 'adik',
        name3: 'adik',
        name4: 'adik',
        name5: 'adik',
        name6: 'adik',
    },
    {
        name1: 'darmadi',
        name2: 'darmadi',
        name3: 'darmadi',
        name4: 'darmadi',
        name5: 'darmadi',
        name6: 'darmadi',
    },
];

export const BASE_TABLE_OPTS = {
    x: 0.5,
    y: 0.13,
    colW: [9, 3.33],
}; // LAYOUT_WIDE w=12.33

// ===== STYLES =====

export const COLOR_BLU: string = '0088CC';

// ===== OPTIONS =====

export const BASE_TEXT_OPTS_L = {
    color: '05ddfa',
    margin: 3,
    fontSize: 20,
    border: [
        null,
        null,
        {
            pt: '1',
            color: 'CFCFCF',
        },
        null,
    ],
};

export const BASE_TEXT_OPTS_R = {
    text: 'Nolimit',
    options: {
        color: '9F9F9F',
        margin: 3,
        border: [
            0,
            0,
            {
                pt: '1',
                color: 'CFCFCF',
            },
            0,
        ],
        align: 'right',
    },
};

export const FOOTER_TEXT_OPTS = {
    x: 0.0,
    y: 7.16,
    w: '100%',
    h: 0.3,
    margin: 3,
    color: '9F9F9F',
    align: 'center',
    fontSize: 10,
};

export const BASE_CODE_OPTS = {
    color: '9F9F9F',
    margin: 3,
    border: {
        pt: '1',
        color: 'CFCFCF',
    },
    fill: {
        color: 'F1F1F1',
    },
    fontFace: 'Courier',
    fontSize: 12,
};

export const BASE_OPTS_SUBTITLE1 = {
    x: 0.6,
    y: 0.7,
    xTable: 6.83,
    w: 4,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Arial',
    color: '0088CC',
    fill: {
        color: 'FFFFFF',
    },
};

export const BASE_OPTS_SUBTITLE2 = {
    y: 0.7,
    x: 6.83,
    w: 4,
    h: 0.3,
    fontSize: 13,
    fontFace: 'Arial',
    color: '0088CC',
    fill: {
        color: 'FFFFFF',
    },
};

export const DEMO_TITLE_TEXT = {
    fontSize: 14,
    color: '0088CC',
    bold: true,
};

export const DEMO_TITLE_TEXTBK = {
    fontSize: 14,
    color: '0088CC',
    bold: true,
    breakLine: true,
};

export const DEMO_TITLE_OPTS = {
    fontSize: 13,
    color: '9F9F9F',
};

// ===== PATHS =====

interface ImagePath {
    path: string;
}

export const IMAGE_PATHS: Record<string, ImagePath> = {
    peace4: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/peace4.png',
    },
    starlabsBkgd: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/starlabs_bkgd.jpg',
    },
    starlabsLogo: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/starlabs_logo.png',
    },
    wikimedia1: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/wiki-example.jpg',
    },
    wikimedia2: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/png-gradient-hex.png',
    },
    wikimedia_svg: {
        path: 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@master/demos/common/images/lock-green.svg',
    },
    ccCopyRemix: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/cc_copyremix.gif',
    },
    ccLogo: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/cc_logo.jpg',
    },
    ccLicenseComp: {
        path: '/common/images/cc_license_comp.png',
    },
    ccDjGif: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/cc_dj.gif',
    },
    gifAnimTrippy: {
        path: 'https://cdn.jsdelivr.net/gh/gitbrent/pptxgenjs@latest/demos/common/images/trippy.gif',
    },
    chicagoBean: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/chicago_bean_bohne.jpg?op=paramTest&ampersandTest',
    },
    sydneyBridge: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/sydney_harbour_bridge_night.jpg?op=paramTest&ampersandTest&fileType=.jpg',
    },
    tokyoSubway: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/tokyo-subway-route-map.jpg',
    },
    sample_avi: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.avi',
    },
    sample_m4v: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.m4v',
    },
    sample_mov: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.mov',
    },
    sample_mp4: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.mp4',
    },
    sample_mpg: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.mpg',
    },
    sample_mp3: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.mp3',
    },
    sample_wav: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/media/sample.wav',
    },
    big_earth_mp4: {
        path: '/common/media/earth-big.mp4',
    },
    UPPERCASE: {
        path: 'https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/demos/common/images/UPPERCASE.PNG',
    },
};

// ===== LOREM IPSUM =====

export const LOREM_IPSUM_ENG: string =
    `Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia.`;

export const LOREM_IPSUM: string =
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin condimentum dignissim velit vel luctus. Donec feugiat ipsum quis tempus blandit. Donec mattis mauris vel est dictum interdum. Pellentesque imperdiet nibh vitae porta ornare. Fusce non nisl lacus.`;
