export default function buildSocialMediaDetail(pptx: any, contents: any, titleSlide: string) {
  const smSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const smData = contents?.data?.[0]?.details || {};

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

  if (smData.summary) {
    smSlide.addText(smData.summary, {
      x: 0.6,
      y: 2.1,
      w: 12.13,
      h: 0.65,
      fontSize: 13,
      color: '1A1A1A',
      align: 'left',
      valign: 'top',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.15,
    });
  }

  if (smData.chartData) {
    const colorMap: any = {
      instagram: '833AB4',
      twitter:   '1DA1F2',
      tiktok:    '000000',
      youtube:   'FF0000',
      facebook:  '1877F2',
    };

    const chartData = [
      {
        name: 'Platform Distribution',
        labels: smData.chartData.map((c: any) =>
          c.name.charAt(0).toUpperCase() + c.name.slice(1)
        ),
        values: smData.chartData.map((c: any) => c.value),
      },
    ];

    const chartColors = smData.chartData.map(
      (c: any) => colorMap[c.name.toLowerCase()] || 'CCCCCC'
    );

    const chartX = (13.33 - 6.53) / 2;
    const chartY = 2.85;
    const chartW = 6.53;
    const chartH = 3.8;

    smSlide.addChart(pptx.charts.PIE, chartData, {
      x: chartX,
      y: chartY,
      w: chartW,
      h: chartH,
      chartColors: chartColors,
      showValue: false,
      showPercent: true,
      dataLabelColor: 'FFFFFF',
      dataLabelFontSize: 11,
      dataLabelFontBold: true,
      dataLabelPosition: 'bestFit',
      showLegend: true,
      legendPos: 'r',
      legendFontSize: 12,
    });

    if (smData.totalLabel) {
      const rawText = smData.totalLabel.replace(/\s+/g, ' ').trim();
      smSlide.addText(rawText, {
        x: chartX,
        y: chartY + chartH + 0.05,
        w: chartW,
        h: 0.42,
        fontSize: 16,
        bold: true,
        color: '1A1A1A',
        align: 'center',
        valign: 'middle',
        fontFace: 'Arial',
      });
    }
  }

  if (smData.footerNote) {
    smSlide.addText(smData.footerNote, {
      x: 0,
      y: 7.0,
      w: 13.33,
      h: 0.3,
      fontSize: 9,
      color: '888888',
      align: 'center',
      fontFace: 'Arial',
    });
  }
}
