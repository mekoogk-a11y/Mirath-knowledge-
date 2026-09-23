import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface GeneratePdfOptions {
  fileName?: string;
  onProgress?: (stage: string) => void;
}

/**
 * Generates and downloads a high-fidelity PDF from an HTML element using html2canvas & jsPDF.
 * Optimized for Arabic typography and multi-page documents.
 */
export async function generateInheritancePdf(
  element: HTMLElement,
  options: GeneratePdfOptions = {}
): Promise<void> {
  const fileName = options.fileName || `وثيقة_توزيع_الميراث_الشرعي_${new Date().toISOString().slice(0, 10)}.pdf`;

  if (options.onProgress) options.onProgress('جاري إعداد وتنسيق الوثيقة...');

  // Ensure fonts are loaded
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Create canvas from the element with high DPI (scale: 2)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  if (options.onProgress) options.onProgress('جاري تحويل الوثيقة إلى ملف PDF...');

  const imgData = canvas.toDataURL('image/jpeg', 0.95);

  // A4 dimensions in mm
  const pdfWidth = 210;
  const pageHeight = 297;
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  const pdf = new jsPDF('p', 'mm', 'a4');

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  // Subsequent pages if document height exceeds single A4
  while (heightLeft > 5) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  if (options.onProgress) options.onProgress('اكتمل التوليد، جاري التحميل...');
  pdf.save(fileName);
}
