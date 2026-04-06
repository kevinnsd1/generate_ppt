
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
        background: { color: 'FFFFFF' }, 
        objects: [
            // === LOGO IMAGE (8.65cm x 4.37cm = 3.41" x 1.72") ===
            { image: { 
                path: IMAGE_PATHS.komdigiLogo.path, 
                x: 0.4, y: 0.1, w: 3.41, h: 1.37 
            } },

            // === HEADER TEXT (top-right) ===
            { text: { 
                text: 'Direktorat Informasi Publik', 
                options: { x: 7.5, y: 0.55, w: 5.35, h: 0.3, fontSize: 12, color: '1A1A1A', align: 'right', fontFace: 'Arial' } 
            } },
            { text: { 
                text: 'Direktorat Jenderal Komunikasi Publik dan Media', 
                options: { x: 7.5, y: 0.82, w: 5.35, h: 0.3, fontSize: 12, color: '1A1A1A', align: 'right', fontFace: 'Arial' } 
            } },

            // === BLUE CONTENT BOX (bigger, margin 0.6" each side) ===
            // y=1.7, h=5.3 → ends at 7.0, leaving 0.5" white bottom
            { rect: { x: 0.6, y: 1.7, w: 12.13, h: 5.3, fill: { color: 'DCF0F8' } } },

            // === DECORATIVE CYAN BOX (right edge of blue box) ===
            { rect: { x: 10.98, y: 1.7, w: 1.75, h: 0.55, fill: { color: '9ECFDE' } } },

            // === FOOTER TEXT (near bottom of blue box) ===
            { text: { 
                text: 'DIREKTORAT INFORMASI PUBLIK', 
                options: { x: 8.0, y: 6.45, w: 4.73, h: 0.45, fontSize: 17, color: '1A9BC4', align: 'right', fontFace: 'Arial', bold: false } 
            } },
        ],
    });

    // =========================================================
    // KOMDIGI_CONTENT — digunakan untuk semua halaman konten
    // Memiliki logo + header yang sama dengan TITLE_SLIDE
    // =========================================================
    pptx.defineSlideMaster({
        title: 'KOMDIGI_CONTENT',
        background: { color: 'FFFFFF' },
        objects: [
            // === LOGO IMAGE ===
            { image: { 
                path: IMAGE_PATHS.komdigiLogo.path, 
                x: 0.4, y: 0.1, w: 3.41, h: 1.37 
            } },

            // === HEADER TEXT (top-right) ===
            { text: { 
                text: 'Direktorat Informasi Publik', 
                options: { x: 7.5, y: 0.55, w: 5.35, h: 0.3, fontSize: 12, color: '1A1A1A', align: 'right', fontFace: 'Arial' } 
            } },
            { text: { 
                text: 'Direktorat Jenderal Komunikasi Publik dan Media', 
                options: { x: 7.5, y: 0.82, w: 5.35, h: 0.3, fontSize: 12, color: '1A1A1A', align: 'right', fontFace: 'Arial' } 
            } },

        ],
        slideNumber: {
            x: 12.49, y: 7.1, w: 0.5, h: 0.3,
            color: '888888', fontFace: 'Arial', fontSize: 10,
            align: 'center', valign: 'middle',
        },
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
