import type { Metadata } from 'next';
import { AdminNav } from '@/components/ui/AdminNav';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * Sidebar shell for authenticated admin pages only.
 * The login page lives outside this route group, so it stays full-screen.
 * Middleware guards every page here.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] bg-cream">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-[100svh] w-60 shrink-0 border-r border-nude-100 bg-white md:block">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
