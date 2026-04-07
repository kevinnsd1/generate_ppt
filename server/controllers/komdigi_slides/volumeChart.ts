export default function buildVolumeChart(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // VOLUME CHART SLIDE — 2 summary + 2 bar charts
  // ======================================================
  const volSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

  // Judul Utama (Centered)
  volSlide.addText(titleSlide || 'VOLUME PERCAKAPAN DAN PEMBERITAAN', {
    x: 2.5,
    y: 1.45,
    w: 8.33,
    h: 0.55,
    fontSize: 22,
    bold: true,
    color: '1A1A1A',
    align: 'center',
    fontFace: 'Arial',
  });

  const volData = contents?.data?.[0]?.details || {};

  // === LEFT SIDE (Media Sosial) ===
  const left = volData.left || {};
  // Label header kiri
  volSlide.addText(left.label || 'Media Sosial', {
    x: 0.6,
    y: 2.3,
    w: 6.0,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: '1A1A1A',
    align: 'center',
    fontFace: 'Arial',
  });
  // Summary Kiri
  volSlide.addText(left.summary || '', {
    x: 0.6,
    y: 2.75,
    w: 6.0,
    h: 1.5,
    fontSize: 11,
    color: '1A1A1A',
    align: 'justify',
    fontFace: 'Arial',
    lineSpacingMultiple: 1.1,
  });
  // Chart Kiri (Bar)
  if (left.chart) {
    const chartData = [
      {
        name: 'Value',
        labels: left.chart.map((c: any) => c.name),
        values: left.chart.map((c: any) => c.value),
      },
    ];
    volSlide.addChart(pptx.charts.BAR, chartData, {
      x: 0.6,
      y: 4.2,
      w: 6.0,
      h: 2.5,
      barDir: 'col',
      barGap: 30, // Thicker bars
      chartColors: ['00BAEC', 'F37021'], // Blue, Orange
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFontSize: 10,
      valAxisHidden: false,
      valGridLine: { style: 'none' },
      catAxisLineShow: true,
      showLegend: true,
      legendPos: 'b',
    });
  }

  // === RIGHT SIDE (Media Online) ===
  const right = volData.right || {};
  // Label header kanan
  volSlide.addText(right.label || 'Media Online', {
    x: 6.75,
    y: 2.3,
    w: 6.0,
    h: 0.4,
    fontSize: 18,
    bold: true,
    color: '1A1A1A',
    align: 'center',
    fontFace: 'Arial',
  });
  // Summary Kanan
  volSlide.addText(right.summary || '', {
    x: 6.75,
    y: 2.75,
    w: 6.0,
    h: 1.5,
    fontSize: 11,
    color: '1A1A1A',
    align: 'justify',
    fontFace: 'Arial',
    lineSpacingMultiple: 1.1,
  });
  // Chart Kanan (Bar)
  if (right.chart) {
    const chartData = [
      {
        name: 'Value',
        labels: right.chart.map((c: any) => c.name),
        values: right.chart.map((c: any) => c.value),
      },
    ];
    volSlide.addChart(pptx.charts.BAR, chartData, {
      x: 6.75,
      y: 4.2,
      w: 6.0,
      h: 2.5,
      barDir: 'col',
      barGap: 30, // Thicker bars
      chartColors: ['00BAEC', 'F37021'], // Blue, Orange
      showValue: true,
      dataLabelPosition: 'outEnd',
      dataLabelFontSize: 10,
      valAxisHidden: false,
      valGridLine: { style: 'none' },
      catAxisLineShow: true,
      showLegend: true,
      legendPos: 'b',
    });
  }

  // Footer Note
  if (volData.footerNote) {
    volSlide.addText(volData.footerNote, {
      x: 0.6,
      y: 7.0,
      w: 12.13,
      h: 0.3,
      fontSize: 9,
      color: '888888',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
