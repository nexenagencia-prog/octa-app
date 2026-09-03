export function OctaDigitalMark({size=28}:{size?:number}){
  return <i className="octa-ai-mark" style={{width:size,height:size}} aria-hidden="true">
    <img className="octa-ai-orb-image" src="/octa-ai-orb-faithful.webp" alt=""/>
    <span className="octa-ai-liquid-core"/>
    <span className="octa-ai-liquid-wave wave-one"/>
    <span className="octa-ai-liquid-wave wave-two"/>
    <span className="octa-ai-liquid-shine"/>
    <style jsx global>{`
      .octa-ai-coach{right:24px!important;bottom:22px!important;z-index:2147483000!important;animation:octa-ai-float 4.8s ease-in-out infinite}
      .octa-ai-orb{width:64px!important;height:64px!important;min-width:64px!important;aspect-ratio:1/1!important;justify-content:center!important;padding:0!important;border-radius:50%!important;border:1px solid rgba(166,247,255,.42)!important;background:#02070b!important;box-shadow:0 15px 38px rgba(0,0,0,.34),0 0 24px rgba(45,224,255,.22)!important;overflow:hidden!important;transition:box-shadow .22s ease,filter .22s ease!important}
      .octa-ai-orb:hover{filter:brightness(1.08)!important;box-shadow:0 18px 42px rgba(0,0,0,.38),0 0 32px rgba(63,235,255,.32)!important}
      .octa-ai-orb>span,.octa-ai-orb>svg:last-child{display:none!important}
      .octa-ai-orb>.octa-ai-mark{display:block!important;width:58px!important;height:58px!important;aspect-ratio:1/1!important;border-radius:50%!important}
      .octa-ai-mark{position:relative;display:inline-block;flex:none;border-radius:50%;overflow:hidden;background:#02070b;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18);isolation:isolate}
      .octa-ai-orb-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;z-index:1;animation:octa-ai-image-breathe 5.8s ease-in-out infinite alternate}
      .octa-ai-liquid-core,.octa-ai-liquid-wave,.octa-ai-liquid-shine{position:absolute;display:block;pointer-events:none;border-radius:50%;z-index:2}
      .octa-ai-liquid-core{inset:2%;background:conic-gradient(from 180deg,transparent 0 18%,rgba(119,255,215,.14) 27%,transparent 38% 61%,rgba(34,218,255,.16) 72%,transparent 84%);mix-blend-mode:screen;animation:octa-ai-liquid-spin 8s linear infinite}
      .octa-ai-liquid-wave{left:10%;width:80%;height:18%;filter:blur(3px);mix-blend-mode:screen;opacity:.35;background:linear-gradient(90deg,transparent,rgba(112,255,192,.75),rgba(57,225,255,.55),transparent)}
      .octa-ai-liquid-wave.wave-one{top:23%;animation:octa-ai-wave-one 4.8s ease-in-out infinite alternate}
      .octa-ai-liquid-wave.wave-two{bottom:19%;animation:octa-ai-wave-two 6.2s ease-in-out infinite alternate}
      .octa-ai-liquid-shine{left:16%;top:10%;width:27%;height:18%;background:radial-gradient(ellipse at center,rgba(255,255,255,.42),transparent 72%);filter:blur(1px);z-index:3}
      .octa-ai-mark:after{content:"";position:absolute;z-index:4;left:9%;right:9%;height:1px;top:12%;background:linear-gradient(90deg,transparent,rgba(173,255,255,.82),transparent);box-shadow:0 0 8px rgba(79,236,255,.72);opacity:.55;animation:octa-ai-scan 3.6s ease-in-out infinite}
      @keyframes octa-ai-liquid-spin{to{transform:rotate(360deg)}}
      @keyframes octa-ai-image-breathe{0%{filter:saturate(1) brightness(.98)}100%{filter:saturate(1.08) brightness(1.06)}}
      @keyframes octa-ai-wave-one{0%{transform:translateY(-2px) rotate(-10deg);opacity:.18}100%{transform:translateY(8px) rotate(8deg);opacity:.42}}
      @keyframes octa-ai-wave-two{0%{transform:translateY(5px) rotate(9deg);opacity:.16}100%{transform:translateY(-7px) rotate(-7deg);opacity:.38}}
      @keyframes octa-ai-scan{0%{top:12%;opacity:0}18%{opacity:.62}75%{opacity:.35}100%{top:86%;opacity:0}}
      @keyframes octa-ai-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @media(max-width:700px){.octa-ai-coach{right:14px!important;bottom:82px!important}.octa-ai-orb{width:56px!important;height:56px!important;min-width:56px!important}.octa-ai-orb>.octa-ai-mark{width:50px!important;height:50px!important}}
      @media(prefers-reduced-motion:reduce){.octa-ai-coach,.octa-ai-orb-image,.octa-ai-liquid-core,.octa-ai-liquid-wave,.octa-ai-mark:after{animation:none!important}}
    `}</style>
  </i>
}
