'use client';
import { useState } from 'react';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Send, Sparkles, UsersRound } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { currentUser, demoParticipants } from '@/lib/demo/data';

const fallbackAvatar='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80';
const posts=[
  {id:'p1',author:'Amanda Smith',role:'Parceira de Crescimento',avatar:demoParticipants[2].avatarUrl ?? fallbackAvatar,copy:'Brainstorming de ideias para a nova campanha. Saímos da reunião com três caminhos claros para testar nesta semana.',image:'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=88',likes:128,comments:32},
  {id:'p2',author:'Marcus Lee',role:'Diretor de Vendas',avatar:demoParticipants[1].avatarUrl ?? fallbackAvatar,copy:'A melhor parte de uma boa reunião é quando todo mundo sai sabendo qual é o próximo passo.',image:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=88',likes:86,comments:18},
];

export default function FeedPage(){
 const [liked,setLiked]=useState<Record<string,boolean>>({});
 return <PageShell title="Feed" kicker="Conexões e momentos da sua rede" actions={<div className="flex items-center gap-2 rounded-full bg-[#e8f3f5] px-3 py-2 text-[11px] font-semibold text-[#0b7285]"><Sparkles size={13}/> Feed OCTA</div>}>
   <div className="feed-layout no-scrollbar">
    <aside className="feed-profile-card">
      <div className="feed-profile-cover"/>
      <img src={currentUser.avatarUrl ?? fallbackAvatar} alt={currentUser.displayName} className="feed-profile-avatar"/>
      <h2>{currentUser.displayName}</h2><p>@{currentUser.username}</p><span>{currentUser.headline}</span>
      <div className="feed-profile-stats"><div><strong>521</strong><span>Conexões</span></div><div><strong>345</strong><span>Seguindo</span></div><div><strong>8</strong><span>Reuniões</span></div></div>
      <button className="feed-profile-button">Editar perfil</button>
    </aside>
    <section className="feed-stream">
      <div className="feed-stories no-scrollbar">{demoParticipants.map((p,i)=><button key={p.id} className="feed-story"><span className={`feed-story-ring ${i===0?'is-live':''}`}><img src={p.avatarUrl ?? fallbackAvatar} alt={p.displayName}/></span><small>{i===0?'Você':p.displayName.split(' ')[0]}</small></button>)}</div>
      {posts.map(post=><article key={post.id} className="feed-post-card"><header><div className="flex items-center gap-3"><img src={post.avatar} alt={post.author}/><div><strong>{post.author}</strong><span>{post.role} · 2h</span></div></div><button aria-label="Mais opções"><MoreHorizontal size={18}/></button></header><p className="feed-post-copy">{post.copy}</p><div className="feed-post-media"><img src={post.image} alt="Momento compartilhado"/><button className="feed-post-play" aria-label="Reproduzir"><Play size={18} fill="currentColor"/></button></div><footer><button onClick={()=>setLiked(v=>({...v,[post.id]:!v[post.id]}))} className={liked[post.id]?'is-liked':''}><Heart size={18} fill={liked[post.id]?'currentColor':'none'}/><span>{post.likes+(liked[post.id]?1:0)}</span></button><button><MessageCircle size={18}/><span>{post.comments}</span></button><button><Send size={18}/></button><button className="ml-auto"><Bookmark size={18}/></button></footer></article>)}
    </section>
    <aside className="feed-network-card"><div className="flex items-center justify-between"><div><p>Agora na OCTA</p><h3>Sua rede</h3></div><UsersRound size={18}/></div><div className="mt-4 space-y-3">{demoParticipants.slice(1,5).map(p=><div key={p.id} className="feed-network-person"><img src={p.avatarUrl ?? fallbackAvatar} alt={p.displayName}/><div><strong>{p.displayName}</strong><span>{p.headline}</span></div><button>Conectar</button></div>)}</div></aside>
   </div>
 </PageShell>;
}
