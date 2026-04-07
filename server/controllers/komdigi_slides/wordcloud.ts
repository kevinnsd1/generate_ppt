export default function buildWordcloud(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // WORDCLOUD SLIDE — 2 Columns (Text + Image)
  // ======================================================
  const wcSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const wcData = contents?.data?.[0]?.details || {};

  // Judul Utama
  wcSlide.addText(titleSlide || 'WORDCLOUD', {
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

  // --- LEFT COLUMN (Media Online) ---
  if (wcData.left) {
    if (wcData.left.summary) {
      wcSlide.addText(wcData.left.summary, {
        x: 0.6,
        y: 2.1,
        w: 5.8,
        h: 1.8,
        fontSize: 11,
        color: '1A1A1A',
        align: 'justify',
        valign: 'top',
        fontFace: 'Arial',
        lineSpacingMultiple: 1.1,
      });
    }
    if (wcData.left.title) {
      wcSlide.addText(wcData.left.title, {
        x: 0.6,
        y: 4.1,
        w: 5.8,
        h: 0.4,
        fontSize: 18,
        bold: true,
        color: '1A1A1A',
        align: 'center',
        fontFace: 'Arial',
      });
    }
    if (wcData.left.image) {
      let addImageReq: any = {
        x: 0.6,
        y: 4.7,
        w: 5.8,
        h: 2.2,
        sizing: { type: 'contain', w: 5.8, h: 2.2 },
      };
      let imgStr = wcData.left.image;
      if (imgStr.startsWith('http')) {
        addImageReq.path = imgStr;
      } else {
        imgStr = imgStr.replace(/^data:/, '');
        if (!imgStr.startsWith('image/')) {
          imgStr = 'image/png;base64,' + imgStr;
        }
        addImageReq.data = imgStr;
      }
      wcSlide.addImage(addImageReq);
    }
  }

  // --- RIGHT COLUMN (Media Sosial) ---
  if (wcData.right) {
    if (wcData.right.summary) {
      wcSlide.addText(wcData.right.summary, {
        x: 6.9,
        y: 2.1,
        w: 5.8,
        h: 1.8,
        fontSize: 11,
        color: '1A1A1A',
        align: 'justify',
        valign: 'top',
        fontFace: 'Arial',
        lineSpacingMultiple: 1.1,
      });
    }
    if (wcData.right.title) {
      wcSlide.addText(wcData.right.title, {
        x: 6.9,
        y: 4.1,
        w: 5.8,
        h: 0.4,
        fontSize: 18,
        bold: true,
        color: '1A1A1A',
        align: 'center',
        fontFace: 'Arial',
      });
    }
    if (wcData.right.image) {
      let addImageReq: any = {
        x: 6.9,
        y: 4.7,
        w: 5.8,
        h: 2.2,
        sizing: { type: 'contain', w: 5.8, h: 2.2 },
      };
      let imgStr = wcData.right.image;
      if (imgStr.startsWith('http')) {
        addImageReq.path = imgStr;
      } else {
        imgStr = imgStr.replace(/^data:/, '');
        if (!imgStr.startsWith('image/')) {
          imgStr = 'image/png;base64,' + imgStr;
        }
        addImageReq.data = imgStr;
      }
      wcSlide.addImage(addImageReq);
    }
  }

  // Footer Note
  if (wcData.footerNote) {
    wcSlide.addText(wcData.footerNote, {
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
