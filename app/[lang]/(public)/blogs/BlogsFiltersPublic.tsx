"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BlogsFiltersPublic({ lang, topics }: { lang: string; topics: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const initial = useMemo(() => {
    const q = sp.get("q") ?? "";
    const topic = sp.get("topic") ?? "";
    return { q, topic };
  }, [sp]);

  const [q, setQ] = useState(initial.q);
  const [topic, setTopic] = useState(initial.topic);

  useEffect(() => {
    setQ(initial.q);
    setTopic(initial.topic);
  }, [initial]);

  const debounceRef = useRef<number | null>(null);

  const pushFilters = (next: { q: string; topic: string }, { debounceText }: { debounceText: boolean }) => {
    const params = new URLSearchParams(sp.toString());

    const setOrDel = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };

    setOrDel("q", next.q.trim());
    setOrDel("topic", next.topic.trim());

    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    const go = () => router.replace(url, { scroll: false });

    if (!debounceText) return go();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(go, 250);
  };

  return (
    <div className="PublicBlogs__filters">
      <div className="PublicBlogs__searchRow" role="search" aria-label="Search blog articles">
        <input
          className="PublicBlogs__search"
          type="search"
          value={q}
          placeholder="Search articles…"
          onChange={(e) => {
            const next = e.target.value;
            setQ(next);
            pushFilters({ q: next, topic }, { debounceText: true });
          }}
        />
      </div>

      <div className="PublicBlogs__topicsLabel">Filter by type</div>
      <div className="PublicBlogs__topics" role="list" aria-label="Topics">
        <button
          type="button"
          className={`PublicBlogs__topic ${topic ? "" : "is-active"}`}
          onClick={() => {
            setTopic("");
            pushFilters({ q, topic: "" }, { debounceText: false });
          }}
        >
          All Topics
        </button>
        {topics.map((t) => {
          const active = t.toLowerCase() === topic.toLowerCase();
          return (
            <button
              key={t}
              type="button"
              className={`PublicBlogs__topic ${active ? "is-active" : ""}`}
              onClick={() => {
                setTopic(t);
                pushFilters({ q, topic: t }, { debounceText: false });
              }}
            >
              {t}
            </button>
          );
        })}

        <Link className="PublicBlogs__reset" href={`/${lang}/blogs`}>
          Reset
        </Link>
      </div>
    </div>
  );
}

