'use client';
import { useEffect, useRef } from 'react';
import { EMPTY_CMS_DOCUMENT, CmsDocument, CmsElementOverride, getCmsBreakpoint, getCmsScopeKey, mergeCmsScope, sanitizeCmsDocument, sanitizeCmsPatch } from '@/lib/cms';

const MSG='octa:cms:';
const original = new WeakMap<HTMLElement,{text?:string;href?:string;src?:string;alt?:string;style:string;hidden:boolean}>();

function remember(el:HTMLElement){
  if(original.has(el)) return;
  const a=el as HTMLAnchorElement, m=el as HTMLImageElement;
  original.set(el,{text:el.textContent??'',href:a.href??'',src:m.src??'',alt:m.alt??'',style:el.getAttribute('style')??'',hidden:el.hidden});
}
function restore(el:HTMLElement){
  const base=original.get(el); if(!base)return;
  el.setAttribute('style',base.style); el.hidden=base.hidden;
  if(el.dataset.cmsType==='text' && base.text!==undefined && el.textContent!==base.text) el.textContent=base.text;
  if(el instanceof HTMLAnchorElement && base.href) el.setAttribute('href',base.href);
  if(el instanceof HTMLImageElement){ if(base.src) el.setAttribute('src',base.src); if(base.alt!==undefined) el.alt=base.alt; }
}
function directText(el:HTMLElement){return [...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent?.trim()) as Text|undefined}
function apply(el:HTMLElement, patch:CmsElementOverride){
  remember(el); restore(el);
  if(patch.text!==undefined){if(el.dataset.cmsType==='text'&&el.textContent!==patch.text)el.textContent=patch.text;else if((el instanceof HTMLAnchorElement||el instanceof HTMLButtonElement)){const node=directText(el);if(node&&node.textContent?.trim()!==patch.text)node.textContent=` ${patch.text} `}}
  if(patch.href!==undefined && el instanceof HTMLAnchorElement) el.setAttribute('href',patch.href);
  if(patch.src!==undefined && (el instanceof HTMLImageElement || el instanceof HTMLVideoElement)) el.setAttribute('src',patch.src);
  if(patch.alt!==undefined && el instanceof HTMLImageElement) el.alt=patch.alt;
  if(patch.poster!==undefined && el instanceof HTMLVideoElement) el.poster=patch.poster;
  if(patch.placeholder!==undefined && (el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)) el.placeholder=patch.placeholder;
  if(patch.hidden!==undefined) el.hidden=patch.hidden;
  if(patch.style) Object.assign(el.style,patch.style);
  if(patch.positionMode==='free') el.dataset.cmsPosition='free'; else delete el.dataset.cmsPosition;
}
function cmsPath(el:Element, root:Element){
  const parts:string[]=[]; let node:Element|null=el;
  while(node&&node!==root){const tag=node.tagName.toLowerCase();const siblings=node.parentElement?[...node.parentElement.children].filter(x=>x.tagName===node!.tagName):[];parts.unshift(`${tag}.${Math.max(1,siblings.indexOf(node)+1)}`);node=node.parentElement}
  return parts.join('>');
}
export function ensureCmsIds(){
  const root=document.querySelector('.octa-page')||document.querySelector('.octa-app-body')||document.body;
  const selector='main,header,aside,nav,section,article,div,h1,h2,h3,h4,h5,p,span,a,button,img,video,input,textarea,label,form';
  root.querySelectorAll<HTMLElement>(selector).forEach(el=>{
    if(el.closest('.cms-preview-selection'))return;
    if(!el.dataset.cmsId) el.dataset.cmsId=`auto:${location.pathname}:${cmsPath(el,root)}`;
    if(!el.dataset.cmsType){const tag=el.tagName.toLowerCase();el.dataset.cmsType=(tag==='img'||tag==='video')?'media':(['h1','h2','h3','h4','h5','p','span'].includes(tag)||((tag==='a'||tag==='button')&&el.children.length===0)?'text':(tag==='a'?'link':(tag==='button'?'button':'container')))}
  });
}
function scopeFor(doc:CmsDocument){
  const theme=(document.documentElement.dataset.theme==='dark'?'dark':'light') as 'light'|'dark';
  return mergeCmsScope(doc,location.pathname,theme,getCmsBreakpoint(innerWidth));
}
function applyDocument(doc:CmsDocument){
  const scope=scopeFor(doc);
  document.querySelectorAll<HTMLElement>('[data-cms-id]').forEach(el=>{
    const id=el.dataset.cmsId!; const patch=scope[id];
    if(patch) apply(el,patch); else restore(el);
  });
}
function snapshot(el:HTMLElement){
  const cs=getComputedStyle(el), rect=el.getBoundingClientRect();
  const dt=directText(el);return {id:el.dataset.cmsId,type:el.dataset.cmsType||'element',tag:el.tagName.toLowerCase(),text:el.dataset.cmsType==='media'?'':(dt?.textContent?.trim()||el.textContent||''),href:el instanceof HTMLAnchorElement?el.getAttribute('href')||'':'',src:(el instanceof HTMLImageElement||el instanceof HTMLVideoElement)?el.getAttribute('src')||'':'',alt:el instanceof HTMLImageElement?el.alt:'',placeholder:(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)?el.placeholder:'',rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},computed:{color:cs.color,backgroundColor:cs.backgroundColor,fontFamily:cs.fontFamily,fontSize:cs.fontSize,fontWeight:cs.fontWeight,lineHeight:cs.lineHeight,letterSpacing:cs.letterSpacing,textAlign:cs.textAlign,borderRadius:cs.borderRadius,borderColor:cs.borderColor,borderWidth:cs.borderWidth,boxShadow:cs.boxShadow,opacity:cs.opacity,padding:cs.padding,margin:cs.margin,objectFit:cs.objectFit,objectPosition:cs.objectPosition}};
}
function post(type:string,payload:any={}){ parent.postMessage({type:`${MSG}${type}`,...payload},location.origin); }

export function CmsRuntime(){
  const docRef=useRef<CmsDocument>(EMPTY_CMS_DOCUMENT);
  const selectedRef=useRef<HTMLElement|null>(null);
  const overlayRef=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{
    let alive=true;
    const preview=new URLSearchParams(location.search).get('cmsPreview')==='1';
    const apply=()=>{ensureCmsIds();applyDocument(docRef.current)};
    if(!preview) fetch('/api/cms/published',{cache:'no-store'}).then(r=>r.ok?r.json():EMPTY_CMS_DOCUMENT).then(data=>{if(!alive)return;docRef.current=sanitizeCmsDocument(data);apply()}).catch(()=>{}); else apply();
    const mo=new MutationObserver(()=>apply()); mo.observe(document.body,{childList:true,subtree:true});
    const themeObserver=new MutationObserver(()=>apply()); themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    const resize=()=>apply(); addEventListener('resize',resize);
    if(preview){
      document.documentElement.classList.add('cms-preview-mode');
      const overlay=document.createElement('div'); overlay.className='cms-preview-selection'; overlay.innerHTML='<i data-h="nw"></i><i data-h="ne"></i><i data-h="sw"></i><i data-h="se"></i><b>arrastar</b>'; document.body.appendChild(overlay); overlayRef.current=overlay;
      const place=()=>{const el=selectedRef.current;if(!el){overlay.style.display='none';return}const r=el.getBoundingClientRect();overlay.style.display='block';overlay.style.left=`${r.left+scrollX}px`;overlay.style.top=`${r.top+scrollY}px`;overlay.style.width=`${r.width}px`;overlay.style.height=`${r.height}px`};
      const click=(e:MouseEvent)=>{const t=(e.target as HTMLElement).closest<HTMLElement>('[data-cms-id]');if(!t)return;e.preventDefault();e.stopPropagation();selectedRef.current=t;place();post('select',{element:snapshot(t)});};
      document.addEventListener('click',click,true);
      const down=(e:PointerEvent)=>{
        const el=selectedRef.current;if(!el)return;
        const handle=(e.target as HTMLElement).closest<HTMLElement>('[data-h]');
        const inside=el.contains(e.target as Node)||overlay.contains(e.target as Node); if(!inside&&!handle)return;
        e.preventDefault(); e.stopPropagation();
        const start={x:e.clientX,y:e.clientY,w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height};
        const transform=el.style.transform||''; const match=transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/); const tx=match?Number(match[1]):0,ty=match?Number(match[2]):0;
        const move=(ev:PointerEvent)=>{
          if(handle){const w=Math.max(24,start.w+(ev.clientX-start.x)*(handle.dataset.h?.includes('w')?-1:1));const h=Math.max(24,start.h+(ev.clientY-start.y)*(handle.dataset.h?.includes('n')?-1:1));el.style.width=`${Math.round(w)}px`;el.style.height=`${Math.round(h)}px`;post('change',{id:el.dataset.cmsId,patch:{style:{width:el.style.width,height:el.style.height}}});}
          else {const nx=Math.round(tx+ev.clientX-start.x),ny=Math.round(ty+ev.clientY-start.y);el.style.transform=`translate(${nx}px, ${ny}px)`;el.style.zIndex='20';el.dataset.cmsPosition='free';post('change',{id:el.dataset.cmsId,patch:{positionMode:'free',style:{transform:el.style.transform,zIndex:'20'}}});}
          place();
        };
        const up=()=>{removeEventListener('pointermove',move,true);removeEventListener('pointerup',up,true);post('select',{element:snapshot(el)})};
        addEventListener('pointermove',move,true);addEventListener('pointerup',up,true);
      };
      document.addEventListener('pointerdown',down,true);
      const message=(event:MessageEvent)=>{if(event.origin!==location.origin||!event.data?.type?.startsWith(MSG))return;const data=event.data;
        if(data.type===`${MSG}document`){docRef.current=sanitizeCmsDocument(data.document);apply();place();}
        if(data.type===`${MSG}patch`&&selectedRef.current){const patch=sanitizeCmsPatch(data.patch);apply(selectedRef.current,patch);place();post('select',{element:snapshot(selectedRef.current)});}
        if(data.type===`${MSG}theme`){document.documentElement.dataset.theme=data.theme==='dark'?'dark':'light';apply();place();}
        if(data.type===`${MSG}selectById`){const el=document.querySelector<HTMLElement>(`[data-cms-id="${CSS.escape(String(data.id))}"]`);if(el){selectedRef.current=el;place();post('select',{element:snapshot(el)})}}
        if(data.type===`${MSG}requestLayers`){ensureCmsIds();post('layers',{layers:[...document.querySelectorAll<HTMLElement>('[data-cms-id]')].map(el=>({id:el.dataset.cmsId,type:el.dataset.cmsType||'element',label:el.getAttribute('aria-label')||el.textContent?.trim().slice(0,60)||el.dataset.cmsId}))});}
      };
      addEventListener('message',message); post('ready',{route:location.pathname});
      return ()=>{alive=false;mo.disconnect();themeObserver.disconnect();removeEventListener('resize',resize);document.removeEventListener('click',click,true);document.removeEventListener('pointerdown',down,true);removeEventListener('message',message);overlay.remove();document.documentElement.classList.remove('cms-preview-mode')};
    }
    return ()=>{alive=false;mo.disconnect();themeObserver.disconnect();removeEventListener('resize',resize)};
  },[]);
  return null;
}
