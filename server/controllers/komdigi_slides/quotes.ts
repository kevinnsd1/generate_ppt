export default function buildQuotes(pptx: any, contents: any, titleSlide: string) {
  // ======================================================
  // KUTIPAN TOKOH SLIDE — Table
  // ======================================================
  const qSlide = pptx.addSlide({ masterName: 'KOMDIGI_CONTENT' });
  const qData = contents?.data?.[0]?.details || {};

  // Jika ada title khusus, bisa di atas (hanya jika dikirim dari summary atau text biasa)
  if (qData.summary) {
    qSlide.addText(qData.summary, {
      x: 0.6, y: 1.45, w: 12.13, h: 0.55,
      fontSize: 12, color: '1A1A1A', align: 'left', fontFace: 'Arial'
    });
  }

  // --- TABLE SECTION ---
  if (qData.tableData && qData.tableData.length > 0) {
    // Bangun baris header
    const tableHeader = [
      { text: 'Tokoh', options: { bold: true, color: 'FFFFFF', fill: '4472C4', align: 'center', valign: 'middle', fontSize: 11 } },
      { text: 'Kutipan', options: { bold: true, color: 'FFFFFF', fill: '4472C4', align: 'center', valign: 'middle', fontSize: 11 } },
      { text: 'Judul Berita', options: { bold: true, color: 'FFFFFF', fill: '4472C4', align: 'center', valign: 'middle', fontSize: 11 } },
      { text: 'Tautan', options: { bold: true, color: 'FFFFFF', fill: '4472C4', align: 'center', valign: 'middle', fontSize: 11 } }
    ];

    const tableRows = [tableHeader];

    qData.tableData.forEach((row: any) => {
      // Baris Tokoh
      const tokohText = [];
      if (row.tokohInfo) {
        tokohText.push({ text: row.tokohInfo + '\n', options: { bold: true, fontSize: 10, color: '1A1A1A' } });
      }
      if (row.tokohJabatan) {
        tokohText.push({ text: `(${row.tokohJabatan})`, options: { bold: false, fontSize: 9, color: '555555' } });
      }

      // Baris Kutipan
      const kutipanText: any[] = [{ text: row.kutipan ? `"${row.kutipan}"\n` : '', options: { bold: false, fontSize: 10, color: '1A1A1A', italic: true } }];
      if (row.kutipanAuthor) {
         kutipanText.push({ text: `- ${row.kutipanAuthor}`, options: { bold: false, fontSize: 9, color: '4472C4' } });
      }

      const cellOptions: any = { align: 'center', valign: 'middle', border: { pt: 1, color: 'D9D9D9' } };

      tableRows.push([
        { text: tokohText as any, options: cellOptions },
        { text: kutipanText as any, options: cellOptions },
        { text: row.judulBerita || '', options: { ...cellOptions, fontSize: 10, color: '1A1A1A' } },
        { 
           text: row.tautan ? [{ text: 'Link', options: { hyperlink: { url: row.tautan } } }] : '', 
           options: { ...cellOptions, fontSize: 10, color: '0000FF' } 
        }
      ]);
    });

    qSlide.addTable(tableRows, {
      x: 0.6, y: 2.1, w: 12.13,
      colW: [2.5, 5.63, 2.8, 1.2], // Total lebar 12.13
      rowH: 0.4,
      fontFace: 'Arial'
    });
  }

  // Footer Note
  if (qData.footerNote) {
    qSlide.addText(qData.footerNote, {
      x: 0, y: 7.2, w: 13.33, h: 0.3,
      fontSize: 9, color: '888888', align: 'center', fontFace: 'Arial'
    });
  }
}
