'use client';

import { X, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

/** Reusable admin building blocks shared across all CRUD pages. */

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button type="button" className="absolute inset-0 bg-ink/50" onClick={onClose} aria-label="Tutup" />
      <div className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-soft-lg sm:max-w-lg sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-9 w-9 place-items-center rounded-xl border border-nude-200 text-ink-muted"
          >
            <X size={16} />
          </button>
        </div>
        <div className="grid gap-3">{children}</div>
      </div>
    </div>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <textarea
        className="input resize-y"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-rose-gold"
      />
      {label}
    </label>
  );
}

export function SaveButton({
  saving,
  onClick,
  label = 'Simpan',
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button type="button" onClick={onClick} disabled={saving} className="btn-primary mt-1 w-full">
      {saving ? <Loader2 className="animate-spin" size={18} /> : label}
    </button>
  );
}

export function Loading() {
  return (
    <div className="mt-10 grid place-items-center text-ink-muted">
      <Loader2 className="animate-spin" />
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="mt-10 text-sm text-ink-muted">{children}</p>;
}
