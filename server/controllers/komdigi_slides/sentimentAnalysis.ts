export default function buildSentimentAnalysis(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // SENTIMENT ANALYSIS SLIDE — Doughnut + Stacked Bar (REFINED)
  // ======================================================
  const sentSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const sentData = contents?.data?.[0]?.details || {};

  // Judul Utama
  sentSlide.addText(titleSlide || 'ANALISIS SENTIMEN', {
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
  if (sentData.summary) {
    sentSlide.addText(sentData.summary, {
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

  // --- DOUGHNUT CHART (LEFT) ---
  sentSlide.addText('Media Sosial', {
    x: 1.1,
    y: 3.4,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    align: 'center',
    fontFace: 'Arial',
  });

  if (sentData.overall) {
    const doughnutData = [
      {
        name: 'Overall Sentiment',
        labels: sentData.overall.data.map((d: any) => d.name),
        values: sentData.overall.data.map((d: any) => d.value),
      },
    ];
    const doughnutColors = sentData.overall.data.map((d: any) => {
      const name = d.name.toLowerCase();
      if (name.includes('pos')) return '00B050'; // Green
      if (name.includes('neg')) return 'FF0000'; // Red
      return '00BAEC'; // Neutral Blue
    });

    sentSlide.addChart(pptx.charts.DOUGHNUT, doughnutData, {
      x: 1.1,
      y: 3.8,
      w: 5.0,
      h: 3.0,
      chartColors: doughnutColors,
      holeSize: 50,
      showValue: true,
      showPercent: true,
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 11,
      showLegend: true,
      legendPos: 'b',
      legendFontSize: 9,
    });

    // Overlay Total Text in Middle (Single Line, Size 7)
    if (sentData.overall.totalLabel) {
      const rawText = sentData.overall.totalLabel.replace(/\n/g, ': ').replace(/\s+/g, ' ').trim();
      sentSlide.addText(rawText, {
        x: 2.1,
        y: 5.15,
        w: 3.0,
        h: 0.4,
        fontSize: 7,
        bold: true,
        color: '1A1A1A',
        align: 'center',
        valign: 'middle',
        fontFace: 'Arial',
      });
    }
  }

  // --- STACKED BAR CHART (RIGHT) ---
  sentSlide.addText('Sentimen %', {
    x: 6.7,
    y: 3.4,
    w: 5.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    align: 'left',
    fontFace: 'Arial',
  });

  if (sentData.platforms) {
    const labels = sentData.platforms.map(() => '');
    const posValues = sentData.platforms.map((p: any) => p.pos);
    const negValues = sentData.platforms.map((p: any) => p.neg);
    const neuValues = sentData.platforms.map((p: any) => p.neu);

    const barSeries = [
      { name: 'Positif', labels: labels, values: posValues },
      { name: 'Negatif', labels: labels, values: negValues },
      { name: 'Netral', labels: labels, values: neuValues },
    ];

    sentSlide.addChart(pptx.charts.BAR, barSeries, {
      x: 7.2,
      y: 3.8,
      w: 5.5,
      h: 3.2,
      barDir: 'bar',
      barGrouping: 'stacked',
      barGap: 30, // Thicker bars
      chartColors: ['00B050', 'FF0000', 'A6A6A6'],
      showValue: true,
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 9,
      dataLabelFontBold: true,
      valAxisHidden: true,
      catAxisHidden: true, // Hide axis to align icons perfectly
      showLegend: true,
      legendPos: 't',
      legendFontSize: 9,
    });

    // Add Platform Icons (Finetuned alignment)
    const iconPaths: any = {
      facebook: 'https://cdn-icons-png.flaticon.com/512/124/124010.png',
      twitter: 'https://cdn-icons-png.flaticon.com/512/733/733579.png',
      youtube: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
      tiktok: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png',
      instagram: 'https://cdn-icons-png.flaticon.com/512/174/174855.png',
    };

    sentData.platforms.forEach((p: any, idx: number) => {
      const iconUrl = iconPaths[p.name.toLowerCase()] || '';
      if (iconUrl) {
        sentSlide.addImage({
          path: iconUrl,
          x: 6.7,
          y: 4.15 + idx * 0.53,
          w: 0.42,
          h: 0.42,
        });
      }
    });
  }

  // Footer Note
  if (sentData.footerNote) {
    sentSlide.addText(sentData.footerNote, {
      x: 0,
      y: 7.2,
      w: 13.33,
      h: 0.3,
      fontSize: 9,
      color: '1A1A1A',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
