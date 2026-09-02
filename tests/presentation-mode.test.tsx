import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PresentationMode } from '../src/features/meeting/presentation-mode';

// Keep the explicit React import above: Vercel's Vitest JSX transform requires it in this test file.
const slides = [
  { id: '1', name: 'Slide 1', kind: 'image' as const, src: 'data:image/png;base64,AA==', sourceName: 'one.png' },
  { id: '2', name: 'Slide 2', kind: 'image' as const, src: 'data:image/png;base64,BB==', sourceName: 'two.png' },
];

const participants = [
  { id: 'u1', displayName: 'Ana', avatarUrl: null },
  { id: 'u2', displayName: 'Bruno', avatarUrl: null },
];

afterEach(cleanup);

describe('PresentationMode', () => {
  it('keeps thumbnail selection private until explicit approval', () => {
    render(<PresentationMode open roomSlug="test-room" onClose={() => {}} participants={participants} initialSlides={slides} />);
    fireEvent.click(screen.getByRole('button', { name: /Slide 1/i }));
    expect(screen.getByText('Só você está vendo')).toBeInTheDocument();
    expect(screen.queryByText('AO VIVO')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Apresentar este slide' }));
    expect(screen.getByText('AO VIVO')).toBeInTheDocument();
  });

  it('toggles participants and stops presentation', () => {
    render(<PresentationMode open roomSlug="test-room" onClose={() => {}} participants={participants} initialSlides={slides} />);
    fireEvent.click(screen.getByRole('button', { name: /Slide 1/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Apresentar este slide' }));
    expect(screen.getByText('Ana')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar participantes' }));
    expect(screen.queryByText('Ana')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Parar apresentação' }));
    expect(screen.queryByText('AO VIVO')).not.toBeInTheDocument();
    expect(screen.getByText('Slides da reunião')).toBeInTheDocument();
  });
});
