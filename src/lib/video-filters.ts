export type VideoFilterPreset = { id:string; name:string; description:string; filter:string; };

export const videoFilterPresets:VideoFilterPreset[] = [
  {id:'auto-face',name:'Auto Face',description:'Equilibra pele, luz e câmera com acabamento natural',filter:'auto-face'},
  {id:'natural-pro',name:'Natural Pro',description:'Suaviza textura sem apagar os detalhes do rosto',filter:'natural-pro'},
  {id:'studio-light',name:'Studio Light',description:'Ilumina o rosto com contraste suave de estúdio',filter:'studio-light'},
  {id:'skin-balance',name:'Skin Balance',description:'Reduz visualmente vermelhidão, brilho e sombras leves',filter:'skin-balance'},
  {id:'executive',name:'Executive',description:'Acabamento limpo, definido e profissional',filter:'executive'},
  {id:'low-light-rescue',name:'Low Light Rescue',description:'Recupera luminosidade e suavidade em ambientes escuros',filter:'low-light-rescue'},
  {id:'camera-clean',name:'Camera Clean',description:'Reduz ruído aparente e melhora a leitura da imagem',filter:'camera-clean'},
  {id:'soft-focus',name:'Soft Focus',description:'Suavização discreta com aparência cinematográfica natural',filter:'soft-focus'},
];

const clamp=(value:number,min:number,max:number)=>Math.max(min,Math.min(max,value));
export function filterCss(presetId:string,intensity:number){
  const t=clamp(intensity,0,100)/100;
  if(t===0)return 'none';
  const id=presetId==='natural'?'auto-face':presetId;
  switch(id){
    case 'auto-face': return `brightness(${1+.055*t}) contrast(${1-.025*t}) saturate(${1-.018*t}) blur(${.16*t}px)`;
    case 'natural-pro': return `brightness(${1+.035*t}) contrast(${1-.055*t}) saturate(${1-.025*t}) blur(${.34*t}px)`;
    case 'studio-light': return `brightness(${1+.105*t}) contrast(${1+.018*t}) saturate(${1+.018*t}) blur(${.12*t}px)`;
    case 'skin-balance': return `brightness(${1+.048*t}) contrast(${1-.045*t}) saturate(${1-.07*t}) sepia(${.025*t}) blur(${.27*t}px)`;
    case 'executive': return `brightness(${1+.045*t}) contrast(${1+.025*t}) saturate(${1-.025*t}) blur(${.16*t}px)`;
    case 'low-light-rescue': return `brightness(${1+.18*t}) contrast(${1-.07*t}) saturate(${1-.035*t}) blur(${.22*t}px)`;
    case 'camera-clean': return `brightness(${1+.025*t}) contrast(${1+.045*t}) saturate(${1-.018*t}) blur(${.1*t}px)`;
    case 'soft-focus': return `brightness(${1+.045*t}) contrast(${1-.07*t}) saturate(${1-.035*t}) blur(${.5*t}px)`;
    default:return 'none';
  }
}
