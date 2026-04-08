export default function buildHourlyTrendChart(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // HOURLY TREND CHART SLIDE — Wide chart + Bottom summary
  // ======================================================
  const hrSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const hrData = contents?.data?.[0]?.details || {};

  // Judul Utama (Centered)
  hrSlide.addText(titleSlide || 'TREN PERCAKAPAN PER JAM DI MEDIA SOSIAL', {
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

  // --- CHART SECTION (Wide) ---
  if (hrData.series) {
    const chartData = hrData.series.map((s: any) => ({
      name: s.name,
      labels: s.data.map((d: any) => {
        const ts = d.timestamp || '';
        const date = new Date(ts);
        
        // Always calculate hour for the filter
        let hour = -1;
        if (!isNaN(date.getTime())) {
          hour = date.getHours();
        } else if (ts.includes(':')) {
          hour = parseInt(ts.split(':')[0]);
        }

        // Only show label for multiples of 3 (0, 3, 6, 9, 12, 15, 18, 21)
        if (hour !== -1 && hour % 3 === 0) {
          const hourStr = hour.toString().padStart(2, '0') + ':00';
          return hourStr;
        }
        
        return ''; // Empty label for non-3h intervals to keep space
      }),
      values: s.data.map((d: any) => d.value),
    }));

    hrSlide.addChart(pptx.charts.LINE, chartData, {
      x: 0.6,
      y: 2.1,
      w: 12.13,
      h: 3.8,
      chartColors: ['00BAEC'], // Single Blue for Talk
      lineDataSymbol: 'none', // Too many points for symbols
      showValue: false, // Too many points for values
      valAxisHidden: false,
      valAxisLineShow: true,
      valGridLine: { style: 'none' },
      catAxisLineShow: true,
      catAxisLabelFontSize: 8,
      catAxisLabelRotate: 0,
      catAxisCrossingPos: 'autoZero',
      valAxisCrossingPos: 'autoZero',
      showLegend: false,
    });
  }

  // --- SUMMARY SECTION (Bottom) ---
  if (hrData.summary) {
    const bulletPoints = hrData.summary.map((s: string) => ({
      text: s,
      options: { bullet: true, fontSize: 11, color: '1A1A1A' },
    }));
    hrSlide.addText(bulletPoints, {
      x: 0.6,
      y: 6.1,
      w: 12.13,
      h: 1.0,
      valign: 'top',
      align: 'justify',
      fontFace: 'Arial',
      lineSpacingMultiple: 1.1,
    });
  }

  // Footer Note
  if (hrData.footerNote) {
    hrSlide.addText(hrData.footerNote, {
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
