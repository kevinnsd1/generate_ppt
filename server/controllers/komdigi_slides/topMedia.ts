export default function buildTopMedia(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // TOP 10 MEDIA SLIDE — Horizontal Bar Chart
  // ======================================================
  const tmSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const tmData = contents?.data?.[0]?.details || {};

  // Judul Utama
  tmSlide.addText(titleSlide || 'TOP 10 MEDIA', {
    x: 2.5, y: 1.45, w: 8.33, h: 0.55,
    fontSize: 20, bold: true, color: '1A1A1A',
    align: 'center', fontFace: 'Arial',
  });

  // --- CHART SECTION ---
  if (tmData.chartData) {
    // Reverse array agar yang terbesar berada di urutan atas jika pptxgenjs menggambarnya dari bawah
    const sortedData = [...tmData.chartData].reverse();
    const chartData = [{
      name: 'Total Artikel',
      labels: sortedData.map((d: any) => d.name),
      values: sortedData.map((d: any) => d.value)
    }];

    tmSlide.addChart(pptx.charts.BAR, chartData, {
      x: 2.0, y: 2.1, w: 9.33, h: 4.2,
      barDir: 'bar', // Horizontal bar
      barGap: 30,
      chartColors: ['0066CC'], // Standard Blue
      showValue: true,
      dataLabelPosition: 'inEnd', // Inside the end of the bar
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 10,
      dataLabelFontBold: true,
      valAxisHidden: false,
      valGridLine: { style: 'none' }, // Remove vertical lines
      catAxisLineShow: false,
      catAxisLabelFontSize: 10,
      showLegend: true,
      legendPos: 'b',
      legendFontSize: 9
    });
  }

  // --- SUMMARY TEXT ---
  if (tmData.summary) {
    tmSlide.addText(tmData.summary, {
      x: 1.66, y: 6.3, w: 10.0, h: 0.8,
      fontSize: 11, color: '1A1A1A', align: 'center',
      fontFace: 'Arial', lineSpacingMultiple: 1.2
    });
  }

  // Footer Note
  if (tmData.footerNote) {
    tmSlide.addText(tmData.footerNote, {
      x: 0, y: 7.2, w: 13.33, h: 0.3,
      fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
    });
  }
}
