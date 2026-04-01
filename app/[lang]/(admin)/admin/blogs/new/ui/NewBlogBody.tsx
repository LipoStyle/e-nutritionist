"use client";

import { useMemo, useState } from "react";

type BlogLang = "en" | "el" | "es";

type ParagraphBlock = { id: string; type: "paragraph"; text: string };
type HeadingBlock = { id: string; type: "heading"; level: 1 | 2 | 3 | 4; text: string };
type LinkBlock = { id: string; type: "link"; text: string; url: string };
type ImageBlock = { id: string; type: "image"; url: string; caption: string };
type VideoBlock = { id: string; type: "video"; url: string; caption: string };
type ListBlock = { id: string; type: "list"; style: "ul" | "ol"; items: string[] };

type BlogBlock = ParagraphBlock | HeadingBlock | LinkBlock | ImageBlock | VideoBlock | ListBlock;

type BodyState = Record<BlogLang, { blocks: BlogBlock[] }>;

const LANGS: Array<{ code: BlogLang; label: string }> = [
  { code: "en", label: "EN" },
  { code: "el", label: "EL" },
  { code: "es", label: "ES" },
];

function newId() {
  return crypto.randomUUID();
}

type DragPayload =
  | {
      kind: "palette";
      blockType: PaletteBlockType;
    }
  | { kind: "existing"; blockId: string };

type PaletteBlockType = "paragraph" | "heading" | "list" | "link" | "image" | "video";

function encodeDrag(payload: DragPayload) {
  return JSON.stringify(payload);
}

function decodeDrag(value: string): DragPayload | null {
  try {
    const v = JSON.parse(value) as DragPayload;
    if (v && typeof v === "object" && (v as any).kind) return v;
  } catch {
    // ignore
  }
  return null;
}

export type BlogBodyLang = BlogLang;
export type BlogBodyState = BodyState;

export default function NewBlogBody({ initial }: { initial?: Partial<BodyState> } = {}) {
  const [activeLang, setActiveLang] = useState<BlogLang>("en");
  const [state, setState] = useState<BodyState>(() => ({
    en: { blocks: initial?.en?.blocks ?? [{ id: newId(), type: "paragraph", text: "" }] },
    el: { blocks: initial?.el?.blocks ?? [{ id: newId(), type: "paragraph", text: "" }] },
    es: { blocks: initial?.es?.blocks ?? [{ id: newId(), type: "paragraph", text: "" }] },
  }));

  const current = state[activeLang];
  const namePrefix = useMemo(() => `tr_${activeLang}_`, [activeLang]);

  const jsonFor = (lang: BlogLang) => JSON.stringify({ blocks: state[lang].blocks });

  const makeBlock = (blockType: PaletteBlockType): BlogBlock => {
    const id = newId();
    switch (blockType) {
      case "paragraph":
        return { id, type: "paragraph", text: "" };
      case "heading":
        return { id, type: "heading", level: 2, text: "" };
      case "list":
        return { id, type: "list", style: "ul", items: [""] };
      case "link":
        return { id, type: "link", text: "", url: "" };
      case "image":
        return { id, type: "image", url: "", caption: "" };
      case "video":
        return { id, type: "video", url: "", caption: "" };
      default:
        return { id, type: "paragraph", text: "" };
    }
  };

  const insertBlockAt = (blockType: PaletteBlockType, index: number) => {
    setState((prev) => {
      const blocks = [...prev[activeLang].blocks];
      const next = makeBlock(blockType);
      blocks.splice(Math.max(0, Math.min(index, blocks.length)), 0, next);
      return { ...prev, [activeLang]: { blocks } };
    });
  };

  const moveBlock = (blockId: string, toIndex: number) => {
    setState((prev) => {
      const blocks = [...prev[activeLang].blocks];
      const fromIndex = blocks.findIndex((b) => b.id === blockId);
      if (fromIndex === -1) return prev;
      const [item] = blocks.splice(fromIndex, 1);
      const safeTo = Math.max(0, Math.min(toIndex, blocks.length));
      blocks.splice(safeTo, 0, item);
      return { ...prev, [activeLang]: { blocks } };
    });
  };

  return (
    <div className="BlogBody" role="tabpanel">
      {/* Hidden JSON for all languages (we'll parse this server-side later) */}
      {LANGS.map((l) => (
        <input key={l.code} type="hidden" name={`tr_${l.code}_body_json`} value={jsonFor(l.code)} />
      ))}

      <div className="BlogBody__stickyTop">
        <div className="BlogNew__langTabs" role="tablist" aria-label="Body language">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              className={`BlogNew__langTab ${activeLang === l.code ? "is-active" : ""}`}
              onClick={() => setActiveLang(l.code)}
              role="tab"
              aria-selected={activeLang === l.code}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="BlogBody__stickyMeta">
          <span>Language: {activeLang.toUpperCase()}</span>
          <span>Drag blocks to reorder</span>
        </div>
      </div>

      <div className="BlogBody__layout">
          <aside className="BlogBody__palette" aria-label="Blocks">
            <div className="BlogBody__paletteTitle">Blocks</div>
            <div className="BlogBody__paletteHint">Drag into the editor</div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "paragraph" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              Paragraph
            </div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "heading" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              Heading (H1–H4)
            </div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "list" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              List (UL/OL)
            </div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "link" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              Link
            </div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "image" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              Image
            </div>

            <div
              className="BlogBody__paletteItem"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", encodeDrag({ kind: "palette", blockType: "video" }));
                e.dataTransfer.effectAllowed = "copy";
              }}
            >
              Video
            </div>
          </aside>

          <section className="BlogBody__editor" aria-label="Body blocks">
            <div className="BlogBody__scrollArea">
              <div className="BlogBody__blocks">
              {/* Drop zone at start */}
              <div
                className="BlogBody__dropZone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const payload = decodeDrag(e.dataTransfer.getData("application/json"));
                  if (!payload) return;
                  if (payload.kind === "palette") insertBlockAt(payload.blockType, 0);
                  if (payload.kind === "existing") moveBlock(payload.blockId, 0);
                }}
              >
                Drop here
              </div>

              {current.blocks.map((b, idx) => (
                <div key={b.id}>
                  <div
                    className="BlogBody__block"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/json", encodeDrag({ kind: "existing", blockId: b.id }));
                      e.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <div className="BlogBody__blockHeader">
                      <div className="BlogBody__blockTitle">
                        {b.type.toUpperCase()} <span className="BlogBody__blockIndex">#{idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        className="BlogBody__removeBtn"
                        onClick={() => {
                          setState((prev) => ({
                            ...prev,
                            [activeLang]: { blocks: prev[activeLang].blocks.filter((x) => x.id !== b.id) },
                          }));
                        }}
                        aria-label={`Remove paragraph ${idx + 1}`}
                        disabled={current.blocks.length <= 1}
                        title={current.blocks.length <= 1 ? "At least one paragraph is required" : "Remove block"}
                      >
                        Remove
                      </button>
                    </div>

                    {b.type === "paragraph" ? (
                      <textarea
                        className="BlogBody__textarea"
                        value={b.text}
                        onChange={(e) => {
                          const text = e.target.value;
                          setState((prev) => ({
                            ...prev,
                            [activeLang]: {
                              blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), text } : x)),
                            },
                          }));
                        }}
                        placeholder="Write paragraph text…"
                        rows={5}
                      />
                    ) : null}

                    {b.type === "heading" ? (
                      <div className="BlogBody__row">
                        <label className="BlogBody__miniField">
                          <span className="BlogBody__miniLabel">Level</span>
                          <select
                            className="BlogBody__miniInput"
                            value={b.level}
                            onChange={(e) => {
                              const level = Number(e.target.value) as 1 | 2 | 3 | 4;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), level } : x)),
                                },
                              }));
                            }}
                          >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                            <option value={4}>H4</option>
                          </select>
                        </label>
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Text</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.text}
                            onChange={(e) => {
                              const text = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), text } : x)),
                                },
                              }));
                            }}
                            placeholder="Heading text…"
                          />
                        </label>
                      </div>
                    ) : null}

                    {b.type === "link" ? (
                      <div className="BlogBody__row">
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Text</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.text}
                            onChange={(e) => {
                              const text = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), text } : x)),
                                },
                              }));
                            }}
                            placeholder="Link label…"
                          />
                        </label>
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">URL</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.url}
                            onChange={(e) => {
                              const url = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), url } : x)),
                                },
                              }));
                            }}
                            placeholder="https://…"
                          />
                        </label>
                      </div>
                    ) : null}

                    {b.type === "image" ? (
                      <div className="BlogBody__row">
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Image URL</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.url}
                            onChange={(e) => {
                              const url = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), url } : x)),
                                },
                              }));
                            }}
                            placeholder="https://…"
                          />
                        </label>
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Caption</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.caption}
                            onChange={(e) => {
                              const caption = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), caption } : x)),
                                },
                              }));
                            }}
                            placeholder="Optional caption…"
                          />
                        </label>
                      </div>
                    ) : null}

                    {b.type === "video" ? (
                      <div className="BlogBody__row">
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Video URL</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.url}
                            onChange={(e) => {
                              const url = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), url } : x)),
                                },
                              }));
                            }}
                            placeholder="https://…"
                          />
                        </label>
                        <label className="BlogBody__miniField BlogBody__miniField--grow">
                          <span className="BlogBody__miniLabel">Caption</span>
                          <input
                            className="BlogBody__miniInput"
                            value={b.caption}
                            onChange={(e) => {
                              const caption = e.target.value;
                              setState((prev) => ({
                                ...prev,
                                [activeLang]: {
                                  blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), caption } : x)),
                                },
                              }));
                            }}
                            placeholder="Optional caption…"
                          />
                        </label>
                      </div>
                    ) : null}

                    {b.type === "list" ? (
                      <div>
                        <div className="BlogBody__row">
                          <label className="BlogBody__miniField">
                            <span className="BlogBody__miniLabel">Style</span>
                            <select
                              className="BlogBody__miniInput"
                              value={b.style}
                              onChange={(e) => {
                                const style = (e.target.value === "ol" ? "ol" : "ul") as "ul" | "ol";
                                setState((prev) => ({
                                  ...prev,
                                  [activeLang]: {
                                    blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), style } : x)),
                                  },
                                }));
                              }}
                            >
                              <option value="ul">UL</option>
                              <option value="ol">OL</option>
                            </select>
                          </label>
                        </div>
                        <textarea
                          className="BlogBody__textarea"
                          value={b.items.join("\n")}
                          onChange={(e) => {
                            const items = e.target.value.split("\n");
                            setState((prev) => ({
                              ...prev,
                              [activeLang]: {
                                blocks: prev[activeLang].blocks.map((x) => (x.id === b.id ? { ...(x as any), items } : x)),
                              },
                            }));
                          }}
                          placeholder={"One list item per line…"}
                          rows={5}
                        />
                      </div>
                    ) : null}
                  </div>

                  {/* Drop zone after this block */}
                  <div
                    className="BlogBody__dropZone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const payload = decodeDrag(e.dataTransfer.getData("application/json"));
                      if (!payload) return;
                      const insertAt = idx + 1;
                      if (payload.kind === "palette") insertBlockAt(payload.blockType, insertAt);
                      if (payload.kind === "existing") moveBlock(payload.blockId, insertAt);
                    }}
                  >
                    Drop here
                  </div>
                </div>
              ))}
              </div>
            </div>
          </section>
      </div>

      <div className="BlogBody__footer">
        <p className="BlogNew__hint BlogBody__footerHint">
          This is our custom block editor. Next we can add blocks like <strong>Image upload</strong>.
        </p>
      </div>
    </div>
  );
}

