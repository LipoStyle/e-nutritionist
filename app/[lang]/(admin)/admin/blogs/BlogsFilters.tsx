"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Status = "all" | "draft" | "published";

function normalizeDate(v: string) {
  // keep YYYY-MM-DD or empty
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
}

export default function BlogsFilters({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    const q = sp.get("q") ?? "";
    const status = (sp.get("status") as Status) || "all";
    const category = sp.get("category") ?? "";
    const from = normalizeDate(sp.get("from") ?? "");
    const to = normalizeDate(sp.get("to") ?? "");
    return { q, status: status === "draft" || status === "published" ? status : ("all" as const), category, from, to };
  }, [sp]);

  const [q, setQ] = useState(initial.q);
  const [status, setStatus] = useState<Status>(initial.status);
  const [category, setCategory] = useState(initial.category);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);

  // Keep local state in sync when URL changes (back/forward)
  useEffect(() => {
    setQ(initial.q);
    setStatus(initial.status);
    setCategory(initial.category);
    setFrom(initial.from);
    setTo(initial.to);
  }, [initial]);

  const debounceRef = useRef<number | null>(null);

  const pushFilters = (next: { q: string; status: Status; category: string; from: string; to: string }, { debounceQ }: { debounceQ: boolean }) => {
    const params = new URLSearchParams(sp.toString());

    const setOrDel = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    // Keep toast params if present (created/updated/deleted/error)
    setOrDel("q", next.q.trim());
    if (next.status && next.status !== "all") params.set("status", next.status);
    else params.delete("status");
    setOrDel("category", next.category.trim());
    setOrDel("from", normalizeDate(next.from));
    setOrDel("to", normalizeDate(next.to));

    const url = `${pathname}?${params.toString()}`;

    const go = () => router.replace(url, { scroll: false });
    if (!debounceQ) return go();

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(go, 250);
  };

  return (
    <div className="blogs-filters">
      <div className="blogs-filters__form" role="search" aria-label="Blog filters">
        <input
          className="blogs-filters__input"
          type="search"
          value={q}
          placeholder="Search title or slug…"
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            pushFilters({ q: next, status, category, from, to }, { debounceQ: true });
          }}
        />

        <select
          className="blogs-filters__input"
          value={status}
          onChange={(e) => {
            const next = (e.target.value as Status) || "all";
            setStatus(next);
            pushFilters({ q, status: next, category, from, to }, { debounceQ: false });
          }}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <input
          className="blogs-filters__input"
          type="text"
          value={category}
          placeholder="Category…"
          onChange={(e) => {
            const next = e.target.value;
            setCategory(next);
            pushFilters({ q, status, category: next, from, to }, { debounceQ: true });
          }}
        />

        <input
          className="blogs-filters__input"
          type="date"
          value={from}
          onChange={(e) => {
            const next = e.target.value;
            setFrom(next);
            pushFilters({ q, status, category, from: next, to }, { debounceQ: false });
          }}
        />

        <input
          className="blogs-filters__input"
          type="date"
          value={to}
          onChange={(e) => {
            const next = e.target.value;
            setTo(next);
            pushFilters({ q, status, category, from, to: next }, { debounceQ: false });
          }}
        />

        <Link className="blogs-filters__reset" href={`/${lang}/admin/blogs`}>
          Reset
        </Link>
      </div>
    </div>
  );
}

