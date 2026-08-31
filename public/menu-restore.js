(() => {
  const nav = document.querySelector('#sidebarNav');
  if (!nav) return;

  const hasLabel = (label) => [...nav.querySelectorAll('button')].some((button) => button.textContent?.includes(label));
  const makeButton = ({ label, icon, route, action }) => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', label);
    if (route) button.dataset.route = route;
    if (action) button.dataset.action = action;
    button.innerHTML = `<span class="nav-icon">${icon}</span><span>${label}</span>`;
    return button;
  };

  const primaryAnchor = [...nav.querySelectorAll('button')].find((button) => button.textContent?.includes('Contatos'));
  if (!hasLabel('Reunião instantânea')) {
    const instant = makeButton({ label: 'Reunião instantânea', icon: '⊕', action: 'new-meeting' });
    primaryAnchor?.before(instant) ?? nav.appendChild(instant);
  }

  const extras = [
    { label: 'Lousa', icon: '□', route: 'lousa' },
    { label: 'Entrar em reunião', icon: '↗', action: 'new-meeting' },
    { label: 'Configurações', icon: '⚙', route: 'configuracoes' },
  ];
  extras.forEach((item) => {
    if (!hasLabel(item.label)) nav.appendChild(makeButton(item));
  });

  if (typeof window.generic === 'function') {
    const originalGeneric = window.generic;
    window.generic = function restoredGeneric(route) {
      if (route === 'lousa') {
        return `<section class="section-page"><div class="section-head"><div><h1>Lousa</h1><p>Organize ideias visualmente durante suas reuniões.</p></div></div><div class="content-card glass"><textarea id="notesArea" class="input textarea" style="min-height:420px" placeholder="Escreva, desenhe ideias em texto e registre pontos da reunião...">${window.initialState?.notes || ''}</textarea><p id="saveStatus" class="small muted">Salvo automaticamente.</p></div></section>`;
      }
      if (route === 'configuracoes') {
        return `<section class="section-page"><div class="section-head"><div><h1>Configurações</h1><p>Personalize sua experiência OCTA.</p></div></div><div class="grid-2"><button class="contact-card" data-action="edit-profile" style="text-align:left;cursor:pointer"><h3>Perfil</h3><p class="small muted">Nome, foto e identificação.</p></button><button class="contact-card" data-action="notifications" style="text-align:left;cursor:pointer"><h3>Notificações</h3><p class="small muted">Confira seus avisos e atualizações.</p></button></div></section>`;
      }
      return originalGeneric(route);
    };
  }
})();
