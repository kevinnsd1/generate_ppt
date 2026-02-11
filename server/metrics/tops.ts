const { generateModelDataTable, generateTable } = require('../utils/table');
const { generateTitleContent, generateTextSummary } = require('../utils/content');

// Define type for table colors config
interface TableColors {
    oddRowFill: string;
    evenRowFill: string;
    headerFill: string;
    headerFontColor: string;
}

// Define type for summary config
interface SummaryConfig {
    enabled: boolean;
    position: 'top' | 'left' | 'right' | 'bottom';
}

// Define type for additional config arguments
interface ConfigArgs {
    chosenTableColors?: TableColors;
    summaryConfig?: SummaryConfig;
}

// Define input data type for tops
interface TopsData {
    titleContent: string;
    visualization: string;
    table: any;
    summary?: string;
}

// Definisikan tipe untuk posisi
interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
}

/**
 * Menangani pembuatan slide untuk top metrics (Tabel)
 * @param data Data metrics termasuk konten judul dan data tabel
 * @param slide Slide object dari pptxgenjs (tipe any karena definisi tipe tidak tersedia)
 * @param position Posisi elemen dalam slide
 * @param config Konfigurasi tambahan seperti warna tabel dan posisi summary
 */
function handleTops(
    data: TopsData,
    slide: any,
    position: Position,
    { chosenTableColors, summaryConfig }: ConfigArgs
) {
    const { titleContent, visualization, table } = data;

    const handlers: { [key: string]: () => void } = {
        table: () => {
            // Hitung lebar kolom proporsional berdasarkan lebar yang tersedia
            // Rasio asli: [0.5, 2.5, 1.0, 1.0, 1.0] = total 6.0
            const baseWidths = [0.5, 2.5, 1.0, 1.0, 1.0];
            const baseTotal = baseWidths.reduce((sum, w) => sum + w, 0);
            const availableWidth = position.w;
            const colWidths = baseWidths.map(w => (w / baseTotal) * availableWidth);

            // Tentukan apakah perlu menyusutkan/meregangkan tabel berdasarkan posisi summary
            const isTopSummary = summaryConfig && summaryConfig.enabled && summaryConfig.position === 'top';
            const isLeftSummary = summaryConfig && summaryConfig.enabled && summaryConfig.position === 'left';

            let tableData = table;
            // Batasi hingga 10 baris jika ada Summary di Atas atau Kiri
            if ((isTopSummary || isLeftSummary) && tableData.body.length > 10) {
                tableData = { ...table, body: table.body.slice(0, 10) };
            }

            let headerFontSize = 13;
            let bodyFontSize = 11;
            let rowHeight = 0.5;

            if (isTopSummary) {
                headerFontSize = 12;
                bodyFontSize = 10;
                rowHeight = 0.4;
            } else if (isLeftSummary) {
                headerFontSize = 12;
                bodyFontSize = 11; // Ukuran body standar untuk kiri karena ada ruang
                rowHeight = 0.50; // Regangkan untuk mengisi 6.0 inci
            }

            let adjustedPosition = { ...position, y: position.y - 0.2 };

            // Generate model data tabel berdasarkan warna yang dipilih
            let modelData = chosenTableColors
                ? generateModelDataTable(
                    tableData,
                    chosenTableColors.oddRowFill,
                    chosenTableColors.evenRowFill,
                    chosenTableColors.headerFill,
                    chosenTableColors.headerFontColor,
                    headerFontSize, // Font header dinamis
                    bodyFontSize  // Font body dinamis
                )
                : generateModelDataTable(tableData, null, null, null, null, headerFontSize, bodyFontSize);

            slide.addText(titleContent, generateTitleContent(adjustedPosition));
            slide.addTable(modelData, generateTable(adjustedPosition, colWidths, true, rowHeight));
        },
    };

    if (handlers[visualization]) return handlers[visualization]();
}

/**
 * Menangani pembuatan slide untuk top issues
 * @param data Data metrics
 * @param slide Slide object
 * @param position Posisi elemen
 * @param type Tipe issue (default: "default")
 */
function handleTopIssues(data: TopsData, slide: any, position: Position, type: string = "default") {
    const { titleContent, summary } = data;

    try {
        slide.addText(titleContent, generateTitleContent(position));
        if (summary) {
            slide.addText(summary, generateTextSummary(position));
        }
    } catch (error) {
        console.error(`error to generate top issue${type !== "default" ? " " + type : ""} text: ${error}`)
    }
}

export {
    handleTops,
    handleTopIssues,
};
