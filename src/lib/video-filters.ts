export type VideoFilterPreset = { id:string; name:string; filter:string; };

export const videoFilterPresets:VideoFilterPreset[] = [
  {id:'natural',name:'Natural',filter:'none'},
  {id:'soft-skin',name:'Pele Suave',filter:'pele-suave'},
  {id:'studio',name:'Luz de Estúdio',filter:'luz-estudio'},
  {id:'warm',name:'Quente',filter:'quente'},
  {id:'cool',name:'Frio',filter:'frio'},
  {id:'mono',name:'P&B',filter:'pb'},
  {id:'cinema',name:'Cinema',filter:'cinema'},
];

export function filterCss(presetId:string,intensity:number){
  const t=Math.max(0,Math.min(100,intensity))/100;
  if(t===0||presetId==='natural')return 'none';
  switch(presetId){
    case 'soft-skin': return `brightness(${1+.04*t}) contrast(${1-.06*t}) saturate(${1-.04*t})`;
    case 'studio': return `brightness(${1+.12*t}) contrast(${1+.04*t}) saturate(${1+.02*t})`;
    case 'warm': return `sepia(${.16*t}) saturate(${1+.16*t}) brightness(${1+.03*t})`;
    case 'cool': return `saturate(${1-.10*t}) hue-rotate(${9*t}deg) brightness(${1+.02*t})`;
    case 'mono': return `grayscale(${t}) contrast(${1+.06*t})`;
    case 'cinema': return `contrast(${1+.12*t}) saturate(${1-.18*t}) brightness(${1-.04*t})`;
    default:return 'none';
  }
}
