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
    const firstSeries = hrData.series[0];
    const totalPoints = firstSeries?.data?.length || 0;

    // Chart dimensions
    const chartX = 0.6;
    const chartY = 2.1;
    const chartW = 12.13;
    const chartH = 3.5; // Slightly smaller to leave room for date row below

    // Build chart labels — only show time every 3 hours, skip 00:00 (date label will appear there manually)
    const chartData = hrData.series.map((s: any) => ({
      name: s.name,
      labels: s.data.map((d: any) => {
        const ts = d.timestamp || '';
        const date = new Date(ts);
        if (isNaN(date.getTime())) return '';

        const hour = date.getUTCHours();

        // Show time every 3 hours except midnight (00:00 position is for date label below)
        if (hour !== 0 && hour % 3 === 0) {
          return hour.toString().padStart(2, '0') + ':00';
        }
        return '';
      }),
      values: s.data.map((d: any) => d.value),
    }));

    hrSlide.addChart(pptx.charts.LINE, chartData, {
      x: chartX,
      y: chartY,
      w: chartW,
      h: chartH,
      chartColors: ['00BAEC'],
      lineDataSymbol: 'none',
      showValue: false,
      valAxisHidden: false,
      valAxisLineShow: true,
      valGridLine: { style: 'none' },
      catAxisLineShow: true,
      catAxisLabelFontSize: 7,
      catAxisLabelRotate: 0,
      catAxisCrossingPos: 'autoZero',
      valAxisCrossingPos: 'autoZero',
      showLegend: false,
    });

    // --- MANUAL DATE LABEL ROW (drawn below the axis, one label per day start) ---
    if (totalPoints > 0) {
      const dateRowY = chartY + chartH + 0.04; // Tight below the axis tick labels

      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      firstSeries.data.forEach((d: any, idx: number) => {
        const ts = d.timestamp || '';
        const date = new Date(ts);
        if (isNaN(date.getTime())) return;
        if (date.getUTCHours() !== 0) return; // Only at start of each day

        const day = date.getUTCDate();
        const mon = months[date.getUTCMonth()];
        const label = `${day}-${mon}`;

        // x position: proportional along chart width
        const fraction = totalPoints > 1 ? idx / (totalPoints - 1) : 0;
        const labelX = chartX + fraction * chartW - 0.22;

        hrSlide.addText(label, {
          x: labelX,
          y: dateRowY,
          w: 0.55,
          h: 0.22,
          fontSize: 7,
          bold: true,
          color: '444444',
          align: 'center',
          fontFace: 'Arial',
        });
      });
    }
  }

  // --- SUMMARY SECTION (Bottom) ---
  if (hrData.summary) {
    const bulletPoints = hrData.summary.map((s: string) => ({
      text: s,
      options: { bullet: true, fontSize: 11, color: '1A1A1A' },
    }));
    hrSlide.addText(bulletPoints, {
      x: 0.6,
      y: 6.25,
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
