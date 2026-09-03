export type MeetingMediaState = { cameraEnabled: boolean; micEnabled: boolean };

export function createMeetingMediaConstraints(): MediaStreamConstraints {
  return {
    video: {
      facingMode: 'user',
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      aspectRatio: { ideal: 16 / 9 },
      frameRate: { ideal: 30, max: 60 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };
}

export function applyMeetingMediaState(stream: MediaStream, state: MeetingMediaState) {
  for (const track of stream.getVideoTracks()) track.enabled = state.cameraEnabled;
  for (const track of stream.getAudioTracks()) track.enabled = state.micEnabled;
}

export function stopMeetingMedia(stream?: MediaStream | null) {
  stream?.getTracks().forEach(track => track.stop());
}

export function meetingMediaErrorMessage(error: unknown) {
  const name = error instanceof DOMException ? error.name : error && typeof error === 'object' && 'name' in error ? String((error as {name?:unknown}).name) : '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'Permita o acesso à câmera e ao microfone no navegador para usar a reunião.';
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') return 'Nenhuma câmera ou microfone compatível foi encontrado neste dispositivo.';
  if (name === 'NotReadableError' || name === 'TrackStartError') return 'A câmera ou o microfone está sendo usado por outro aplicativo. Feche-o e tente novamente.';
  return 'Não foi possível iniciar câmera e microfone. Verifique as permissões e tente novamente.';
}
