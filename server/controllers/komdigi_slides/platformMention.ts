export default function buildPlatformMention(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // PLATFORM MENTION SLIDE — Bar Chart + Text Summary
  // ======================================================
  const pmSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const pmData = contents?.data?.[0]?.details || {};

  // Judul Utama
  pmSlide.addText(titleSlide || 'JUMLAH MENTION PLATFORM', {
    x: 2.5, y: 1.45, w: 8.33, h: 0.55,
    fontSize: 20, bold: true, color: '1A1A1A',
    align: 'center', fontFace: 'Arial',
  });

  // --- CHART SECTION (Left) ---
  if (pmData.chartData) {
    // Buat setiap data sebagai series terpisah agar legend dan warna tampil sempurna (clustering)
    const chartSeries = pmData.chartData.map((d: any) => ({
      name: d.name,
      labels: [''], // Kategori kosong supaya bar bersebelahan dalam 1 grup
      values: [d.value]
    }));
    const chartColors = pmData.chartData.map((d: any) => d.color || '00BAEC');

    pmSlide.addChart(pptx.charts.BAR, chartSeries, {
      x: 0.6, y: 2.1, w: 6.0, h: 4.8,
      barDir: 'col',
      barGap: 30,
      chartColors: chartColors,
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFontSize: 10,
      valAxisHidden: false,
      valGridLine: { style: 'solid', color: 'E9E9E9' },
      catAxisLineShow: false,
      catAxisHidden: true,
      showLegend: true,
      legendPos: 'b',
      legendFontSize: 9
    });
  }

  // --- TEXT SUMMARY (Right) ---
  if (pmData.summary) {
    const summaryTextRuns: any[] = [];
    pmData.summary.forEach((item: any, idx: number) => {
      // First run: Bullet point + Title (Bold)
      summaryTextRuns.push({
        text: item.title + " ",
        options: { bold: true, fontSize: 9.5, color: '1A1A1A', bullet: true }
      });
      // Second run: Body Text (Normal) + Line Break for next paragraph
      summaryTextRuns.push({
        text: item.text,
        options: { bold: false, fontSize: 9.5, color: '1A1A1A', breakLine: true }
      });
    });

    pmSlide.addText(summaryTextRuns, {
      x: 6.8, y: 2.1, w: 6.0, h: 4.8,
      valign: 'top', align: 'justify', fontFace: 'Arial',
      lineSpacingMultiple: 1.2
    });
  }

  // Footer Note
  if (pmData.footerNote) {
    pmSlide.addText(pmData.footerNote, {
      x: 0, y: 7.2, w: 13.33, h: 0.3,
      fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
    });
  }
}
