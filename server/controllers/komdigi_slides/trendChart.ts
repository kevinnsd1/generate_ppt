export default function buildTrendChart(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // TREND CHART SLIDE — 2 stacked line charts + sidebar
  // ======================================================
  const trSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const trData = contents?.data?.[0]?.details || {};

  // Judul Utama (Centered)
  trSlide.addText(titleSlide || 'TREN HARIAN PERCAKAPAN DAN PEMBERITAAN', {
    x: 2.5,
    y: 1.45,
    w: 8.33,
    h: 0.55,
    fontSize: 20,
    bold: true,
    color: '1A1A1A',
    align: 'center',
    fontFace: 'Arial',
  });

  const chartX = 0.5;
  const chartW = 9.0;
  const summaryX = 9.8;
  const summaryW = 3.2;

  // --- TOP SECTION (PERCAKAPAN) ---
  const top = trData.topChart || {};
  trSlide.addText(top.label || 'PERCAKAPAN', {
    x: chartX,
    y: 1.8,
    w: chartW,
    h: 0.3,
    fontSize: 16,
    color: '666666',
    align: 'center',
    fontFace: 'Arial',
  });

  if (top.series) {
    const chartData = top.series.map((s: any) => ({
      name: s.name,
      labels: s.data.map((d: any) => {
        // Format d-MMM-yy (e.g. 6-Mar-26)
        const date = new Date(d.timestamp);
        const day = date.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mon = months[date.getMonth()];
        const yr = date.getFullYear().toString().slice(-2);
        return `${day}-${mon}-${yr}`;
      }),
      values: s.data.map((d: any) => d.value),
    }));

    trSlide.addChart(pptx.charts.LINE, chartData, {
      x: chartX,
      y: 2.1,
      w: chartW,
      h: 2.4,
      chartColors: ['00BAEC', 'F37021'],
      lineDataSymbol: 'circle',
      lineDataSymbolSize: 6,
      showValue: true,
      dataLabelPosition: 't',
      dataLabelColor: '000000',
      dataLabelFontSize: 9,
      valAxisHidden: false,
      valAxisLineShow: true, // Show vertical line
      valGridLine: { style: 'none' },
      catAxisLineShow: true, // Show horizontal line
      catAxisLabelFontSize: 9,
      catAxisLabelRotate: -45,
      catAxisCrossingPos: 'autoZero', // Try to start axis from zero
      valAxisCrossingPos: 'autoZero',
      showLegend: true,
      legendPos: 'b',
    });
  }

  // Summary Top
  if (top.summary) {
    const bulletPoints = top.summary.map((s: string) => ({
      text: s,
      options: { bullet: true, fontSize: 10, color: '1A1A1A' },
    }));
    trSlide.addText(bulletPoints, {
      x: summaryX,
      y: 2.1,
      w: summaryW,
      h: 2.4,
      valign: 'top',
      align: 'justify',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.1,
    });
  }

  // --- BOTTOM SECTION (PEMBERITAAN) ---
  const bottom = trData.bottomChart || {};
  trSlide.addText(bottom.label || 'PEMBERITAAN', {
    x: chartX,
    y: 4.6,
    w: chartW,
    h: 0.3,
    fontSize: 16,
    color: '666666',
    align: 'center',
    fontFace: 'Arial',
  });

  if (bottom.series) {
    const chartData = bottom.series.map((s: any) => ({
      name: s.name,
      labels: s.data.map((d: any) => {
        const date = new Date(d.timestamp);
        const day = date.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mon = months[date.getMonth()];
        const yr = date.getFullYear().toString().slice(-2);
        return `${day}-${mon}-${yr}`;
      }),
      values: s.data.map((d: any) => d.value),
    }));

    trSlide.addChart(pptx.charts.LINE, chartData, {
      x: chartX,
      y: 4.9,
      w: chartW,
      h: 2.1,
      chartColors: ['00BAEC', 'F37021'],
      lineDataSymbol: 'circle',
      lineDataSymbolSize: 6,
      showValue: true,
      dataLabelPosition: 't',
      dataLabelColor: '000000',
      dataLabelFontSize: 9,
      valAxisHidden: false,
      valAxisLineShow: true, // Show vertical line
      valGridLine: { style: 'none' },
      catAxisLineShow: true, // Show horizontal line
      catAxisLabelFontSize: 9,
      catAxisLabelRotate: -45,
      catAxisCrossingPos: 'autoZero', // Try to start axis from zero
      valAxisCrossingPos: 'autoZero',
      showLegend: true,
      legendPos: 'b',
    });
  }

  // Summary Bottom
  if (bottom.summary) {
    const bulletPoints = bottom.summary.map((s: string) => ({
      text: s,
      options: { bullet: true, fontSize: 10, color: '1A1A1A' },
    }));
    trSlide.addText(bulletPoints, {
      x: summaryX,
      y: 5.5,
      w: summaryW,
      h: 1.5,
      valign: 'top',
      align: 'justify',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.1,
    });
  }

  // Footer Note
  if (trData.footerNote) {
    trSlide.addText(trData.footerNote, {
      x: 0.6,
      y: 7.2,
      w: 12.13,
      h: 0.3,
      fontSize: 9,
      color: '888888',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
