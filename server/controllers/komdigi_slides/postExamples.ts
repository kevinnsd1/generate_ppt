export default function buildPostExamples(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // CONTOH POSTINGAN SLIDE — 3x2 Grid Images
  // ======================================================
  const peSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const peData = contents?.data?.[0]?.details || {};

  // Judul Utama
  peSlide.addText(titleSlide || 'CONTOH POSTINGAN', {
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

  // --- GRID SECTION ---
  if (peData.images && Array.isArray(peData.images)) {
    // Definisi Grid (3 kolom, 2 baris)
    const colGap = 0.25;
    const rowGap = 0.25;
    const blockW = 2.1;
    const blockH = 2.1;
    
    // Hitung posisi tengah (slide width pptx default komdigi ~13.33)
    const maxCols = Math.min(peData.images.length, 3);
    const gridTotalWidth = (maxCols * blockW) + ((maxCols - 1) * colGap);
    const startX = (13.33 - gridTotalWidth) / 2;
    const startY = 2.4;

    peData.images.forEach((imgObj: any, index: number) => {
      if (index >= 6) return; // Hanya muat maksimal 6 (3x2)

      const col = index % 3;
      const row = Math.floor(index / 3);

      const currX = startX + col * (blockW + colGap);
      const currY = startY + row * (blockH + rowGap);

      // Draw bounding box (rounded rectangle ringan)
      peSlide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: currX,
        y: currY,
        w: blockW,
        h: blockH,
        fill: 'FFFFFF',
        line: { color: 'B3C6E7', width: 1 },
        rectRadius: 0.1,
      });

      // Draw Image (contain, diperkecil agar tidak stretch di dalam kotak)
      if (imgObj.image) {
        let imgStr = imgObj.image;
        const imgPadX = 0.35;
        const imgPadY = 0.25;
        const imgW = blockW - imgPadX * 2;
        const imgH = blockH - imgPadY * 2;
        const addImageReq: any = {
          x: currX + imgPadX,
          y: currY + imgPadY,
          w: imgW,
          h: imgH,
          sizing: { type: 'contain', w: imgW, h: imgH },
        };

        if (imgStr.startsWith('http')) {
          addImageReq.path = imgStr;
        } else {
          // Pastikan format data:image/...;base64, lengkap
          if (!imgStr.startsWith('data:')) {
            if (imgStr.startsWith('image/')) {
              imgStr = 'data:' + imgStr;
            } else {
              imgStr = 'data:image/png;base64,' + imgStr;
            }
          }
          addImageReq.data = imgStr;
        }

        peSlide.addImage(addImageReq);
      }
    });
  }

  // Footer Note
  if (peData.footerNote) {
    peSlide.addText(peData.footerNote, {
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
