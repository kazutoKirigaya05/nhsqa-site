"use client";
import { useState } from "react";

export type Field = {
  name: string; label: string;
  type?: "text" | "email" | "textarea" | "select" | "checkbox";
  options?: string[]; required?: boolean; half?: boolean; hint?: string; autoComplete?: string;
};

/** Forms are not connected to a database yet. Submitting says so plainly and saves nothing. */
export function SimpleForm({ id, fields, submit, notReady }: { id: string; fields: Field[]; submit: string; notReady: string }) {
  const [tried, setTried] = useState(false);
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); setTried(true); }}>
      {fields.map((f) => {
        const fid = `${id}-${f.name}`;
        if (f.type === "checkbox") {
          return (
            <div key={f.name} className="check full">
              <input id={fid} name={f.name} type="checkbox" required={f.required} />
              <label htmlFor={fid}>{f.label}</label>
            </div>
          );
        }
        return (
          <div key={f.name} className={f.half ? "field" : "field full"}>
            <label htmlFor={fid}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={fid} name={f.name} required={f.required} />
            ) : f.type === "select" ? (
              <select id={fid} name={f.name} required={f.required} defaultValue="">
                <option value="" disabled>Choose one</option>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input id={fid} name={f.name} type={f.type ?? "text"} required={f.required} autoComplete={f.autoComplete} />
            )}
            {f.hint && <span className="hint">{f.hint}</span>}
          </div>
        );
      })}
      <div className="full stack-sm" style={{ alignItems: "flex-start" }}>
        <button type="submit" className="btn">{submit}</button>
        <div role="status">{tried && <p className="notice">{notReady} Nothing you typed was saved.</p>}</div>
      </div>
    </form>
  );
}
