"use client";
import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit, StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { r } from "@codemirror/legacy-modes/mode/r";
import type { Lang } from "@/content/lessons/types";

const theme = EditorView.theme({
  "&": { fontSize: "15px", backgroundColor: "#fff", height: "100%" },
  ".cm-content": { fontFamily: "var(--mono)", padding: "12px 0" },
  ".cm-gutters": { backgroundColor: "#f4f7fd", color: "#4d5873", border: "none", fontFamily: "var(--mono)" },
  ".cm-activeLine": { backgroundColor: "#f4f7fd" },
  ".cm-activeLineGutter": { backgroundColor: "#e6ecf8" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { overflow: "auto" },
});

/** Code editor. Remount it (change `key`) to load different code. */
export function Editor({ lang, initial, onChange, label }: { lang: Lang; initial: string; onChange: (code: string) => void; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef(onChange);
  useEffect(() => { cb.current = onChange; });

  useEffect(() => {
    const language = lang === "python" ? python() : lang === "c" ? cpp() : StreamLanguage.define(r);
    const view = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: initial,
        extensions: [
          basicSetup, keymap.of([indentWithTab]), indentUnit.of("    "), language, theme,
          EditorView.contentAttributes.of({ "aria-label": label }),
          EditorView.updateListener.of((u) => { if (u.docChanged) cb.current(u.state.doc.toString()); }),
        ],
      }),
    });
    return () => view.destroy();
    // The editor owns its text after mount; a new `key` gives a fresh one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="editor" ref={host} />;
}
