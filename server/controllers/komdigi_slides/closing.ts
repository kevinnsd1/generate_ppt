export default function buildClosing(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // CLOSING SLIDE — Terima Kasih
  // ======================================================
  const cSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

  // Dekorasi Latar Belakang (Kotak Hijau Tosca Terang / Biru Muda di sepertiga bawah background)
  cSlide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6, y: 3.5, w: 12.13, h: 3.0,
    fill: 'E0F7FA', // Cyan super terang
    line: { type: 'none' }
  });

  // Dekorasi Aksen kecil di ujung kanan
  cSlide.addShape(pptx.shapes.RECTANGLE, {
    x: 10.7, y: 3.3, w: 2.0, h: 0.6,
    fill: 'B2EBF2', // Cyan sedikit lebih gelap   
    line: { type: 'none' }
  });

  // Text TERIMA KASIH diletakkan presisi ke area warna
  cSlide.addText('TERIMA KASIH', {
    x: 1.0, y: 4.5, w: 8.0, h: 1.0,
    fontSize: 48, bold: true, color: '1A1A1A',
    fontFace: 'Arial', valign: 'middle', align: 'left'
  });
}
