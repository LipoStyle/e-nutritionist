import Link from "next/link";
import CTAButton from "@/components/buttons/CTAButton";
import ShareButton from "./ShareButton";

type BlogBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { id: string; type: "list"; style: "ul" | "ol"; items: string[] }
  | { id: string; type: "link"; text: string; url: string }
  | { id: string; type: "image"; url: string; caption: string }
  | { id: string; type: "video"; url: string; caption: string };

function wordsFromBlocks(blocks: BlogBlock[]) {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === "paragraph") parts.push(b.text);
    if (b.type === "heading") parts.push(b.text);
    if (b.type === "list") parts.push(b.items.join(" "));
    if (b.type === "link") parts.push(`${b.text} ${b.url}`);
    if (b.type === "image") parts.push(b.caption);
    if (b.type === "video") parts.push(b.caption);
  }
  return parts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function readingMinutes(blocks: BlogBlock[]) {
  const wc = wordsFromBlocks(blocks);
  if (!wc) return 1;
  return Math.max(1, Math.round(wc / 200));
}

export type BlogPostViewModel = {
  lang: string;
  title: string;
  slug?: string | null;
  excerpt?: string | null;
  categories?: string[] | null;
  coverImageUrl?: string | null;
  dateLabel?: string | null;
  blocks: BlogBlock[];
  backHref: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  shareUrl?: string | null;
};

export default function BlogPostView({
  lang,
  title,
  excerpt,
  categories,
  coverImageUrl,
  dateLabel,
  blocks,
  backHref,
  breadcrumb,
  shareUrl,
}: BlogPostViewModel) {
  const mins = readingMinutes(blocks);
  const safeCats = (categories ?? []).filter(Boolean);
  const canShare = Boolean(shareUrl);

  return (
    <div className="BlogPost">
      {breadcrumb?.length ? (
        <nav className="BlogPost__crumbs" aria-label="Breadcrumb">
          {breadcrumb.map((c, idx) => (
            <span key={`${c.label}-${idx}`} className="BlogPost__crumb">
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span>{c.label}</span>}
              {idx < breadcrumb.length - 1 ? <span className="BlogPost__crumbSep">/</span> : null}
            </span>
          ))}
        </nav>
      ) : null}

      <div className="BlogPost__header">
        <Link className="BlogPost__backBtn" href={backHref}>
          ← Back to Blog
        </Link>

        {safeCats.length ? (
          <div className="BlogPost__tags" aria-label="Tags">
            {safeCats.map((t) => (
              <span key={t} className="BlogPost__tag">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <h1 className="BlogPost__title">{title}</h1>

        {excerpt ? <p className="BlogPost__excerpt">{excerpt}</p> : null}

        <div className="BlogPost__metaRow">
          <div className="BlogPost__metaLeft">
            {dateLabel ? <span className="BlogPost__metaItem">🗓 {dateLabel}</span> : null}
            <span className="BlogPost__metaItem">🕒 {mins} min read</span>
          </div>
          <div className="BlogPost__metaRight">{canShare ? <ShareButton title={title} url={shareUrl as string} /> : null}</div>
        </div>
      </div>

      {coverImageUrl ? (
        <div className="BlogPost__cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImageUrl} alt={title} />
        </div>
      ) : null}

      <article className="BlogPost__content">
        {blocks.map((b) => {
          if (b.type === "paragraph") return <p key={b.id} className="BlogPost__p">{b.text}</p>;
          if (b.type === "heading") {
            const level = b.level ?? 2;
            const Tag = (level === 1 ? "h2" : level === 2 ? "h2" : level === 3 ? "h3" : "h4") as any;
            return (
              <Tag key={b.id} className={`BlogPost__h BlogPost__h--l${level}`}>
                {b.text}
              </Tag>
            );
          }
          if (b.type === "list") {
            const ListTag = (b.style === "ol" ? "ol" : "ul") as any;
            return (
              <ListTag key={b.id} className="BlogPost__list">
                {b.items.filter(Boolean).map((it, idx) => (
                  <li key={`${b.id}-${idx}`}>{it}</li>
                ))}
              </ListTag>
            );
          }
          if (b.type === "link") {
            return (
              <p key={b.id} className="BlogPost__p">
                <a className="BlogPost__link" href={b.url} target="_blank" rel="noreferrer">
                  {b.text || b.url}
                </a>
              </p>
            );
          }
          if (b.type === "image") {
            return (
              <figure key={b.id} className="BlogPost__figure">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.url} alt={b.caption || title} />
                {b.caption ? <figcaption>{b.caption}</figcaption> : null}
              </figure>
            );
          }
          if (b.type === "video") {
            return (
              <div key={b.id} className="BlogPost__video">
                <a className="BlogPost__link" href={b.url} target="_blank" rel="noreferrer">
                  {b.url}
                </a>
                {b.caption ? <p className="BlogPost__caption">{b.caption}</p> : null}
              </div>
            );
          }
          return null;
        })}
      </article>

      <div className="BlogPost__footer">
        {safeCats.length ? (
          <div className="BlogPost__footerTags">
            <span className="BlogPost__footerLabel">Tags</span>
            {safeCats.map((t) => (
              <span key={`f-${t}`} className="BlogPost__footerTag">
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="BlogPost__cta">
          <h3>Explore More Nutrition Insights</h3>
          <p>Discover more evidence-based nutrition tips, research findings, and practical advice to optimize your health and performance.</p>
          <div className="BlogPost__ctaBtns">
            <CTAButton text="Read More Articles" link={`/${lang}/blogs`} ariaLabel="Read more blog articles" />
            <CTAButton text="Get Personalized Advice" link={`/${lang}/contact`} ariaLabel="Get personalized advice" />
          </div>
        </div>
      </div>
    </div>
  );
}

