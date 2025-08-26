// src/app/[lang]/admin/service-plans/DeletePlanButton.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

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

  async function onDelete() {
    if (loading) return;
    const ok = window.confirm(confirmText);
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/service-plans/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401) {
        const from = encodeURIComponent(pathname || `/${lang}/admin/service-plans`);
        router.push(`/${lang}/admin?from=${from}`);
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || 'Failed to delete');
      }

      // Success — refresh the server component list
      router.refresh();
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
