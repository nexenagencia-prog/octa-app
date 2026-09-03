import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MeetingPrejoin } from '@/features/meeting/meeting-prejoin';

const makeStream=()=>({
  getVideoTracks:()=>[{enabled:true,stop:vi.fn()}],
  getAudioTracks:()=>[{enabled:true,stop:vi.fn()}],
  getTracks:()=>[{enabled:true,stop:vi.fn()},{enabled:true,stop:vi.fn()}],
}) as unknown as MediaStream;

describe('meeting prejoin entry choices',()=>{
 beforeEach(()=>{
  Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:vi.fn().mockResolvedValue(makeStream())}});
  Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:vi.fn().mockResolvedValue(undefined)});
  Object.defineProperty(URL,'createObjectURL',{configurable:true,value:vi.fn(()=> 'blob:meeting-photo')});
 });

 it('offers explicit camera and no-camera entry choices',async()=>{
  const onCameraChange=vi.fn();const onJoin=vi.fn();
  render(<MeetingPrejoin title="Teste" cameraEnabled micEnabled photoUrl={null} fallbackPhotoUrl={null} onCameraChange={onCameraChange} onMicChange={vi.fn()} onPhotoChange={vi.fn()} onJoin={onJoin}/>);
  expect(await screen.findByRole('button',{name:/Entrar com câmera/i})).toBeInTheDocument();
  expect(screen.getByRole('button',{name:/Entrar sem câmera/i})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Entrar sem câmera/i}));
  expect(onCameraChange).toHaveBeenLastCalledWith(false);expect(onJoin).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole('button',{name:/Entrar com câmera/i}));
  expect(onCameraChange).toHaveBeenLastCalledWith(true);expect(onJoin).toHaveBeenCalledTimes(2);
 });

 it('lets the user explicitly test the camera before entering',async()=>{
  const onCameraChange=vi.fn();
  render(<MeetingPrejoin title="Teste" cameraEnabled={false} micEnabled photoUrl={null} fallbackPhotoUrl={null} onCameraChange={onCameraChange} onMicChange={vi.fn()} onPhotoChange={vi.fn()} onJoin={vi.fn()}/>);
  fireEvent.click(screen.getByRole('button',{name:/Testar câmera/i}));
  await waitFor(()=>expect(onCameraChange).toHaveBeenCalledWith(true));
  expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
 });

 it('shows an editable photo action for the user',async()=>{
  render(<MeetingPrejoin title="Teste" cameraEnabled={false} micEnabled photoUrl="blob:existing" fallbackPhotoUrl={null} onCameraChange={vi.fn()} onMicChange={vi.fn()} onPhotoChange={vi.fn()} onJoin={vi.fn()}/>);
  expect(await screen.findAllByRole('button',{name:/Alterar foto/i})).not.toHaveLength(0);
 });
});
