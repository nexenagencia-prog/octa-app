import { describe, expect, it, vi } from 'vitest';
import { applyMeetingMediaState, createMeetingMediaConstraints, meetingMediaErrorMessage, stopMeetingMedia } from '@/lib/meeting-media';

describe('meeting media',()=>{
 it('keeps native capture horizontal and lets the UI crop it to 9:16',()=>{const constraints=createMeetingMediaConstraints();const video=constraints.video as MediaTrackConstraints;expect((video.width as ConstrainULongRange).ideal).toBe(1920);expect((video.height as ConstrainULongRange).ideal).toBe(1080);expect((video.aspectRatio as ConstrainDoubleRange).ideal).toBe(16/9)});
 it('applies microphone and camera choices to real tracks',()=>{const video={enabled:true};const audio={enabled:true};const stream={getVideoTracks:()=>[video],getAudioTracks:()=>[audio]} as unknown as MediaStream;applyMeetingMediaState(stream,{cameraEnabled:false,micEnabled:false});expect(video.enabled).toBe(false);expect(audio.enabled).toBe(false)});
 it('stops media tracks during cleanup',()=>{const stop=vi.fn();const stream={getTracks:()=>[{stop},{stop}]} as unknown as MediaStream;stopMeetingMedia(stream);expect(stop).toHaveBeenCalledTimes(2)});
 it('explains denied permissions',()=>expect(meetingMediaErrorMessage({name:'NotAllowedError'})).toContain('Permita o acesso'));
});
