import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.existsSync(path.join(root,p))?fs.readFileSync(path.join(root,p),'utf8'):'';
const must=(cond,msg)=>{if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)};

const cms=read('src/lib/cms.ts');
const migration=read('supabase/migrations/202608290001_okta_mvp.sql')+read('supabase/migrations/202608300001_visual_cms.sql');

must(cms.includes('CmsDocumentSchema'),'CMS document schema exists');
must(cms.includes('sanitizeCmsPatch'),'safe CMS sanitizer exists');
must(cms.includes('SAFE_STYLE_PROPERTIES'),'style allow-list exists');
must(cms.includes('isSafeCmsLink'),'safe link validator exists');
must(cms.includes('isSafeCmsMediaUrl'),'safe media validator exists');
must(cms.includes('getCmsScopeKey'),'scope resolver exists');
must(migration.includes('create table if not exists public.cms_admins'),'cms_admins table exists');
must(migration.includes('create table if not exists public.cms_revisions'),'cms_revisions table exists');
must(migration.includes('create table if not exists public.cms_assets'),'cms_assets table exists');
must(migration.includes('cms_is_admin'),'admin RLS helper exists');
must(migration.includes('cms published read'),'published revision read policy exists');

if(process.exitCode) process.exit(process.exitCode);

const runtime=read('src/components/cms-runtime.tsx');
const layout=read('src/app/layout.tsx');
const nav=read('src/components/nav.tsx');
const cmsRoute=read('src/app/api/cms/route.ts');
const publishedRoute=read('src/app/api/cms/published/route.ts');
const adminPage=read('src/app/admin/page.tsx');
const editor=read('src/components/cms-editor.tsx');
const css=read('src/app/globals.css');

must(runtime.includes('octa:cms:'),'runtime preview bridge exists');
must(runtime.includes('/api/cms/published'),'runtime loads published CMS');
must(runtime.includes('MutationObserver'),'runtime reapplies to dynamic DOM');
must(layout.includes('<CmsRuntime'),'CMS runtime mounted globally');
must(nav.includes('data-cms-id="global.wordmark"'),'wordmark is CMS-addressable');
must(nav.includes('data-cms-id="global.sidebar.profile"'),'sidebar profile is CMS-addressable');
must(nav.includes('data-cms-id="global.top.search"'),'top search is CMS-addressable');

must(cmsRoute.includes('saveDraft'),'draft API exists');
must(cmsRoute.includes('publish'),'publish API exists');
must(cmsRoute.includes('restore'),'restore API exists');
must(cmsRoute.includes('cms_is_admin'),'server checks admin capability');
must(publishedRoute.includes('EMPTY_CMS_DOCUMENT'),'published endpoint has safe fallback');
must(publishedRoute.includes("status', 'published"),'published endpoint queries published revision');

must(adminPage.includes('CmsEditor'),'admin page renders visual editor');
must(editor.includes('<iframe'),'editor renders real app preview');
must(editor.includes('Undo'),'editor has undo');
must(editor.includes('Redo'),'editor has redo');
must(editor.includes('Publicar'),'editor has publish action');
must(editor.includes('Salvar rascunho'),'editor has draft save');
must(editor.includes('Desktop'),'editor has breakpoint controls');
must(editor.includes('Escuro'),'editor has theme controls');
must(editor.includes('Camadas'),'editor has layer panel');
must(editor.includes('Tipografia'),'editor has typography inspector');
must(editor.includes('Aparência'),'editor has appearance inspector');
must(editor.includes('Mídia'),'editor has media inspector');
must(css.includes('.cms-admin-shell'),'admin editor styling exists');

const assetRoute=read('src/app/api/cms/assets/route.ts');
must(runtime.includes('ensureCmsIds'),'runtime auto-addresses unmarked app elements');
must(runtime.includes('selectById'),'preview can select elements from layer panel');
must(assetRoute.includes('25 * 1024 * 1024')||assetRoute.includes('25*1024*1024'),'asset upload enforces 25MB limit');
must(assetRoute.includes("cms-assets"),'asset upload targets cms-assets bucket');
must(assetRoute.includes('cms_is_admin'),'asset upload checks admin capability');
must(assetRoute.includes('image/')&&assetRoute.includes('video/'),'asset upload validates media MIME families');
must(migration.includes('storage.objects'),'storage object policies are defined');
