export default function buildClosing(pptx: any, contents: any, titleSlide: string) {
  const cSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });

  cSlide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.6,
    y: 3.5,
    w: 12.13,
    h: 3.0,
    fill: 'E0F7FA',
    line: { type: 'none' },
  });

  cSlide.addShape(pptx.shapes.RECTANGLE, {
    x: 10.7,
    y: 3.3,
    w: 2.0,
    h: 0.6,
    fill: 'B2EBF2',
    line: { type: 'none' },
  });

  cSlide.addText('TERIMA KASIH', {
    x: 1.0,
    y: 4.5,
    w: 8.0,
    h: 1.0,
    fontSize: 48,
    bold: true,
    color: '1A1A1A',
    fontFace: 'Arial',
    valign: 'middle',
    align: 'left',
  });
}
