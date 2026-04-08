export default function buildSocialMediaDetail(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // SOCIAL MEDIA DETAIL SLIDE — Pie Chart + Summary
  // ======================================================
  const smSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const smData = contents?.data?.[0]?.details || {};

  // Judul Utama (Centered)
  smSlide.addText(titleSlide || 'RINCIAN MEDIA SOSIAL', {
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

  // --- SUMMARY TEXT (Top) ---
  if (smData.summary) {
    smSlide.addText(smData.summary, {
      x: 1.25,
      y: 2.1,
      w: 10.5,
      h: 1.0,
      fontSize: 14,
      color: '1A1A1A',
      align: 'center',
      valign: 'top',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.1,
    });
  }

  // --- PIE CHART SECTION ---
  if (smData.chartData) {
    // Standard Platform Colors
    const colorMap: any = {
      instagram: '833AB4', // Purple
      twitter: '1DA1F2', // Light Blue
      tiktok: '000000', // Black
      youtube: 'FF0000', // Red
      facebook: '1877F2', // Blue
    };

    const chartData = [
      {
        name: 'Platform Distribution',
        labels: smData.chartData.map((c: any) => {
          // Capitalize first letter for legend
          return c.name.charAt(0).toUpperCase() + c.name.slice(1);
        }),
        values: smData.chartData.map((c: any) => c.value),
      },
    ];

    const chartColors = smData.chartData.map((c: any) => colorMap[c.name.toLowerCase()] || 'CCCCCC');

    smSlide.addChart(pptx.charts.DOUGHNUT, chartData, {
      x: 3.66,
      y: 3.1,
      w: 6.0,
      h: 3.0, // Reduced height to avoid footer
      holeSize: 50,
      chartColors: chartColors,
      showValue: true,
      showPercent: true,
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 10,
      dataLabelFontBold: true,
      dataLabelPosition: 'outEnd',
      showLegend: true,
      legendPos: 'r',
      legendFontSize: 11,
    });
  }

  // --- TOTAL LABEL (Inside Donut Hole) ---
  if (smData.totalLabel) {
    const rawText = smData.totalLabel.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    smSlide.addText(rawText, {
      x: 5.16,
      y: 4.4,
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

  // Footer Note (Exactly Centered with smaller gap)
  if (smData.footerNote) {
    smSlide.addText(smData.footerNote, {
      x: 0,
      y: 6.75,
      w: 13.33,
      h: 0.3, // Full width to ensure perfect centering
      fontSize: 9,
      color: '888888',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
