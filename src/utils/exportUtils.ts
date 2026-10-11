import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface SaveOptions {
  preferFolderPicker?: boolean;
}

export interface ExportResult {
  success: boolean;
  method?: 'picker' | 'share' | 'download' | 'preview';
  cancelled?: boolean;
  error?: string;
  blob?: Blob;
}

/**
 * Checks if the browser natively supports the File System Access API (showSaveFilePicker).
 * This allows users on desktop and supported mobile browsers to pick any memory folder
 * (Downloads, Documents, Phone Memory, SD card) to save the file.
 */
export function checkFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
}

/**
 * Checks if the browser supports sharing files via Web Share API.
 * On mobile devices, this allows saving directly to device storage via Files app / Drive / etc.
 */
export function checkShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * Waits for web fonts to load with a safe timeout so offline usage never hangs.
 */
async function waitForFontsReady(timeoutMs: number = 800): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  } catch {
    // Continue even if fonts take too long or offline
  }
}

/**
 * Renders an A4 cover page element to a crisp HTML5 Canvas.
 */
export async function renderElementToCanvas(elementId: string): Promise<HTMLCanvasElement> {
  let element = document.getElementById(elementId);

  // Fallback to preview element if export target is missing
  if (!element) {
    element = document.getElementById('a4-cover-page-preview');
  }

  if (!element) {
    throw new Error(`Target cover page element '${elementId}' not found.`);
  }

  // Ensure fonts are loaded (or timeout gracefully if offline)
  await waitForFontsReady(800);

  // High DPI rendering for crisp typography, emblems, and borders
  const canvas = await html2canvas(element, {
    scale: 2.5,
    useCORS: true,
    allowTaint: false, // Must be false so toDataURL/toBlob won't throw security errors
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth || 794,
    windowHeight: element.scrollHeight || 1123,
    onclone: (_clonedDoc, clonedElement) => {
      // Make sure the cloned target and parents are fully visible and unscaled
      if (clonedElement.parentElement) {
        clonedElement.parentElement.style.opacity = '1';
        clonedElement.parentElement.style.position = 'static';
        clonedElement.parentElement.style.transform = 'none';
        clonedElement.parentElement.style.margin = '0';
        clonedElement.parentElement.style.visibility = 'visible';
      }
      clonedElement.style.opacity = '1';
      clonedElement.style.transform = 'none';
      clonedElement.style.margin = '0';
      clonedElement.style.position = 'static';
      clonedElement.style.visibility = 'visible';

      // Remove any interactive selection borders or click helpers in the clone
      const interactiveEls = clonedElement.querySelectorAll('.ring-2, .ring-offset-2, .cursor-pointer');
      interactiveEls.forEach((el) => {
        el.classList.remove('ring-2', 'ring-offset-2', 'ring-emerald-500', 'cursor-pointer');
      });
    },
  });

  return canvas;
}

/**
 * Generates an A4 PDF Blob from the cover page.
 */
export async function generateCoverPagePDFBlob(elementId: string): Promise<Blob> {
  const canvas = await renderElementToCanvas(elementId);
  const imgData = canvas.toDataURL('image/png', 1.0);

  // Standard A4 dimensions in mm: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  return pdf.output('blob');
}

/**
 * Generates a high-resolution PNG Blob from the cover page.
 */
export async function generateCoverPagePNGBlob(elementId: string): Promise<Blob> {
  const canvas = await renderElementToCanvas(elementId);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        // Fallback using dataURL
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const byteString = atob(dataUrl.split(',')[1]);
          const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          resolve(new Blob([ab], { type: mimeString }));
        } catch (e) {
          reject(e);
        }
      }
    }, 'image/png');
  });
}

/**
 * Saves a Blob directly into the user's device memory folder using:
 * 1. File System Access API (showSaveFilePicker) if requested or available -> Choose memory folder
 * 2. Web Share API if on mobile device -> Save to Files app / Device Storage
 * 3. Standard Blob Object URL download -> Downloads folder
 * 4. Fallback to direct tab preview if download is sandboxed
 */
export async function saveBlobToDevice(
  blob: Blob,
  fileName: string,
  mimeType: string,
  options: SaveOptions = {}
): Promise<ExportResult> {
  // Strategy 1: User explicitly wants to pick a device memory folder, or picker is supported
  if (options.preferFolderPicker && checkFileSystemAccessSupported()) {
    try {
      const ext = fileName.split('.').pop() || (mimeType.includes('pdf') ? 'pdf' : 'png');
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: ext.toUpperCase() === 'PDF' ? 'PDF Document' : 'PNG Image',
            accept: { [mimeType]: [`.${ext}`] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return { success: true, method: 'picker', blob };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User voluntarily cancelled the folder picker
        return { success: false, cancelled: true };
      }
      console.warn('Native folder picker failed or denied, trying fallback:', err);
    }
  }

  // Strategy 2: Mobile Web Share API (if requested or on mobile touch device without picker)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && checkShareSupported()) {
    try {
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: 'Northern University Bangladesh Cover Page',
        });
        return { success: true, method: 'share', blob };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      console.warn('Web Share failed, falling back to download:', err);
    }
  }

  // Strategy 3: Direct Download via Anchor Element with Object URL
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = fileName;
    link.rel = 'noopener';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch {
        // Ignore cleanup
      }
    }, 4000);

    return { success: true, method: 'download', blob };
  } catch (downloadErr) {
    console.warn('Anchor download failed, attempting data URL preview:', downloadErr);
  }

  // Strategy 4: Fallback for restrictive sandboxes (open blob in new window)
  try {
    const url = URL.createObjectURL(blob);
    const tab = window.open(url, '_blank');
    if (tab) {
      return { success: true, method: 'preview', blob };
    }
  } catch {
    // Ignore
  }

  return { success: false, error: 'Could not complete download' };
}

/**
 * Main export function for PDF with full fallback support.
 */
export async function exportElementToPDF(
  elementId: string,
  fileName: string = 'NUB_Cover_Page.pdf',
  options: SaveOptions = {}
): Promise<ExportResult> {
  try {
    const blob = await generateCoverPagePDFBlob(elementId);
    return await saveBlobToDevice(blob, fileName, 'application/pdf', options);
  } catch (error: any) {
    console.error('Failed to export PDF:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PDF',
    };
  }
}

/**
 * Main export function for PNG with full fallback support.
 */
export async function exportElementToPNG(
  elementId: string,
  fileName: string = 'NUB_Cover_Page.png',
  options: SaveOptions = {}
): Promise<ExportResult> {
  try {
    const blob = await generateCoverPagePNGBlob(elementId);
    return await saveBlobToDevice(blob, fileName, 'image/png', options);
  } catch (error: any) {
    console.error('Failed to export PNG:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate PNG image',
    };
  }
}

/**
 * Explicitly triggers the device memory folder selector (Save As dialog).
 */
export async function saveToDeviceFolder(
  elementId: string,
  fileName: string,
  format: 'pdf' | 'png' = 'pdf'
): Promise<ExportResult> {
  if (format === 'pdf') {
    return exportElementToPDF(elementId, fileName, { preferFolderPicker: true });
  } else {
    return exportElementToPNG(elementId, fileName, { preferFolderPicker: true });
  }
}

/**
 * Explicitly triggers native Mobile Sharing (Save to Device / Files / Drive / WhatsApp).
 */
export async function shareDocument(
  elementId: string,
  fileName: string,
  format: 'pdf' | 'png' = 'pdf'
): Promise<ExportResult> {
  try {
    const mimeType = format === 'pdf' ? 'application/pdf' : 'image/png';
    const blob =
      format === 'pdf'
        ? await generateCoverPagePDFBlob(elementId)
        : await generateCoverPagePNGBlob(elementId);

    const file = new File([blob], fileName, { type: mimeType });
    if (checkShareSupported() && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: fileName,
        text: 'Northern University Bangladesh Cover Page',
      });
      return { success: true, method: 'share', blob };
    }

    // Fallback if share is not available
    return await saveBlobToDevice(blob, fileName, mimeType);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { success: false, cancelled: true };
    }
    return { success: false, error: err?.message };
  }
}

/**
 * Native Browser Print (100% reliable offline on all devices, with built-in Save as PDF).
 */
export function printDocument(): void {
  window.print();
}
