import { describe, expect, it } from 'vitest';
import { isSupportedPresentationFile, loadPresentationFiles } from '../src/features/meeting/presentation-model';

describe('presentation model', () => {
  it('accepts PDF, JPEG and PNG only', () => {
    expect(isSupportedPresentationFile(new File(['x'], 'deck.pdf', { type: 'application/pdf' }))).toBe(true);
    expect(isSupportedPresentationFile(new File(['x'], 'photo.jpg', { type: 'image/jpeg' }))).toBe(true);
    expect(isSupportedPresentationFile(new File(['x'], 'art.png', { type: 'image/png' }))).toBe(true);
    expect(isSupportedPresentationFile(new File(['x'], 'deck.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }))).toBe(false);
  });

  it('keeps uploaded images in order', async () => {
    const files = [
      new File(['a'], 'one.jpg', { type: 'image/jpeg' }),
      new File(['b'], 'two.png', { type: 'image/png' }),
    ];
    const slides = await loadPresentationFiles(files);
    expect(slides.map((slide) => slide.name)).toEqual(['one.jpg', 'two.png']);
    expect(slides.every((slide) => slide.kind === 'image')).toBe(true);
  });

  it('rejects unsupported files instead of publishing them', async () => {
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    await expect(loadPresentationFiles([file])).rejects.toThrow('Formato não suportado');
  });
});
