import Script from 'next/script'

export default function Page() {
  return (
    <>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="app-shell">
        <aside className="sidebar glass">
          <div className="brand"><div className="brand-mark">▽</div><div>OCTA</div></div>
          <button className="icon-btn search-trigger" data-action="focus-search" aria-label="Buscar">⌕</button>
          <nav id="sidebarNav" className="nav" />
          <div className="sidebar-footer">
            <button className="profile-card" data-action="edit-profile">
              <div className="avatar avatar-main" id="avatarMain">D</div>
              <div className="profile-copy"><strong id="profileNameSide">Denner Biersack</strong><span>Marketing Digital</span></div>
              <span className="status-dot" />
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div className="welcome">Bem-vindo de volta, <strong id="welcomeName">Denner</strong> 👋</div>
            <label className="searchbox glass"><span>⌕</span><input id="globalSearch" placeholder="Buscar reunião, pessoa ou gravação..."/><kbd>⌘ K</kbd></label>
            <div className="top-actions">
              <button className="icon-btn glass" data-action="notifications">♧<span className="notification-dot" /></button>
              <button className="account-pill glass" data-action="edit-profile"><span className="avatar avatar-small" id="avatarTop">D</span><span id="profileNameTop">Denner Biersack</span><span>⌄</span></button>
            </div>
          </header>
          <section id="view" />
        </main>
      </div>
      <div id="modalRoot" />
      <div id="toastRoot" className="toast-root" />
      <input type="file" id="avatarInput" accept="image/*" hidden />
      <Script src="/app.js" strategy="afterInteractive" />
    </>
  )
}
