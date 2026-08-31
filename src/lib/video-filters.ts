export type VideoFilterPreset = { id:string; name:string; filter:string; smart?:boolean; description?:string };

export const videoFilterPresets:VideoFilterPreset[] = [
  {id:'natural',name:'Natural',filter:'none',description:'Sem tratamento'},
  {id:'skin-smart',name:'Pele inteligente',filter:'skin-smart',smart:true,description:'Suaviza apenas regiões de pele'},
  {id:'skin-glow',name:'Pele Glow',filter:'skin-glow',smart:true,description:'Pele mais uniforme e iluminada'},
  {id:'skin-matte',name:'Pele Matte',filter:'skin-matte',smart:true,description:'Reduz brilho excessivo da pele'},
  {id:'studio',name:'Luz de Estúdio',filter:'luz-estudio'},
  {id:'warm',name:'Quente',filter:'quente'},
  {id:'cool',name:'Frio',filter:'frio'},
  {id:'mono',name:'P&B',filter:'pb'},
  {id:'cinema',name:'Cinema',filter:'cinema'},
];

export const isSmartSkinFilter=(presetId:string)=>presetId.startsWith('skin-');

export function filterCss(presetId:string,intensity:number){
  const t=Math.max(0,Math.min(100,intensity))/100;
  if(t===0||presetId==='natural'||isSmartSkinFilter(presetId))return 'none';
  switch(presetId){
    case 'studio': return `brightness(${1+.12*t}) contrast(${1+.04*t}) saturate(${1+.02*t})`;
    case 'warm': return `sepia(${.16*t}) saturate(${1+.16*t}) brightness(${1+.03*t})`;
    case 'cool': return `saturate(${1-.10*t}) hue-rotate(${9*t}deg) brightness(${1+.02*t})`;
    case 'mono': return `grayscale(${t}) contrast(${1+.06*t})`;
    case 'cinema': return `contrast(${1+.12*t}) saturate(${1-.18*t}) brightness(${1-.04*t})`;
    default:return 'none';
  }
}

export function skinMask(r:number,g:number,b:number){
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  const rgbRule=r>70&&g>35&&b>20&&(max-min)>12&&r>g&&r>b;
  const cb=128-.168736*r-.331264*g+.5*b;
  const cr=128+.5*r-.418688*g-.081312*b;
  return rgbRule&&cb>75&&cb<135&&cr>130&&cr<180;
}

export function applySkinEnhancement(data:Uint8ClampedArray,width:number,height:number,intensity:number,presetId:string){
  const t=Math.max(0,Math.min(100,intensity))/100;
  if(t<=0||!isSmartSkinFilter(presetId))return data;
  const original=new Uint8ClampedArray(data);
  const stride=width*4;
  for(let y=1;y<height-1;y++){
    for(let x=1;x<width-1;x++){
      const i=(y*width+x)*4,r=original[i],g=original[i+1],b=original[i+2];
      if(!skinMask(r,g,b))continue;
      const n=i-stride,s=i+stride,l=i-4,rr=i+4;
      const avgR=(original[n]+original[s]+original[l]+original[rr]+r*2)/6;
      const avgG=(original[n+1]+original[s+1]+original[l+1]+original[rr+1]+g*2)/6;
      const avgB=(original[n+2]+original[s+2]+original[l+2]+original[rr+2]+b*2)/6;
      const smooth=.28*t;
      let nr=r*(1-smooth)+avgR*smooth,ng=g*(1-smooth)+avgG*smooth,nb=b*(1-smooth)+avgB*smooth;
      if(presetId==='skin-glow'){nr+=10*t;ng+=8*t;nb+=6*t}
      if(presetId==='skin-matte'){const lum=(nr+ng+nb)/3;if(lum>175){const cut=(lum-175)*.18*t;nr-=cut;ng-=cut;nb-=cut}}
      if(presetId==='skin-smart'){nr+=4*t;ng+=3*t;nb+=2*t}
      data[i]=Math.max(0,Math.min(255,nr));data[i+1]=Math.max(0,Math.min(255,ng));data[i+2]=Math.max(0,Math.min(255,nb));
    }
  }
  return data;
}
