export default function buildExecutiveSummary(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // EXECUTIVE SUMMARY SLIDE — 2 kolom bullet point
  // ======================================================
  const execSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

  // Judul di tengah atas
  execSlide.addText(titleSlide || 'RINGKASAN EKSEKUTIF', {
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

  // Ambil data kolom dari payload
  const execData = contents?.data?.[0]?.details?.columns || [];
  const colPositions = [
    { x: 0.4, w: 6.13 }, // Kolom kiri (Media Sosial) - Wider
    { x: 6.8, w: 6.13 }, // Kolom kanan (Media Online) - Wider
  ];

  execData.forEach((col: any, colIdx: number) => {
    const pos = colPositions[colIdx];
    if (!pos) return;

    // Bangun array text runs untuk satu kolom
    const textRuns: any[] = [];

    // Header kolom (tebal, warna gelap)
    textRuns.push({
      text: col.header || '',
      options: { bold: true, fontSize: 13, color: '0D1B2A', breakLine: true },
    });

    // Setiap item dalam kolom
    (col.items || []).forEach((item: any) => {
      // Label bold + value biasa
      textRuns.push({
        text: `\u2022 `,
        options: { bold: false, fontSize: 11, color: '444444' },
      });
      if (item.label) {
        textRuns.push({
          text: `${item.label}: `,
          options: { bold: true, fontSize: 11, color: '0D1B2A' },
        });
      }
      textRuns.push({
        text: item.value || '',
        options: { bold: false, fontSize: 11, color: '1A1A1A', breakLine: true },
      });
    });

    execSlide.addText(textRuns, {
      x: pos.x,
      y: 2.3,
      w: pos.w,
      h: 4.8,
      valign: 'top',
      fontFace: 'Arial',
      align: 'justify', // Rata kanan-kiri
      lineSpacingMultiple: 1.1, // Beri jarak sedikit biar enak dibaca
    });
  });
}
