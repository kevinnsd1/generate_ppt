export default function buildSentimentMediaOnline(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // SENTIMENT MEDIA ONLINE SLIDE — Single Centered Doughnut
  // ======================================================
  const sentOnlineSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const data = contents?.data?.[0]?.details || {};

  // Judul Utama
  sentOnlineSlide.addText(titleSlide || 'ANALISIS SENTIMEN', {
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

  // Ringkasan Teks
  if (data.summary) {
    sentOnlineSlide.addText(data.summary, {
      x: 0.6,
      y: 2.05,
      w: 12.13,
      h: 1.25,
      fontSize: 11,
      color: '1A1A1A',
      align: 'justify',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.1,
    });
  }

  // --- CENTERED DOUGHNUT CHART ---
  // Slide width is 13.33. Chart width: 6.0. Center x: 3.66.
  if (data.chartTitle) {
    sentOnlineSlide.addText(data.chartTitle, {
      x: 3.66,
      y: 3.4,
      w: 6.0,
      h: 0.4,
      fontSize: 16,
      bold: true,
      align: 'center',
      fontFace: 'Arial',
    });
  }

  if (data.chartData) {
    const doughnutData = [
      {
        name: 'Media Online Sentiment',
        labels: data.chartData.data.map((d: any) => d.name),
        values: data.chartData.data.map((d: any) => d.value),
      },
    ];
    const doughnutColors = data.chartData.data.map((d: any) => {
      const name = d.name.toLowerCase();
      if (name.includes('pos')) return '92D050'; // Light Green
      if (name.includes('neg')) return 'FF0000'; // Red
      return '00BAEC'; // Neutral Blue
    });

    sentOnlineSlide.addChart(pptx.charts.DOUGHNUT, doughnutData, {
      x: 3.66,
      y: 3.8,
      w: 6.0,
      h: 3.2,
      chartColors: doughnutColors,
      holeSize: 50,
      showValue: true,
      showPercent: true,
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 11,
      dataLabelPosition: 'outEnd',
      showLegend: true,
      legendPos: 'b',
      legendFontSize: 9,
    });

    // Overlay Total Text in Middle (Single Line, Size 7)
    if (data.chartData.totalLabel) {
      const rawText = data.chartData.totalLabel.replace(/\n/g, ': ').replace(/\s+/g, ' ').trim();
      sentOnlineSlide.addText(rawText, {
        // Center of chart is 3.66 + 3.0 = 6.66. Width is 3.0, x = 6.66 - 1.5 = 5.16
        // Y: chart y=3.8, h=3.2, legend ~0.5in → donut center ≈ 3.8 + (3.2-0.5)/2 = 5.15
        x: 5.16,
        y: 5.0, // Moved up from 5.25 to align with donut hole center
        w: 3.0,
        h: 0.4,
        fontSize: 10,
        bold: true,
        color: '1A1A1A',
        align: 'center',
        valign: 'middle',
        fontFace: 'Arial',
      });
    }
  }

  // Footer Note
  if (data.footerNote) {
    sentOnlineSlide.addText(data.footerNote, {
      x: 0,
      y: 7.2,
      w: 13.33,
      h: 0.3,
      fontSize: 9,
      color: '888888',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
