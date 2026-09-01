export type PresentationSlide = {
  id: string;
  name: string;
  kind: 'image' | 'pdf-page';
  src: string;
  sourceName: string;
  pageNumber?: number;
};

const SUPPORTED_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export function isSupportedPresentationFile(file: File) {
  return SUPPORTED_TYPES.has(file.type);
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

async function renderPdfPages(file: File): Promise<PresentationSlide[]> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
  }
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const slides: PresentationSlide[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.45 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Seu navegador não conseguiu preparar a página do PDF');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;
    slides.push({
      id: `${file.name}-${pageNumber}-${crypto.randomUUID()}`,
      name: `${file.name} · página ${pageNumber}`,
      kind: 'pdf-page',
      src: canvas.toDataURL('image/jpeg', 0.92),
      sourceName: file.name,
      pageNumber,
    });
  }
  return slides;
}

export async function loadPresentationFiles(files: File[] | FileList): Promise<PresentationSlide[]> {
  const list = Array.from(files);
  const unsupported = list.find((file) => !isSupportedPresentationFile(file));
  if (unsupported) throw new Error(`Formato não suportado: ${unsupported.name}`);

  const result: PresentationSlide[] = [];
  for (const file of list) {
    if (file.type === 'application/pdf') {
      result.push(...(await renderPdfPages(file)));
      continue;
    }
    result.push({
      id: `${file.name}-${crypto.randomUUID()}`,
      name: file.name,
      kind: 'image',
      src: await readAsDataUrl(file),
      sourceName: file.name,
    });
  }
  return result;
}
