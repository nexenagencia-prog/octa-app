import { z } from 'zod';

export const SAFE_STYLE_PROPERTIES = [
  'color','background','backgroundColor','backgroundImage','fontFamily','fontSize','fontWeight','fontStyle',
  'lineHeight','letterSpacing','textAlign','textTransform','textDecoration','opacity','border','borderColor',
  'borderWidth','borderStyle','borderRadius','boxShadow','filter','backdropFilter','width','height','minWidth',
  'minHeight','maxWidth','maxHeight','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin',
  'marginTop','marginRight','marginBottom','marginLeft','gap','rowGap','columnGap','transform','transformOrigin',
  'objectFit','objectPosition','display','visibility','zIndex','justifyContent','alignItems','alignSelf','justifySelf',
  'gridTemplateColumns','gridTemplateRows','gridColumn','gridRow','flexDirection','flexWrap','flexGrow','flexShrink'
] as const;

export type CmsStyleProperty = typeof SAFE_STYLE_PROPERTIES[number];
export type CmsBreakpoint = 'desktop'|'notebook'|'tablet'|'mobile';
export type CmsTheme = 'light'|'dark';
export type CmsPositionMode = 'flow'|'free';

export const CmsElementOverrideSchema = z.object({
  text: z.string().max(5000).optional(),
  href: z.string().max(2048).optional(),
  src: z.string().max(4096).optional(),
  alt: z.string().max(1000).optional(),
  poster: z.string().max(4096).optional(),
  placeholder: z.string().max(1000).optional(),
  hidden: z.boolean().optional(),
  positionMode: z.enum(['flow','free']).optional(),
  style: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
}).strict();

export type CmsElementOverride = z.infer<typeof CmsElementOverrideSchema>;

export const CmsDocumentSchema = z.object({
  version: z.literal(1),
  scopes: z.record(z.string(), z.record(z.string(), CmsElementOverrideSchema)),
  updatedAt: z.string().optional(),
}).strict();

export type CmsDocument = z.infer<typeof CmsDocumentSchema>;

export const EMPTY_CMS_DOCUMENT: CmsDocument = { version: 1, scopes: {} };

const BLOCKED_VALUE = /(javascript\s*:|expression\s*\(|<\s*script|on[a-z]+\s*=)/i;
const BLOCKED_CSS_URL = /url\s*\(\s*['"]?\s*javascript:/i;

export function isSafeCmsLink(value: string) {
  const v = value.trim();
  if (!v) return true;
  if (v.startsWith('/') || v.startsWith('#') || v.startsWith('mailto:') || v.startsWith('tel:')) return !BLOCKED_VALUE.test(v);
  try {
    const u = new URL(v);
    return (u.protocol === 'https:' || u.protocol === 'http:') && !BLOCKED_VALUE.test(v);
  } catch { return false; }
}

export function isSafeCmsMediaUrl(value: string) {
  const v = value.trim();
  if (!v) return true;
  if (v.startsWith('/')) return !BLOCKED_VALUE.test(v);
  if (v.startsWith('data:image/')) return v.length < 1_500_000;
  try {
    const u = new URL(v);
    return (u.protocol === 'https:' || u.protocol === 'http:') && !BLOCKED_VALUE.test(v);
  } catch { return false; }
}

export function sanitizeCmsPatch(input: unknown): CmsElementOverride {
  const parsed = CmsElementOverrideSchema.safeParse(input);
  if (!parsed.success) return {};
  const out: CmsElementOverride = {};
  const p = parsed.data;
  if (typeof p.text === 'string') out.text = p.text;
  if (typeof p.alt === 'string') out.alt = p.alt;
  if (typeof p.placeholder === 'string') out.placeholder = p.placeholder;
  if (typeof p.hidden === 'boolean') out.hidden = p.hidden;
  if (p.positionMode) out.positionMode = p.positionMode;
  if (p.href !== undefined && isSafeCmsLink(p.href)) out.href = p.href;
  if (p.src !== undefined && isSafeCmsMediaUrl(p.src)) out.src = p.src;
  if (p.poster !== undefined && isSafeCmsMediaUrl(p.poster)) out.poster = p.poster;
  if (p.style) {
    const allowed = new Set<string>(SAFE_STYLE_PROPERTIES);
    const style: Record<string,string|number> = {};
    for (const [key, raw] of Object.entries(p.style)) {
      if (!allowed.has(key)) continue;
      const value = typeof raw === 'number' ? raw : String(raw).trim();
      if (typeof value === 'string' && (BLOCKED_VALUE.test(value) || BLOCKED_CSS_URL.test(value))) continue;
      if (key === 'display' && !['block','inline','inline-block','flex','inline-flex','grid','inline-grid','none','contents'].includes(String(value))) continue;
      if (key === 'visibility' && !['visible','hidden','collapse'].includes(String(value))) continue;
      style[key] = value;
    }
    if (Object.keys(style).length) out.style = style;
  }
  return out;
}

export function sanitizeCmsDocument(input: unknown): CmsDocument {
  const parsed = CmsDocumentSchema.safeParse(input);
  if (!parsed.success) return EMPTY_CMS_DOCUMENT;
  const scopes: CmsDocument['scopes'] = {};
  for (const [scope, entries] of Object.entries(parsed.data.scopes)) {
    const clean: Record<string,CmsElementOverride> = {};
    for (const [id, patch] of Object.entries(entries)) {
      const sanitized = sanitizeCmsPatch(patch);
      if (Object.keys(sanitized).length) clean[id] = sanitized;
    }
    if (Object.keys(clean).length) scopes[scope] = clean;
  }
  return { version: 1, scopes, updatedAt: parsed.data.updatedAt };
}


export function stripAutoCmsOverrides(document: CmsDocument): CmsDocument {
  const scopes: CmsDocument['scopes'] = {};
  for (const [scope, entries] of Object.entries(document.scopes)) {
    const clean = Object.fromEntries(Object.entries(entries).filter(([id]) => !id.startsWith('auto:')));
    if (Object.keys(clean).length) scopes[scope] = clean;
  }
  return { version: 1, scopes, updatedAt: document.updatedAt };
}

export function getCmsBreakpoint(width: number): CmsBreakpoint {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1440) return 'notebook';
  return 'desktop';
}

export function getCmsScopeKey(route: string, theme: CmsTheme, breakpoint: CmsBreakpoint) {
  const normalized = route.split('?')[0].replace(/\/$/,'') || '/';
  return `${normalized}::${theme}::${breakpoint}`;
}

export function mergeCmsScope(document: CmsDocument, route: string, theme: CmsTheme, breakpoint: CmsBreakpoint) {
  const keys = [
    getCmsScopeKey(route, theme, 'desktop'),
    breakpoint === 'desktop' ? null : getCmsScopeKey(route, theme, breakpoint),
  ].filter(Boolean) as string[];
  return keys.reduce<Record<string,CmsElementOverride>>((acc,key)=>Object.assign(acc,document.scopes[key]||{}),{});
}
