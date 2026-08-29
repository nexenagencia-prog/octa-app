import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`apple-shell rounded-[32px] ${className}`} {...props} />;
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-2 rounded-full border border-black/[.08] bg-white/75 px-3 py-1.5 text-xs font-medium text-black/60 shadow-sm backdrop-blur-xl ${className}`}>{children}</span>;
}

export function Button({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/85 disabled:opacity-50 ${className}`} {...props}>{children}</button>;
}

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`grid size-11 place-items-center rounded-full border border-black/[.08] bg-white/80 text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white ${className}`} {...props} />;
}
