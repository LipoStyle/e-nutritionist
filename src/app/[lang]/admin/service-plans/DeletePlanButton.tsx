// src/app/[lang]/admin/service-plans/DeletePlanButton.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Lang = 'en' | 'es' | 'el';

export default function DeletePlanButton({
  id,
  lang,
  label = 'Delete',
  confirmText = 'Delete this service plan?',
}: {
  id: string;
  lang: Lang;
  label?: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const listUrl = `/${lang}/admin/service-plans`;
  const onListPage = useMemo(() => pathname === listUrl, [pathname, listUrl]);
  const onPlanPage = useMemo(
    () => Boolean(pathname && pathname.startsWith(`${listUrl}/`)),
    [pathname, listUrl]
  );

  async function onDelete() {
    if (loading) return;
    if (!window.confirm(confirmText)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/service-plans/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401 || res.status === 403) {
        const from = encodeURIComponent(pathname || listUrl);
        router.push(`/${lang}/admin/login?from=${from}`);
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Delete failed (${res.status})`);
      }

      // Success
      if (onPlanPage && !onListPage) {
        // deleting from /[lang]/admin/service-plans/[id] or /edit
        router.replace(listUrl);
        router.refresh();
      } else {
        // already on the list
        router.refresh();
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message || 'Delete failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="sp-btn sp-btn--danger"
      onClick={onDelete}
      disabled={loading}
      aria-busy={loading}
      title={loading ? 'Deleting…' : 'Delete'}
    >
      {loading ? 'Deleting…' : label}
    </button>
  );
}
