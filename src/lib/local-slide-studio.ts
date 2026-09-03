'use client';

export const SLIDE_WIDTH = 1600;
export const SLIDE_HEIGHT = 900;

export type SlideAnimation = 'none' | 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'reveal';
export type SlideExitAnimation = 'none' | 'fade' | 'slide-down' | 'slide-right' | 'zoom-out';
export type SlideFrame = 'none' | 'rounded' | 'circle' | 'portrait' | 'landscape' | 'polaroid';
export type SlideBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export type SlideElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'gradient';
  x: number;
  y: number;
  w: number;
  h: number;
  name?: string;
  text?: string;
  assetId?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  fill?: string;
  radius?: number;
  rotation?: number;
  opacity?: number;
  frame?: SlideFrame;
  enterAnimation?: SlideAnimation;
  exitAnimation?: SlideExitAnimation;
  animationOrder?: number;
  animationDuration?: number;
  gradientFrom?: string;
  gradientTo?: string;
  gradientFromOpacity?: number;
  gradientToOpacity?: number;
  gradientAngle?: number;
  blendMode?: SlideBlendMode;
  locked?: boolean;
  hidden?: boolean;
  groupId?: string;
};

export type SlidePage = { id:string; name:string; background:string; elements:SlideElement[] };
export type SlideDeck = { id:string; title:string; createdAt:number; updatedAt:number; slides:SlidePage[] };
export type SlideAsset = { id:string; name:string; mime:string; blob:Blob };

const DB_NAME = 'octa-slide-studio';
const DB_VERSION = 1;
const DECKS = 'decks';
const ASSETS = 'assets';
const uid = () => crypto.randomUUID();

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB indisponível neste navegador'));
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onerror=()=>reject(request.error??new Error('Não foi possível abrir o armazenamento local'));
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(DECKS))db.createObjectStore(DECKS,{keyPath:'id'});
      if(!db.objectStoreNames.contains(ASSETS))db.createObjectStore(ASSETS,{keyPath:'id'});
    };
    request.onsuccess=()=>resolve(request.result);
  });
}

function req<T>(request:IDBRequest<T>):Promise<T>{
  return new Promise((resolve,reject)=>{
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('Falha no armazenamento local'));
  });
}

async function withStore<T>(store:string,mode:IDBTransactionMode,action:(objectStore:IDBObjectStore)=>IDBRequest<T>){
  const db=await openDatabase();
  try{
    const tx=db.transaction(store,mode);
    const result=await req(action(tx.objectStore(store)));
    await new Promise<void>((resolve,reject)=>{
      tx.oncomplete=()=>resolve();
      tx.onerror=()=>reject(tx.error??new Error('Falha ao concluir operação local'));
      tx.onabort=()=>reject(tx.error??new Error('Operação local cancelada'));
    });
    return result;
  }finally{db.close();}
}

function withAnimation(element:SlideElement,order:number):SlideElement{
  return {
    ...element,
    name:element.name??(element.type==='text'?'Texto':element.type==='image'?'Foto':element.type==='gradient'?'Degradê':'Figura'),
    enterAnimation:element.enterAnimation??'fade',
    exitAnimation:element.exitAnimation??'fade',
    animationOrder:element.animationOrder??order,
    animationDuration:element.animationDuration??420,
    opacity:element.opacity??1,
    fontFamily:element.fontFamily??(element.type==='text'?'Helvetica, Arial, sans-serif':undefined),
    frame:element.frame??(element.type==='image'?'rounded':undefined),
    blendMode:element.blendMode??'normal',
    locked:element.locked??false,
    hidden:element.hidden??false,
    gradientFromOpacity:element.gradientFromOpacity??(element.type==='gradient'?1:undefined),
    gradientToOpacity:element.gradientToOpacity??(element.type==='gradient'?1:undefined),
  };
}

export function createSlide(layout:'blank'|'cover'|'editorial'|'data'|'image'|'columns'='blank'):SlidePage{
  const base:SlidePage={id:uid(),name:'Novo slide',background:'#d8c1aa',elements:[]};
  let order=0;
  const text=(value:string,x:number,y:number,w:number,h:number,size:number,weight=500,color='#f7f3ee',align:SlideElement['align']='left'):SlideElement=>withAnimation({id:uid(),type:'text',text:value,x,y,w,h,fontSize:size,fontWeight:weight,color,align},++order);
  const shape=(x:number,y:number,w:number,h:number,fill:string,radius=34):SlideElement=>withAnimation({id:uid(),type:'shape',x,y,w,h,fill,radius},++order);
  if(layout==='cover')return {...base,name:'Capa',background:'#40352e',elements:[text('Sua grande ideia começa aqui.',120,210,1120,210,78,560),text('Subtítulo ou contexto da apresentação',128,455,760,80,27,390,'#d9cfc5'),shape(1260,150,180,560,'rgba(224,178,130,.28)',90)]};
  if(layout==='editorial')return {...base,name:'Editorial',background:'#c4aa91',elements:[text('Título editorial',110,110,760,160,62,560,'#221f1c'),text('Use uma frase curta para conduzir a narrativa com clareza e espaço visual.',115,310,650,220,31,410,'#403932'),shape(930,90,540,700,'rgba(42,38,34,.20)',38)]};
  if(layout==='data')return {...base,name:'Dados',background:'#2c3030',elements:[text('Performance',100,105,700,100,32,430,'#d9c5b0'),text('82%',95,220,620,220,132,600),text('Um número forte, uma explicação simples.',105,490,720,100,28,410,'#c8c5c1'),shape(1020,145,360,360,'rgba(210,160,112,.34)',180)]};
  if(layout==='image')return {...base,name:'Imagem cheia',background:'#171919',elements:[shape(70,70,1460,760,'rgba(255,255,255,.08)',44),text('Imagem principal',120,685,900,80,50,560)]};
  if(layout==='columns')return {...base,name:'Duas colunas',background:'#b99d82',elements:[text('Um tema, duas perspectivas.',90,90,1250,120,54,560,'#1f1c19'),shape(90,270,650,500,'rgba(255,255,255,.20)',34),shape(860,270,650,500,'rgba(43,38,34,.20)',34),text('Primeiro ponto',130,330,510,80,32,520,'#27231f'),text('Segundo ponto',900,330,510,80,32,520)]};
  return base;
}

export function createDeck(title='Nova apresentação'):SlideDeck{
  const now=Date.now();
  return{id:uid(),title,createdAt:now,updatedAt:now,slides:[createSlide('cover')]};
}

export async function listDecks():Promise<SlideDeck[]>{
  const result=await withStore<SlideDeck[]>(DECKS,'readonly',store=>store.getAll());
  return result.sort((a,b)=>b.updatedAt-a.updatedAt);
}

export async function getDeck(id:string):Promise<SlideDeck|null>{
  return(await withStore<SlideDeck|undefined>(DECKS,'readonly',store=>store.get(id)))??null;
}

export async function saveDeck(deck:SlideDeck):Promise<SlideDeck>{
  const next={...deck,updatedAt:Date.now()};
  await withStore<IDBValidKey>(DECKS,'readwrite',store=>store.put(next));
  return next;
}

export async function deleteDeck(id:string){
  await withStore<undefined>(DECKS,'readwrite',store=>store.delete(id));
}

export async function duplicateDeck(deck:SlideDeck):Promise<SlideDeck>{
  const now=Date.now();
  const copy:SlideDeck={...deck,id:uid(),title:`${deck.title} — cópia`,createdAt:now,updatedAt:now,slides:deck.slides.map(slide=>({...slide,id:uid(),elements:slide.elements.map(element=>({...element,id:uid()}))}))};
  return saveDeck(copy);
}

export async function saveAsset(blob:Blob,name:string):Promise<SlideAsset>{
  const asset:SlideAsset={id:uid(),name,mime:blob.type||'application/octet-stream',blob};
  await withStore<IDBValidKey>(ASSETS,'readwrite',store=>store.put(asset));
  return asset;
}

export async function getAsset(id:string):Promise<SlideAsset|null>{
  return(await withStore<SlideAsset|undefined>(ASSETS,'readonly',store=>store.get(id)))??null;
}

export async function listAssets():Promise<SlideAsset[]>{
  return withStore<SlideAsset[]>(ASSETS,'readonly',store=>store.getAll());
}

function clamp01(value:number){return Math.max(0,Math.min(1,value));}

function colorWithOpacity(color:string,opacity:number){
  if(!color.startsWith('#'))return color;
  const raw=color.slice(1);
  const full=raw.length===3?raw.split('').map(char=>char+char).join(''):raw;
  if(full.length!==6)return color;
  const value=Number.parseInt(full,16);
  if(!Number.isFinite(value))return color;
  return `rgba(${(value>>16)&255},${(value>>8)&255},${value&255},${clamp01(opacity)})`;
}

function elementRadius(element:SlideElement){
  if(element.frame==='circle')return Math.min(element.w,element.h)/2;
  if(element.frame==='none')return 0;
  if(element.frame==='polaroid')return 18;
  return element.radius??32;
}

function roundedRectPath(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,radius:number){
  const r=Math.max(0,Math.min(radius,Math.min(w,h)/2));
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

async function loadBlobImage(blob:Blob){
  const url=URL.createObjectURL(blob);
  try{
    return await new Promise<HTMLImageElement>((resolve,reject)=>{
      const image=new window.Image();
      image.decoding='async';
      image.onload=()=>resolve(image);
      image.onerror=()=>reject(new Error('Não foi possível renderizar uma imagem do slide'));
      image.src=url;
    });
  }finally{
    window.setTimeout(()=>URL.revokeObjectURL(url),0);
  }
}

function drawCoverImage(ctx:CanvasRenderingContext2D,image:HTMLImageElement,x:number,y:number,w:number,h:number){
  const sourceRatio=image.naturalWidth/image.naturalHeight;
  const targetRatio=w/h;
  let sx=0,sy=0,sw=image.naturalWidth,sh=image.naturalHeight;
  if(sourceRatio>targetRatio){
    sw=image.naturalHeight*targetRatio;
    sx=(image.naturalWidth-sw)/2;
  }else{
    sh=image.naturalWidth/targetRatio;
    sy=(image.naturalHeight-sh)/2;
  }
  ctx.drawImage(image,sx,sy,sw,sh,x,y,w,h);
}

function drawWrappedText(ctx:CanvasRenderingContext2D,text:string,width:number,height:number,fontSize:number,align:SlideElement['align']){
  const paragraphs=text.split(/\n/);
  const lineHeight=fontSize*1.08;
  const drawX=align==='center'?0:align==='right'?width/2:-width/2;
  let y=-height/2;
  for(const paragraph of paragraphs){
    const words=paragraph.split(/\s+/).filter(Boolean);
    let line='';
    if(words.length===0){y+=lineHeight;continue;}
    for(const word of words){
      const test=line?`${line} ${word}`:word;
      if(line&&ctx.measureText(test).width>width){
        ctx.fillText(line,drawX,y,width);
        y+=lineHeight;
        line=word;
        if(y>height/2)return;
      }else line=test;
    }
    if(line&&y<=height/2){
      ctx.fillText(line,drawX,y,width);
      y+=lineHeight;
    }
    if(y>height/2)return;
  }
}

async function drawSlideElement(ctx:CanvasRenderingContext2D,element:SlideElement){
  if(element.hidden)return;
  ctx.save();
  ctx.globalAlpha=clamp01(element.opacity??1);
  ctx.globalCompositeOperation=(element.blendMode&&element.blendMode!=='normal'?element.blendMode:'source-over') as GlobalCompositeOperation;
  ctx.translate(element.x+element.w/2,element.y+element.h/2);
  ctx.rotate(((element.rotation??0)*Math.PI)/180);
  const x=-element.w/2,y=-element.h/2;
  const radius=elementRadius(element);

  if(element.type==='shape'){
    roundedRectPath(ctx,x,y,element.w,element.h,radius);
    ctx.fillStyle=element.fill??'rgba(255,255,255,.15)';
    ctx.fill();
  }else if(element.type==='gradient'){
    const angle=((element.gradientAngle??135)-90)*Math.PI/180;
    const span=Math.sqrt(element.w*element.w+element.h*element.h)/2;
    const dx=Math.cos(angle)*span,dy=Math.sin(angle)*span;
    const gradient=ctx.createLinearGradient(-dx,-dy,dx,dy);
    gradient.addColorStop(0,colorWithOpacity(element.gradientFrom??'#d9aa7c',element.gradientFromOpacity??1));
    gradient.addColorStop(1,colorWithOpacity(element.gradientTo??'#27292a',element.gradientToOpacity??1));
    roundedRectPath(ctx,x,y,element.w,element.h,radius);
    ctx.fillStyle=gradient;
    ctx.fill();
  }else if(element.type==='image'&&element.assetId){
    const asset=await getAsset(element.assetId);
    if(asset){
      const image=await loadBlobImage(asset.blob);
      roundedRectPath(ctx,x,y,element.w,element.h,radius);
      ctx.clip();
      drawCoverImage(ctx,image,x,y,element.w,element.h);
    }
  }else if(element.type==='text'){
    const fontSize=element.fontSize??48;
    const align=element.align??'left';
    ctx.fillStyle=element.color??'#fff';
    ctx.font=`${element.fontWeight??500} ${fontSize}px ${element.fontFamily??'Helvetica, Arial, sans-serif'}`;
    ctx.textAlign=align;
    ctx.textBaseline='top';
    drawWrappedText(ctx,element.text??'',element.w,element.h,fontSize,align);
  }
  ctx.restore();
}

export async function renderSlideToDataUrl(slide:SlidePage,width=1920,height=1080):Promise<string>{
  if(typeof document==='undefined')throw new Error('Renderização de slides disponível somente no navegador');
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  if(!ctx)throw new Error('Seu navegador não conseguiu preparar o slide');
  ctx.fillStyle=slide.background||'#111';
  ctx.fillRect(0,0,width,height);
  ctx.save();
  ctx.scale(width/SLIDE_WIDTH,height/SLIDE_HEIGHT);
  for(const element of slide.elements){await drawSlideElement(ctx,element);}
  ctx.restore();
  return canvas.toDataURL('image/jpeg',0.94);
}
