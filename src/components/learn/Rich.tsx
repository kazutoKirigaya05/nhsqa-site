import { Fragment } from "react";

/** Renders `code` and **bold** inside lesson text. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? <code key={i}>{p.slice(1, -1)}</code>
        : p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <Fragment key={i}>{p}</Fragment>)}
    </>
  );
}

export function Body({ body }: { body: string[] }) {
  return <>{body.map((b, i) => <p key={i}><Rich text={b} /></p>)}</>;
}
