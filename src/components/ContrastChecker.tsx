import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Dev-only accessibility checker.
 * Scans every text-bearing element + SVG icon, computes its effective
 * foreground vs. background color contrast ratio, and lists any failures.
 *
 * Re-runs automatically when:
 *  - The DOM mutates (new content, route changes)
 *  - CSS variables on :root change (theme token edits / dark mode)
 *  - The user clicks "Re-scan"
 */

type Issue = {
  selector: string;
  preview: string;
  fg: string;
  bg: string;
  ratio: number;
  required: number;
  kind: "text" | "icon";
  element: Element;
};

const MIN_TEXT_NORMAL = 4.5;
const MIN_TEXT_LARGE = 3;
const MIN_ICON = 3;

function parseColor(input: string): [number, number, number, number] | null {
  if (!input) return null;
  const m = input.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
  const [r, g, b, a = 1] = parts;
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b, a];
}

function blend(
  fg: [number, number, number, number],
  bg: [number, number, number, number],
): [number, number, number] {
  const a = fg[3] + bg[3] * (1 - fg[3]);
  if (a === 0) return [bg[0], bg[1], bg[2]];
  const mix = (i: number) =>
    (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
  return [mix(0), mix(1), mix(2)];
}

function relLuminance([r, g, b]: [number, number, number]) {
  const ch = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(fg: [number, number, number], bg: [number, number, number]) {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

function effectiveBackground(el: Element): [number, number, number] {
  let node: Element | null = el;
  let composite: [number, number, number, number] = [0, 0, 0, 0];
  while (node) {
    const style = getComputedStyle(node);
    const parsed = parseColor(style.backgroundColor);
    if (parsed && parsed[3] > 0) {
      if (composite[3] === 0) {
        composite = parsed;
      } else {
        const [r, g, b] = blend(composite, parsed);
        composite = [r, g, b, composite[3] + parsed[3] * (1 - composite[3])];
      }
      if (composite[3] >= 0.999) break;
    }
    node = node.parentElement;
  }
  if (composite[3] < 0.999) {
    const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor);
    const fallback: [number, number, number, number] = bodyBg ?? [255, 255, 255, 1];
    const [r, g, b] = blend(composite, fallback);
    return [r, g, b];
  }
  return [composite[0], composite[1], composite[2]];
}

function describe(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const id = (el as HTMLElement).id ? `#${(el as HTMLElement).id}` : "";
  const cls = (el.getAttribute("class") || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join("");
  return `${tag}${id}${cls}`;
}

function hasDirectText(el: Element): boolean {
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true;
  }
  return false;
}

function scan(): Issue[] {
  const issues: Issue[] = [];
  const root = document.querySelector("main") || document.body;
  const all = root.querySelectorAll<HTMLElement>("*");

  for (const el of Array.from(all)) {
    if (el.closest("[data-contrast-checker]")) continue;
    const style = getComputedStyle(el);
    if (style.visibility === "hidden" || style.display === "none") continue;
    if (parseFloat(style.opacity) < 0.1) continue;

    const tag = el.tagName.toLowerCase();
    const isSvg = tag === "svg" || tag === "path" || tag === "circle" || tag === "rect";

    if (isSvg && tag === "svg") {
      const fillStr = style.fill && style.fill !== "none" ? style.fill : style.color;
      const fg = parseColor(fillStr);
      if (!fg || fg[3] === 0) continue;
      const bg = effectiveBackground(el);
      const fgRgb: [number, number, number] =
        fg[3] >= 0.999 ? [fg[0], fg[1], fg[2]] : blend(fg, [...bg, 1] as any);
      const ratio = contrast(fgRgb, bg);
      if (ratio < MIN_ICON) {
        issues.push({
          selector: describe(el),
          preview: "[icon]",
          fg: `rgb(${fgRgb.map(Math.round).join(",")})`,
          bg: `rgb(${bg.map(Math.round).join(",")})`,
          ratio,
          required: MIN_ICON,
          kind: "icon",
          element: el,
        });
      }
      continue;
    }

    if (!hasDirectText(el)) continue;
    const text = (el.textContent || "").trim();
    if (!text) continue;

    const fg = parseColor(style.color);
    if (!fg || fg[3] === 0) continue;
    const bg = effectiveBackground(el);
    const fgRgb: [number, number, number] =
      fg[3] >= 0.999 ? [fg[0], fg[1], fg[2]] : blend(fg, [...bg, 1] as any);
    const ratio = contrast(fgRgb, bg);

    const sizePx = parseFloat(style.fontSize);
    const weight = parseInt(style.fontWeight, 10) || 400;
    const isLarge = sizePx >= 24 || (sizePx >= 18.66 && weight >= 700);
    const required = isLarge ? MIN_TEXT_LARGE : MIN_TEXT_NORMAL;

    if (ratio < required) {
      issues.push({
        selector: describe(el),
        preview: text.slice(0, 60),
        fg: `rgb(${fgRgb.map(Math.round).join(",")})`,
        bg: `rgb(${bg.map(Math.round).join(",")})`,
        ratio,
        required,
        kind: "text",
        element: el,
      });
    }
  }

  // Dedupe by selector + preview
  const seen = new Set<string>();
  return issues.filter((i) => {
    const k = `${i.selector}|${i.preview}|${i.ratio.toFixed(2)}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export const ContrastChecker = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState<Element | null>(null);
  const timer = useRef<number | null>(null);

  const run = useMemo(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setIssues(scan()), 250);
    },
    [],
  );

  useEffect(() => {
    run();
    const mo = new MutationObserver(run);
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    const rootObs = new MutationObserver(run);
    rootObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => {
      mo.disconnect();
      rootObs.disconnect();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [run]);

  useEffect(() => {
    if (!hovered) return;
    const el = hovered as HTMLElement;
    const prev = el.style.outline;
    const prevOffset = el.style.outlineOffset;
    el.style.outline = "2px solid hsl(0 90% 55%)";
    el.style.outlineOffset = "2px";
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    return () => {
      el.style.outline = prev;
      el.style.outlineOffset = prevOffset;
    };
  }, [hovered]);

  const fails = issues.length;

  return (
    <div
      data-contrast-checker
      className="fixed bottom-4 right-4 z-[9999] font-mono text-xs"
      style={{ colorScheme: "light" }}
    >
      {open ? (
        <div className="w-[380px] max-h-[60vh] flex flex-col rounded-lg border border-black/20 bg-white text-black shadow-2xl">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-black/10">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: fails ? "hsl(0 80% 50%)" : "hsl(140 60% 40%)" }}
              />
              <strong>A11y contrast</strong>
              <span className="text-black/60">
                {fails === 0 ? "all good" : `${fails} issue${fails === 1 ? "" : "s"}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={run}
                className="px-2 py-0.5 rounded border border-black/20 hover:bg-black/5"
              >
                Re-scan
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-2 py-0.5 rounded border border-black/20 hover:bg-black/5"
              >
                ×
              </button>
            </div>
          </div>
          <div className="overflow-auto">
            {issues.map((i, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHovered(i.element)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setHovered(i.element)}
                className="w-full text-left px-3 py-2 border-b border-black/5 hover:bg-black/5 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{i.selector}</span>
                  <span style={{ color: "hsl(0 80% 40%)" }}>
                    {i.ratio.toFixed(2)} / {i.required}
                  </span>
                </div>
                <div className="truncate text-black/70">
                  {i.kind === "icon" ? "icon" : `"${i.preview}"`}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="inline-block w-3 h-3 rounded border border-black/20"
                    style={{ background: i.fg }}
                  />
                  <span className="text-black/60">on</span>
                  <span
                    className="inline-block w-3 h-3 rounded border border-black/20"
                    style={{ background: i.bg }}
                  />
                  <span className="text-black/50 truncate">
                    {i.fg} / {i.bg}
                  </span>
                </div>
              </button>
            ))}
            {issues.length === 0 && (
              <div className="px-3 py-6 text-center text-black/60">
                No contrast failures detected.
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-full border border-black/20 bg-white text-black shadow-lg"
        >
          A11y {fails > 0 ? `⚠ ${fails}` : "✓"}
        </button>
      )}
    </div>
  );
};

export default ContrastChecker;
