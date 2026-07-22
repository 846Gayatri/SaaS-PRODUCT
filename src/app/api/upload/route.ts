import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const text = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });
      
      return NextResponse.json({ text });
    } else {
      // Just return as text for .txt, .md, etc
      const text = buffer.toString('utf-8');
      return NextResponse.json({ text });
    }
  } catch (error: any) {
    console.error('File parsing error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
