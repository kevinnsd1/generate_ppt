
import { IMAGE_PATHS } from './enums';
// Using require for large media file to avoid potential TS parsing issues or complex import structure if not typed
import * as _media from './media';

function createMasterSlides(pptx: any, colorChoice: string) {

    /**
     * @section Master Slide Color Mapping
     * @description
     * Bagian ini bertanggung jawab untuk menentukan aset gambar (background, title, separator, dll)
     * yang digunakan di setiap master slide berdasarkan tema warna (`colorChoice`) yang dipilih user.
     */
    const titleMap: any = {
        blue: _media.titleBg,               // background judul tema biru
        red: _media.titleBgRed,             // background judul tema merah
        green: _media.titleBgGreen,         // background judul tema hijau
        navy: _media.titleBgNavy,           // background judul tema navy
        yellow: _media.titleBgYellow,       // background judul tema kuning
        lightBlue: _media.titleBgLightBlue, // background judul tema biru muda
    };

    const sectionMap: any = {
        blue: _media.separatorBgNew,            // background pemisah tema biru
        red: _media.separatorBgRed,             // background pemisah tema merah
        green: _media.separatorBgGreen,         // background pemisah tema hijau
        navy: _media.separatorBgNavy,           // background pemisah tema navy
        yellow: _media.separatorBgYellow,       // background pemisah tema kuning
        lightBlue: _media.separatorBgLightBlue, // background pemisah tema biru muda
    };

    const bgMap: any = {
        blue: _media.plainBg,             // background polos tema biru
        red: _media.bgRed,                // background polos tema merah
        green: _media.bgGreen,            // background polos tema hijau
        navy: _media.bgNavy,              // background polos tema navy
        yellow: _media.bgYellow,          // background polos tema kuning
        lightBlue: _media.bgLightBlue,    // background polos tema biru muda
    };

    const thanksMap: any = {
        blue: _media.thankyouBg,          // background thank you tema biru
    };

    /**
     * @description
     * Pemilihan aset akhir berdasarkan `colorChoice` yang diberikan.
     * Jika warna tidak ditemukan di map terkait, sistem akan kembali menggunakan nilai default (tema biru).
     */

    const chosenTitle = titleMap[colorChoice] || _media.titleBg;
    const chosenSection = sectionMap[colorChoice] || _media.separatorBgNew;
    const chosenBackground = bgMap[colorChoice] || _media.plainBg;
    const chosenThanks = thanksMap[colorChoice] || _media.thankyouBg;

    let objBkg = {
        path: IMAGE_PATHS.starlabsBkgd.path,
    };
    let objImg = {
        path: IMAGE_PATHS.starlabsLogo.path,
        x: 4.6,
        y: 3.5,
        w: 4,
        h: 1.8,
    };

    pptx.defineSlideMaster({
        title: 'TITLE_SLIDE',
        background: {
            data: chosenTitle,
        },
        objects: [
            //{ 'line':  { x:3.5, y:1.0, w:6.0, h:0.0, line:{color:'0088CC'}, lineSize:5 } },
            //{ 'chart': { type:'PIE', data:[{labels:['R','G','B'], values:[10,10,5]}], options:{x:11.3, y:0.0, w:2, h:2, dataLabelFontSize:9} } },
            // { 'image': { x: 0.5, y: 0.5, w: 1.47, h: 0.74, data: _media.nolimitLogoWhite } },
        ],
    });

    pptx.defineSlideMaster({
        title: 'SECTION_SLIDE',
        background: { data: chosenSection },
        objects: [
            {
                placeholder: {
                    options: {
                        name: 'separatorTitle',
                        type: 'title',
                        fontFace: 'Rubik Medium',
                        fontSize: 48,
                        x: 2,
                        y: 3,
                        w: 9.17,
                        h: 1.44,
                        align: 'middle',
                        color: 'FFFFFF',
                    },
                },
            },
            // { 'image': { x: 0.5, y: 0.5, w: 1.47, h: 0.74, data: _media.nolimitLogoWhite } },
        ],
    });

    // MASTER_PLAIN
    pptx.defineSlideMaster({
        title: 'MASTER_PLAIN',
        background: {
            data: chosenBackground,
        },
        margin: [0.5, 0.25, 1.0, 0.25],
        objects: [
            {
                placeholder: {
                    options: {
                        name: 'slideTitle',
                        type: 'title',
                        fontFace: 'Rubik Medium',
                        fontSize: 24,
                        x: 0.14,
                        y: 0.20,
                        w: 9,
                        h: 0.5,
                        align: 'left',
                        color: 'FFFFFF',
                    },
                },
            },
        ],
        slideNumber: {
            x: 12.49,
            y: 0.2,
            w: 0.5,
            h: 0.5,
            color: '757575',
            fontFace: 'Calibri (Body)',
            fontSize: 18,
            align: 'center',
            valign: 'middle',
        },
    });

    // MASTER_PLAIN WITH BODY
    pptx.defineSlideMaster({
        title: 'MASTER_PLAIN_WITH_BODY',
        background: {
            data: _media.plainBg,
        },
        margin: [0.5, 0.25, 1.0, 0.25],
        objects: [
            {
                placeholder: {
                    options: {
                        name: 'slideTitle',
                        type: 'title',
                        fontFace: 'Arial',
                        fontSize: 24,
                        bold: true,
                        x: 0.14,
                        y: 0.25,
                        w: 12.67,
                        h: 0.68,
                        align: 'left',
                        color: '006bdf',
                    },
                },
            },
            {
                placeholder: {
                    options: {
                        name: 'slideBody',
                        type: 'body',
                        fontSize: 16,
                        x: 0.14,
                        y: 1.14,
                        w: 12.67,
                        h: 0.68,
                        align: 'left',
                        color: '000000',
                    },
                },
            },
        ],
        slideNumber: {
            x: 12.71,
            y: 6.85,
            w: 0.4,
            h: 0.4,
            color: 'FFFFFF',
            fontFace: 'Arial',
            fontSize: 10,
            align: 'center',
            valign: 'middle',
        },
    });

    // THANKS_SLIDE (THANKS_PLACEHOLDER)
    pptx.defineSlideMaster({
        title: 'THANKS_SLIDE',
        background: { data: chosenThanks },
    });
}

export { createMasterSlides };
