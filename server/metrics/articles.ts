import pptxgen from 'pptxgenjs';
const { generateModelDataBarFromNameValue, generateBar } = require('../utils/bar');
const { generateModelDataBarWithColors } = require('../utils/barWithColors');
const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateModelDataPie, generatePie } = require('../utils/pie');
const { generateTitleContent } = require('../utils/content');
const { addNoDataMessage, isDataEmpty } = require('../utils/noDataMessage');
const {
    COLORS_ACCENT,
    SINGLE_COLOR
} = require('../controllers/enums_charts');

// Interface untuk data artikel
interface ArticleData {
    titleContent: string;
    visualization: string;
    nameValue: any[]; // Array of object {name, value}
    metric: string;
    table?: any;
    details?: {
        table: any;
    };
}

// Interface untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

// Interface untuk Opsi Tambahan
interface ArticleOptions {
    chosenTableColors?: {
        oddRowFill: string;
        evenRowFill: string;
        headerFill: string;
        headerFontColor: string;
    };
}

/**
 * Menangani pembuatan slide artikel portal (Pie & Bar Chart)
 */
function handleArticlePortal(data: ArticleData, slide: any, position: Position, options: ArticleOptions = {}) {
    const { titleContent, visualization, nameValue, metric } = data;
    const { chosenTableColors } = options;
    const table = data.table || data.details?.table;
    const pptx = new pptxgen();

    const handlers: { [key: string]: () => void } = {
        pie: () => {
            // Cek data kosong
            if (isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            let modelData = generateModelDataPie('Sentiment', nameValue, 'desc');
            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(pptx.charts.PIE, modelData, generatePie(position, titleContent));
        },

        bar_chart: () => {
            // Cek data kosong
            if (isDataEmpty(nameValue)) {
                addNoDataMessage(slide, position, titleContent);
                return;
            }

            const titleUpper = titleContent.trim().toUpperCase();
            let sorting: 'desc' | 'asc' | null = 'desc';

            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA') {
                sorting = null;
                nameValue.sort((a: any, b: any) => a.name.localeCompare(b.name));
            }

            const isSentimentChart = titleUpper.includes('TOP TOPIC') ||
                titleUpper.includes('TOP PERCEPTION') ||
                titleUpper.includes('POSITIVE TOPIC') ||
                titleUpper.includes('NEGATIVE TOPIC');

            // Untuk bar horizontal di PPTX, item pertama ada di bawah.
            // Kita ingin High di Atas, jadi kita gunakan sorting 'asc' agar 'desc' visualnya.
            if (isSentimentChart) {
                sorting = 'asc';
            }

            let modelData;
            if (isSentimentChart) {
                modelData = generateModelDataBarWithColors('Sentiment', nameValue, sorting);
            } else {
                modelData = generateModelDataBarFromNameValue('Sentiment', nameValue, sorting);
            }

            // Memaksa horizontal untuk bar chart
            const isHorizontal = true;
            const dir = isHorizontal ? 'bar' : 'col';

            // Inisialisasi konfigurasi bar
            let barConfig = generateBar(position, titleContent, SINGLE_COLOR, false, dir, metric);

            // Hide grid lines dan axis line untuk tipe chart tertentu
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || isSentimentChart || visualization === 'stack_bar_chart') {
                barConfig.valGridLine = { style: 'none' };
                barConfig.catGridLine = { style: 'none' };
                barConfig.catAxisLineShow = true; // Tampilkan garis sumbu X horizontal
                barConfig.valAxisLineShow = false; // Sembunyikan garis sumbu Y vertikal

                // Tampilkan label data untuk Social Media dan Online Media
                if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || visualization === 'stack_bar_chart') {
                    barConfig.showValue = true;
                    barConfig.dataLabelPosition = 'ctr'; // Posisi label di tengah bar
                    barConfig.dataLabelColor = 'FFFFFF'; // Warna putih
                    barConfig.dataLabelFontSize = 12;
                    barConfig.dataLabelFontBold = false;
                    barConfig.barGapWidthPct = 50; // Bar lebar

                    // Tampilkan label axis dan kurangi tinggi
                    barConfig.valAxisHidden = false;
                    barConfig.valAxisLineShow = false;
                    barConfig.h = position.h * 0.85; // Kurangi tinggi 15%
                    barConfig.showLegend = false;
                }
            }

            // Kurangi gap khusus untuk Social Media dan Online Media
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || visualization === 'stack_bar_chart') {
                barConfig.barGapWidthPct = 10;
            }

            let colors = ['003366', '00BAEC']; // Default Blue Palette
            if (titleUpper === 'SOCIAL MEDIA' || titleUpper === 'ONLINE MEDIA' || visualization === 'stack_bar_chart') {
                colors = ['003366', '00BAEC'];
            } else if (isSentimentChart) {
                // Gunakan warna dari generateModelDataBarWithColors
                if (modelData[0] && modelData[0].colors) {
                    colors = modelData[0].colors;
                }
            }

            // Update warna di konfigurasi
            barConfig.chartColors = colors;

            slide.addText(titleContent, generateTitleContent(position));
            slide.addChart(
                pptx.charts.BAR,
                modelData,
                barConfig,
            );
        },
        table: () => {
            let colWidths = [0.5, 2.5, 1.0, 1.0, 1.0];
            let adjustedPosition = { ...position, y: position.y - 0.2 };

            let modelData = chosenTableColors
                ? generateModelDataTable(
                    table,
                    chosenTableColors.oddRowFill,
                    chosenTableColors.evenRowFill,
                    chosenTableColors.headerFill,
                    chosenTableColors.headerFontColor
                )
                : generateModelDataTable(table);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
        },
        stack_bar_chart: () => {
            // Gunakan logika yang sama dengan bar_chart
            handlers.bar_chart();
        },
    };

    if (handlers[visualization]) handlers[visualization]();
}

/**
 * Menangani pembuatan slide artikel by media (Table only mostly)
 */
function handleArticleByMedia(data: ArticleData, slide: any, position: Position, options: ArticleOptions = {}) {
    try {
        const { titleContent } = data;
        let { visualization } = data;
        const { chosenTableColors } = options;

        visualization = visualization ? visualization.trim().toLowerCase() : '';

        const table = data.table || data.details?.table;

        const handlers: { [key: string]: () => void } = {
            table: () => {
                let colWidths = [0.5, 1.6, 1.0, 1.0, 1.0, 1.0];
                let adjustedPosition = { ...position, y: position.y - 0.2 };

                // Validasi
                if (!table || !table.body || table.body.length === 0) {
                    slide.addText(`Data Not Available (Empty Table)`, {
                        x: position.x, y: position.y + 1, w: position.w,
                        align: 'center', color: 'FF0000', fontSize: 14
                    });
                    return;
                }

                let modelData = chosenTableColors
                    ? generateModelDataTable(
                        table,
                        chosenTableColors.oddRowFill,
                        chosenTableColors.evenRowFill,
                        chosenTableColors.headerFill,
                        chosenTableColors.headerFontColor
                    )
                    : generateModelDataTable(table);

                slide.addText(titleContent, generateTitleContent(adjustedPosition));
                slide.addTable(modelData, generateTable(adjustedPosition, colWidths));
            },
        };

        if (handlers[visualization]) {
            handlers[visualization]();
        } else {
            console.log(`[handleArticleByMedia] No handler for visualization: ${visualization}`);
            slide.addText(`Visualization not found: '${visualization}'`, {
                x: position.x, y: position.y + 1, w: position.w,
                align: 'center', color: 'FF0000', fontSize: 14
            });
        }
    } catch (err: any) {
        console.error(`[handleArticleByMedia] Critical Error:`, err);
        slide.addText(`System Error: ${err.message}`, {
            x: position.x, y: position.y + 2, w: position.w,
            align: 'center', color: 'FF0000', fontSize: 14
        });
    }
}

export {
    handleArticlePortal,
    handleArticleByMedia
}
