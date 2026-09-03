export function OctaDigitalMark({size=28}:{size?:number}){
  return <i className="octa-ai-mark" style={{width:size,height:size}} aria-hidden="true">
    <span className="octa-ai-liquid-core"/>
    <span className="octa-ai-liquid-wave wave-one"/>
    <span className="octa-ai-liquid-wave wave-two"/>
    <span className="octa-ai-liquid-shine"/>
    <style jsx global>{`
      .octa-ai-coach{right:24px!important;bottom:22px!important;z-index:2147483000!important;animation:octa-ai-float 4.4s ease-in-out infinite}
      .octa-ai-orb{width:64px!important;height:64px!important;min-width:64px!important;justify-content:center!important;padding:0!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.42)!important;background:radial-gradient(circle at 34% 27%,rgba(236,255,255,.96) 0 5%,rgba(92,255,211,.72) 9%,rgba(15,183,232,.52) 24%,rgba(0,86,190,.78) 53%,rgba(0,24,86,.96) 100%)!important;box-shadow:0 15px 38px rgba(0,0,0,.32),0 0 22px rgba(34,218,255,.26),inset 0 0 0 1px rgba(255,255,255,.18),inset -10px -14px 22px rgba(0,20,80,.48)!important;overflow:hidden!important;backdrop-filter:blur(18px) saturate(150%)!important;-webkit-backdrop-filter:blur(18px) saturate(150%)!important;transition:transform .22s ease,box-shadow .22s ease!important}
      .octa-ai-orb:hover{transform:translateY(-3px) scale(1.04)!important;box-shadow:0 19px 44px rgba(0,0,0,.36),0 0 30px rgba(61,231,255,.34),inset 0 0 0 1px rgba(255,255,255,.22),inset -10px -14px 22px rgba(0,20,80,.44)!important}
      .octa-ai-orb>span,.octa-ai-orb>svg:last-child{display:none!important}
      .octa-ai-orb>.octa-ai-mark{display:block!important}
      .octa-ai-mark{position:relative!important;display:block!important;flex:none!important;width:52px!important;height:52px!important;border-radius:50%!important;overflow:hidden!important;background:radial-gradient(circle at 36% 30%,rgba(226,255,255,.95) 0 4%,rgba(82,255,209,.74) 10%,rgba(5,184,236,.72) 30%,rgba(0,92,204,.82) 62%,rgba(0,31,105,.95) 100%)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),inset -9px -12px 18px rgba(0,15,72,.45),0 0 17px rgba(64,236,255,.28)!important;transform:none!important;isolation:isolate!important}
      .octa-ai-mark svg{display:none!important}
      .octa-ai-liquid-core,.octa-ai-liquid-wave,.octa-ai-liquid-shine{position:absolute!important;display:block!important;pointer-events:none!important}
      .octa-ai-liquid-core{inset:-12%!important;border-radius:45% 55% 48% 52%!important;background:conic-gradient(from 45deg,rgba(84,255,202,.95),rgba(0,190,239,.12),rgba(0,67,186,.8),rgba(41,234,255,.74),rgba(155,255,135,.86),rgba(84,255,202,.95))!important;filter:blur(2px) saturate(140%)!important;mix-blend-mode:screen!important;opacity:.78!important;animation:octa-ai-liquid-spin 8s linear infinite!important}
      .octa-ai-liquid-wave{width:74%!important;height:28%!important;left:-7%!important;border-radius:50%!important;background:linear-gradient(90deg,rgba(151,255,135,.1),rgba(129,255,170,.94),rgba(57,242,238,.7),rgba(0,137,240,.12))!important;filter:blur(2px)!important;mix-blend-mode:screen!important}
      .octa-ai-liquid-wave.wave-one{top:17%!important;transform:rotate(-20deg)!important;animation:octa-ai-wave-one 5.6s ease-in-out infinite alternate!important}
      .octa-ai-liquid-wave.wave-two{width:90%!important;height:24%!important;left:14%!important;bottom:13%!important;background:linear-gradient(90deg,rgba(0,94,218,.06),rgba(0,228,255,.7),rgba(123,255,180,.82),rgba(170,255,104,.16))!important;transform:rotate(24deg)!important;animation:octa-ai-wave-two 6.8s ease-in-out infinite alternate!important}
      .octa-ai-liquid-shine{width:36%!important;height:25%!important;left:12%!important;top:8%!important;border-radius:50%!important;background:radial-gradient(ellipse at center,rgba(255,255,255,.92),rgba(221,255,255,.34) 38%,transparent 72%)!important;filter:blur(1px)!important;transform:rotate(-20deg)!important;opacity:.9!important}
      @keyframes octa-ai-liquid-spin{to{transform:rotate(360deg) scale(1.06)}}
      @keyframes octa-ai-wave-one{0%{transform:translate(-7%,4%) rotate(-24deg) scaleX(.92)}100%{transform:translate(22%,22%) rotate(-9deg) scaleX(1.2)}}
      @keyframes octa-ai-wave-two{0%{transform:translate(9%,-8%) rotate(28deg) scaleX(1.12)}100%{transform:translate(-18%,-25%) rotate(14deg) scaleX(.94)}}
      @keyframes octa-ai-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      @media(max-width:700px){.octa-ai-coach{right:14px!important;bottom:82px!important}.octa-ai-orb{width:56px!important;height:56px!important;min-width:56px!important}.octa-ai-mark{width:46px!important;height:46px!important}}
      @media(prefers-reduced-motion:reduce){.octa-ai-coach,.octa-ai-liquid-core,.octa-ai-liquid-wave{animation:none!important}}
    `}</style>
  </i>
}
