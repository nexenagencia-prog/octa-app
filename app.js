const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const initialState = {
  profile: JSON.parse(localStorage.getItem('octa.profile') || 'null') || {name:'Denner Biersack', role:'Marketing Digital', avatar:null},
  meetings: JSON.parse(localStorage.getItem('octa.meetings') || 'null') || [
    {title:'Briefing Campanha',when:'Hoje · 10:30',people:4},{title:'Alinhamento Comercial',when:'Hoje · 15:00',people:4},{title:'Reunião com Cliente',when:'Ontem · 16:20',people:3}
  ],
  recordings: JSON.parse(localStorage.getItem('octa.recordings') || 'null') || [
    {title:'Planejamento de Marketing',meta:'Hoje · 14:30 · 48 min',duration:'48:12'},
    {title:'Reunião com João Silva',meta:'Ontem · 15:00 · 32 min',duration:'32:46'},
    {title:'Alinhamento Comercial',meta:'Ontem · 10:30 · 26 min',duration:'26:10'},
    {title:'Briefing Campanha',meta:'18 Mai · 11:00 · 52 min',duration:'52:33'}
  ],
  contacts: JSON.parse(localStorage.getItem('octa.contacts') || 'null') || [
    {name:'Marina Costa',email:'marina@empresa.com'},{name:'João Silva',email:'joao@empresa.com'},{name:'Ana Martins',email:'ana@empresa.com'}
  ],
  notes: localStorage.getItem('octa.notes') || '',
  recording:false
};
function save(){localStorage.setItem('octa.profile',JSON.stringify(initialState.profile));localStorage.setItem('octa.meetings',JSON.stringify(initialState.meetings));localStorage.setItem('octa.recordings',JSON.stringify(initialState.recordings));localStorage.setItem('octa.contacts',JSON.stringify(initialState.contacts));localStorage.setItem('octa.notes',initialState.notes)}

const navItems = [
 ['inicio','⌂','Início'],['reunioes','▣','Reuniões'],['agenda','▤','Agenda'],['contatos','♙','Contatos'],['gravacoes','◉','Gravações'],['octa-ai','✧','OCTA AI'],['skills','♢','OCTA Skills'],['calculadora','▦','Calculadora'],['filtros','▽','Filtros'],['anotar','✎','Anotar'],['compartilhar','▱','Compartilhar Tela'],['gravar','●','Gravar'],['anotacoes','▧','Minhas Anotações']
];
const nav = $('#sidebarNav');
nav.innerHTML = navItems.map(([id,ic,label])=>`<button data-route="${id}" aria-label="${label}"><span class="nav-icon">${ic}</span><span>${label}</span></button>`).join('');
nav.addEventListener('click',e=>{const b=e.target.closest('[data-route]');if(b)navigate(b.dataset.route)});

function navigate(route){location.hash=route==='inicio'?'':route;render(route);}
function currentRoute(){return location.hash.replace('#','')||'inicio'}
window.addEventListener('hashchange',()=>render(currentRoute()));

function updateProfileUI(){
 const p=initialState.profile; const first=p.name.split(' ')[0]||p.name;
 $('#welcomeName').textContent=first; $('#profileNameSide').textContent=p.name; $('#profileNameTop').textContent=p.name;
 for(const id of ['avatarMain','avatarTop']){const el=$('#'+id);el.textContent=first[0]||'U';el.style.backgroundImage=p.avatar?`url(${p.avatar})`:''}
}

function avatars(n=4){return `<div class="mini-avatars">${Array.from({length:n},(_,i)=>`<span class="avatar avatar-small" style="background:${['linear-gradient(145deg,#d7f5ff,#244b60)','linear-gradient(145deg,#f2d7c9,#60382f)','linear-gradient(145deg,#d7d2ff,#34305e)','linear-gradient(145deg,#ffe0ef,#653349)'][i%4]}">${['D','M','A','J'][i%4]}</span>`).join('')}</div>`}
function dashboard(){return `
<section class="hero">
 <div class="hero-copy"><h1>Suas reuniões.<br>Seu tempo.<br><span>Tudo conectado.</span></h1><p>A OCTA reúne reuniões, agenda, contatos e gravações em uma única experiência — para você ir além em cada conversa.</p><div class="button-row"><button class="btn btn-primary" data-action="new-meeting">＋ Nova reunião　→</button><button class="btn" data-action="schedule">▣　Agendar reunião</button></div></div>
 <aside class="next-meeting glass"><div class="card-title">▣　Próxima reunião <span style="float:right">•••</span></div><div class="meeting-time">14:30 <span class="small muted">Hoje</span></div><div>Planejamento de Marketing</div>${avatars(5)}</aside>
 <div class="quote">⚡ “Grandes ideias acontecem em boas conversas.”</div>
</section>
<div class="stats glass">${[['▣','08','Reuniões hoje'],['♙','12','Contatos recentes'],['◉','24','Gravações'],['▥','82%','Performance']].map(x=>`<div class="stat"><div class="stat-icon">${x[0]}</div><div><b>${x[1]}</b><span>${x[2]}</span></div></div>`).join('')}</div>
<div class="dashboard-grid">
 <section class="panel glass quick-actions"><h3>Ações rápidas</h3><div class="quick-grid">${[['▣','Iniciar reunião','Agora, com um clique','new-meeting'],['▤','Agendar','Criar evento','schedule'],['♙+','Convidar pessoas','Adicionar participantes','invite'],['◉','Gravar reunião','Iniciar gravação','toggle-recording']].map(x=>`<button class="quick-btn" data-action="${x[3]}"><div>${x[0]}</div><strong>${x[1]}</strong><span>${x[2]}</span></button>`).join('')}</div></section>
 <section class="panel glass ai-card"><div class="orb"></div><h3>OCTA AI <span class="small muted">Beta</span></h3><p class="small muted">Sua IA de reuniões.<br>Mais foco, mais resultados.</p><button class="btn small" data-route="octa-ai">Abrir OCTA AI　→</button></section>
 <section class="panel glass"><h3>OCTA Skills</h3><div class="score"><div>82<br><small>/100</small></div></div></section>
 <section class="panel glass list-panel"><h3>Reuniões recentes <button class="row-action" data-route="reunioes" style="float:right">Ver todas →</button></h3><div class="meeting-list">${initialState.meetings.slice(0,3).map(m=>`<div class="row"><span class="avatar avatar-small">${m.title[0]}</span><div><strong>${m.title}</strong><br><span>${m.when}</span></div><button class="row-action" data-action="join-meeting" data-title="${m.title}">Entrar →</button></div>`).join('')}</div></section>
 <section class="panel glass list-panel"><h3>Gravações <button class="row-action" data-route="gravacoes" style="float:right">Ver todas →</button></h3><div class="meeting-list">${initialState.recordings.slice(0,4).map(r=>`<div class="row"><div class="thumb">${r.duration}</div><div><strong>${r.title}</strong><br><span>${r.meta}</span></div><button class="row-action" data-action="play-recording" data-title="${r.title}">▶</button></div>`).join('')}</div></section>
 <section class="panel glass list-panel"><h3>Agenda da semana <button class="row-action" data-route="agenda" style="float:right">Ver agenda →</button></h3>${calendarMarkup()}</section>
</div>`}
function calendarMarkup(){let times=['08:00','09:00','10:00','11:00','12:00','14:00','15:00'];return `<div class="calendar"><div></div>${['Seg 18','Ter 19','Qua 20','Qui 21','Sex 22'].map(d=>`<div class="day">${d}</div>`).join('')}${times.map((t,i)=>`<div>${t}</div>${Array.from({length:5},(_,j)=>`<div>${(i===1&&j===0)?'<span class="event">Reunião com Cliente<br>09:00</span>':(i===5&&j===2)?'<span class="event primary">Planejamento de Marketing<br>14:30</span>':(i===2&&j===3)?'<span class="event">Apresentação<br>09:30</span>':''}</div>`).join('')}`).join('')}</div>`}
function pageHead(title,desc,action=''){return `<div class="section-head"><div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function meetingsPage(){return `<section class="section-page">${pageHead('Reuniões','Organize, entre e crie novas reuniões.','<button class="btn btn-primary" data-action="new-meeting">＋ Nova reunião</button>')}<div class="content-card glass"><div class="meeting-list">${initialState.meetings.map(m=>`<div class="row"><span class="avatar avatar-small">${m.title[0]}</span><div><strong>${m.title}</strong><br><span>${m.when} · ${m.people} participantes</span></div><button class="row-action" data-action="join-meeting" data-title="${m.title}">Entrar →</button></div>`).join('')}</div></div></section>`}
function agendaPage(){return `<section class="section-page">${pageHead('Agenda','Sua semana em um único lugar.','<button class="btn btn-primary" data-action="schedule">Agendar reunião</button>')}<div class="content-card glass">${calendarMarkup()}</div><div class="grid-2"><div class="content-card glass"><h3>Hoje</h3>${initialState.meetings.filter(m=>m.when.includes('Hoje')).map(m=>`<p><strong>${m.title}</strong><br><span class="small muted">${m.when}</span></p>`).join('')}</div><div class="content-card glass"><h3>Próximos eventos</h3><p class="small muted">Nenhum conflito detectado. Sua agenda está organizada.</p></div></div></section>`}
function contactsPage(){return `<section class="section-page">${pageHead('Contatos','Convide pessoas para uma reunião em segundos.','<button class="btn btn-primary" data-action="invite">＋ Novo contato</button>')}<div class="grid-3">${initialState.contacts.map(c=>`<div class="contact-card"><span class="avatar avatar-main">${c.name[0]}</span><h3>${c.name}</h3><p class="small muted">${c.email}</p><button class="btn small" data-action="invite-contact" data-email="${c.email}">Convidar</button></div>`).join('')}</div></section>`}
function recordingsPage(){return `<section class="section-page">${pageHead('Gravações','Reveja conversas importantes e seus principais momentos.')}<div class="grid-2">${initialState.recordings.map(r=>`<div class="recording-card"><div class="thumb" style="width:100%;height:130px;font-size:18px">▶ ${r.duration}</div><h3>${r.title}</h3><p class="small muted">${r.meta}</p><button class="btn" data-action="play-recording" data-title="${r.title}">Reproduzir</button></div>`).join('')}</div></section>`}
function aiPage(){return `<section class="section-page">${pageHead('OCTA AI','Insights automáticos para transformar reuniões em decisões.')}<div class="grid-2"><div class="content-card glass ai-card"><div class="orb" style="width:120px;height:120px"></div><h2>Resumo inteligente</h2><p class="muted">Selecione uma gravação para gerar pontos-chave, decisões, tarefas e oportunidades de melhoria.</p><select id="aiRecording" class="input">${initialState.recordings.map(r=>`<option>${r.title}</option>`).join('')}</select><button class="btn btn-primary" style="margin-top:12px" data-action="ai-analyze">Analisar reunião</button></div><div id="aiOutput" class="content-card glass"><h3>Pronto para analisar</h3><p class="muted">A análise simulada aparecerá aqui.</p></div></div></section>`}
function skillsPage(){return `<section class="section-page">${pageHead('OCTA Skills','Sua evolução em cada conversa.')}<div class="grid-3">${[['Comunicação',88],['Clareza',91],['Escuta',84],['Objetividade',76],['Perguntas',89],['Argumentação',81]].map(([n,v])=>`<div class="skill-card"><span class="muted small">${n}</span><h2>${v}</h2><div style="height:7px;background:#ffffff0f;border-radius:99px;overflow:hidden"><div style="height:100%;width:${v}%;background:linear-gradient(90deg,#5d8cff,#67e3d0)"></div></div></div>`).join('')}</div></section>`}
function calculatorPage(){return `<section class="section-page">${pageHead('Calculadora','Faça contas rápidas sem sair da OCTA.')}<div class="content-card glass calculator"><div id="calcDisplay" class="calc-display glass">0</div><div class="calc-grid">${['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','.','⌫','='].map(x=>`<button data-calc="${x}">${x}</button>`).join('')}</div></div></section>`}
function notesPage(title='Anotar'){return `<section class="section-page">${pageHead(title,'Suas ideias ficam salvas automaticamente neste navegador.')}<div class="content-card glass"><textarea id="notesArea" class="input textarea" placeholder="Comece a escrever...">${initialState.notes}</textarea><p id="saveStatus" class="small muted">Salvo automaticamente.</p></div></section>`}
function filtersPage(){return `<section class="section-page">${pageHead('Filtros','Encontre exatamente o que precisa.')}<div class="content-card glass form-grid"><label>Período<select class="input"><option>Todos</option><option>Hoje</option><option>Esta semana</option></select></label><label>Tipo<select class="input"><option>Todos</option><option>Reuniões</option><option>Gravações</option><option>Contatos</option></select></label><label>Participantes<input class="input" placeholder="Nome ou e-mail"></label><label>Palavra-chave<input class="input" placeholder="Ex.: marketing"></label><button class="btn btn-primary" data-action="apply-filters">Aplicar filtros</button></div></section>`}
function sharePage(){return `<section class="section-page">${pageHead('Compartilhar Tela','Escolha o que você deseja compartilhar.')}<div class="grid-3">${[['▱','Tela inteira'],['▣','Janela'],['◫','Aba do navegador']].map(x=>`<button class="contact-card" style="color:white;text-align:left;cursor:pointer" data-action="share-option" data-title="${x[1]}"><h2>${x[0]}</h2><h3>${x[1]}</h3><p class="small muted">Pré-visualização segura antes de compartilhar.</p></button>`).join('')}</div></section>`}
function recordPage(){return `<section class="section-page">${pageHead('Gravar','Controle suas gravações com um clique.')}<div class="content-card glass"><h2 id="recordStatus">${initialState.recording?'Gravação em andamento':'Pronto para gravar'}</h2><p class="muted">${initialState.recording?'A reunião está sendo gravada localmente nesta demonstração.':'Inicie uma gravação de demonstração.'}</p><button class="btn ${initialState.recording?'':'btn-primary'}" data-action="toggle-recording">${initialState.recording?'■ Parar gravação':'● Iniciar gravação'}</button></div></section>`}
function generic(route){if(route==='reunioes')return meetingsPage();if(route==='agenda')return agendaPage();if(route==='contatos')return contactsPage();if(route==='gravacoes')return recordingsPage();if(route==='octa-ai')return aiPage();if(route==='skills')return skillsPage();if(route==='calculadora')return calculatorPage();if(route==='filtros')return filtersPage();if(route==='anotar')return notesPage('Anotar');if(route==='anotacoes')return notesPage('Minhas Anotações');if(route==='compartilhar')return sharePage();if(route==='gravar')return recordPage();return dashboard()}
function render(route='inicio'){$('#view').innerHTML=generic(route);$$('[data-route]',nav).forEach(b=>b.classList.toggle('active',b.dataset.route===route));bindView();}

function bindView(){
 $$('[data-route]','#view').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.route)));
 const notes=$('#notesArea');if(notes)notes.addEventListener('input',()=>{initialState.notes=notes.value;save();$('#saveStatus').textContent='Salvo agora.'});
 $$('[data-calc]').forEach(b=>b.addEventListener('click',()=>calc(b.dataset.calc)));
}

let calcExpr='';
function calc(k){const d=$('#calcDisplay');if(!d)return;if(k==='C')calcExpr='';else if(k==='⌫')calcExpr=calcExpr.slice(0,-1);else if(k==='±'){if(calcExpr)calcExpr=String(-Number(calcExpr)||0)}else if(k==='%'){if(calcExpr)calcExpr=String(Number(calcExpr)/100)}else if(k==='='){try{const safe=calcExpr.replaceAll('×','*').replaceAll('÷','/').replaceAll('−','-');if(!/^[0-9+\-*/.() ]+$/.test(safe))throw 0;calcExpr=String(Function(`"use strict";return (${safe})`)())}catch{calcExpr='Erro'}}else calcExpr+=k;d.textContent=calcExpr||'0'}

function modal(title,body){$('#modalRoot').innerHTML=`<div class="modal-backdrop"><div class="modal glass"><div class="modal-head"><h2>${title}</h2><button class="close" data-action="close-modal">×</button></div>${body}</div></div>`}
function closeModal(){$('#modalRoot').innerHTML=''}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;$('#toastRoot').appendChild(el);setTimeout(()=>el.remove(),3000)}

function newMeeting(){const code=Math.random().toString(36).slice(2,5).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();modal('Nova reunião',`<p class="muted">Sua sala está pronta.</p><input class="input" value="octa.app/${code}" readonly><div class="button-row"><button class="btn btn-primary" data-action="start-room" data-code="${code}">Entrar agora</button><button class="btn" data-action="copy-room" data-code="${code}">Copiar link</button></div>`)}
function schedule(){modal('Agendar reunião',`<div class="form-grid"><input id="schedTitle" class="input" placeholder="Título da reunião"><input id="schedDate" class="input" type="date"><input id="schedTime" class="input" type="time"><input id="schedPeople" class="input" type="number" min="1" value="3" placeholder="Participantes"></div><button class="btn btn-primary" style="margin-top:12px" data-action="save-schedule">Salvar na agenda</button>`)}
function invite(){modal('Adicionar contato',`<input id="contactName" class="input" placeholder="Nome"><input id="contactEmail" class="input" type="email" placeholder="email@empresa.com" style="margin-top:8px"><button class="btn btn-primary" style="margin-top:12px" data-action="save-contact">Adicionar e convidar</button>`)}
function editProfile(){const p=initialState.profile;modal('Editar perfil',`<input id="profileNameInput" class="input" value="${p.name.replaceAll('"','&quot;')}" placeholder="Seu nome"><p><button class="btn" data-action="choose-avatar">Escolher foto</button></p><button class="btn btn-primary" data-action="save-profile">Salvar perfil</button>`)}

document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;
 if(a==='focus-search'){$('#globalSearch').focus();return}
 if(a==='new-meeting')return newMeeting(); if(a==='schedule')return schedule(); if(a==='invite')return invite(); if(a==='edit-profile')return editProfile(); if(a==='close-modal')return closeModal();
 if(a==='copy-room'){const link=`https://octa.app/${b.dataset.code}`;try{await navigator.clipboard.writeText(link);toast('Link copiado.')}catch{toast(link)}return}
 if(a==='start-room'){closeModal();toast('Sala criada. Entrando na reunião…');setTimeout(()=>navigate('reunioes'),600);return}
 if(a==='save-schedule'){const title=$('#schedTitle').value.trim()||'Nova reunião';const date=$('#schedDate').value;const time=$('#schedTime').value||'09:00';initialState.meetings.unshift({title,when:`${date||'Hoje'} · ${time}`,people:Number($('#schedPeople').value)||3});save();closeModal();toast('Reunião adicionada à agenda.');render(currentRoute());return}
 if(a==='save-contact'){const name=$('#contactName').value.trim(),email=$('#contactEmail').value.trim();if(!name||!email)return toast('Preencha nome e e-mail.');initialState.contacts.unshift({name,email});save();closeModal();toast('Contato adicionado e convite preparado.');render(currentRoute());return}
 if(a==='choose-avatar')return $('#avatarInput').click();
 if(a==='save-profile'){const name=$('#profileNameInput').value.trim();if(name)initialState.profile.name=name;save();updateProfileUI();closeModal();toast('Perfil atualizado.');return}
 if(a==='join-meeting')return toast(`Entrando em “${b.dataset.title}”…`);
 if(a==='play-recording')return toast(`Reproduzindo “${b.dataset.title}”`);
 if(a==='invite-contact')return toast(`Convite enviado para ${b.dataset.email}`);
 if(a==='notifications')return toast('Você não tem novas notificações.');
 if(a==='toggle-recording'){initialState.recording=!initialState.recording;toast(initialState.recording?'Gravação iniciada.':'Gravação finalizada.');render(currentRoute());return}
 if(a==='apply-filters')return toast('Filtros aplicados.');
 if(a==='share-option')return toast(`${b.dataset.title}: pré-visualização aberta.`);
 if(a==='ai-analyze'){const t=$('#aiRecording').value;$('#aiOutput').innerHTML=`<h3>Análise de ${t}</h3><p><strong>Pontos fortes:</strong> clareza, perguntas e condução.</p><p><strong>Melhoria:</strong> respostas mais objetivas nos momentos de decisão.</p><p class="small muted">Demonstração local — conecte sua API de IA no backend para análise real.</p>`;return}
});

$('#avatarInput').addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{initialState.profile.avatar=r.result;save();updateProfileUI();toast('Foto atualizada.')};r.readAsDataURL(f)});
$('#globalSearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase().trim();if(q.length<2)return;const hit=[...initialState.meetings,...initialState.recordings,...initialState.contacts].find(x=>JSON.stringify(x).toLowerCase().includes(q));if(hit)toast(`Encontrado: ${hit.title||hit.name}`)});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus()}if(e.key==='Escape')closeModal()});

updateProfileUI();render(currentRoute());
