'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

type Plan = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  order: number;
};

export default function ServicesCarouselClient({
  plans,
  bookingHref,
  autoplayMs = 3500,
  loop = true,
  showArrows = true,
  showDots = true, // default off per your request
}: {
  plans: Plan[];
  bookingHref: string;
  autoplayMs?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const count = plans.length;

  // Compute current slide width (handles responsive changes)
  const getSlideWidth = () => {
    const list = listRef.current;
    if (!list) return 0;
    const first = list.querySelector<HTMLElement>('.svc-slide');
    if (!first) return 0;
    return first.offsetWidth; // gap is 0, so this equals one slide width
  };

  // Update active index on scroll (for dots / state)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    let raf = 0;
    const handler = () => {
      raf = requestAnimationFrame(() => {
        const sw = getSlideWidth();
        const idx = sw ? Math.round(list.scrollLeft / sw) : 0;
        setActiveIdx(Math.min(Math.max(idx, 0), count - 1));
      });
    };

    list.addEventListener('scroll', handler, { passive: true });
    return () => {
      list.removeEventListener('scroll', handler as any);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  // Autoplay (moves left by one slide each tick)
  useEffect(() => {
    const list = listRef.current;
    if (!list || !autoplayMs) return;

    let timer: any;
    const play = () => {
      timer = setInterval(() => {
        const sw = getSlideWidth();
        if (!sw) return;

        const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
        if (atEnd) {
          if (loop) {
            list.scrollTo({ left: 0, behavior: 'auto' });
          } else {
            clearInterval(timer);
            return;
          }
        } else {
          list.scrollBy({ left: sw, behavior: 'smooth' });
        }
      }, autoplayMs);
    };
    const stop = () => timer && clearInterval(timer);

    play();
    list.addEventListener('mouseenter', stop);
    list.addEventListener('mouseleave', play);
    list.addEventListener('focusin', stop);
    list.addEventListener('focusout', play);

    return () => {
      stop();
      list.removeEventListener('mouseenter', stop);
      list.removeEventListener('mouseleave', play);
      list.removeEventListener('focusin', stop);
      list.removeEventListener('focusout', play);
    };
  }, [autoplayMs, loop]);

  const goTo = (idx: number) => {
    const list = listRef.current;
    if (!list) return;
    const sw = getSlideWidth();
    list.scrollTo({ left: sw * idx, behavior: 'smooth' });
  };

  const prev = () => {
    const list = listRef.current;
    if (!list) return;
    const sw = getSlideWidth();
    if (list.scrollLeft <= 1) {
      // wrap to end if desired
      list.scrollTo({ left: list.scrollWidth, behavior: 'auto' });
    }
    list.scrollBy({ left: -sw, behavior: 'smooth' });
  };

  const next = () => {
    const list = listRef.current;
    if (!list) return;
    const sw = getSlideWidth();
    const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
    if (atEnd && loop) {
      list.scrollTo({ left: 0, behavior: 'auto' });
    } else {
      list.scrollBy({ left: sw, behavior: 'smooth' });
    }
  };

  const slides = useMemo(
    () =>
      plans.map((p) => (
        <div key={p.id} className="svc-slide slick-slide" role="group" aria-roledescription="slide">
          <div className="service-container-outer">
            <div className="service-container-inner">
              <h3 className="title-of-service">{p.title}</h3>
              {p.summary && <p className="description-of-service">{p.summary}</p>}
              <Link
                className="go-button"
                href={`${bookingHref}?plan=${encodeURIComponent(p.slug)}`}
              >
                Πήγαινε στην Υπηρεσία
              </Link>
            </div>
          </div>
        </div>
      )),
    [plans, bookingHref]
  );

  return (
    <div className="slick-slider" dir="ltr">
      {showArrows && (
        <button
          type="button"
          className="slick-arrow slick-prev"
          aria-label="Previous"
          onClick={prev}
        >
          Previous
        </button>
      )}

      <div className="slick-list" aria-live="polite">
        <div
          ref={listRef}
          className="svc-track slick-track"
          tabIndex={0}
          role="listbox"
          aria-label="Service plans"
        >
          {slides}
        </div>
      </div>

      {showArrows && (
        <button
          type="button"
          className="slick-arrow slick-next"
          aria-label="Next"
          onClick={next}
        >
          Next
        </button>
      )}

      {showDots && (
        <ul className="slick-dots">
          {plans.map((_, i) => (
            <li key={i} className={i === activeIdx ? 'slick-active' : ''}>
              <button onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
