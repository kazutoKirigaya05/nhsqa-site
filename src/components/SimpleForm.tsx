"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { friendly } from "@/lib/session";

export type Field = {
  name: string; label: string;
  type?: "text" | "email" | "textarea" | "select" | "checkbox";
  options?: string[]; required?: boolean; half?: boolean; hint?: string; autoComplete?: string;
};

/** Saves a contact, sponsor or mentor form to the database. `map` says which column each field goes in. */
export function SimpleForm({ id, kind, fields, submit, map, done }: { id: string; kind: "contact" | "sponsor" | "mentor"; fields: Field[]; submit: string; map: Record<string, string>; done: string }) {
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "sent" | "error"; msg?: string }>({ kind: "idle" });

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) { setStatus({ kind: "sent" }); return; } // filled only by bots
    const row: Record<string, string> = { kind };
    for (const [field, column] of Object.entries(map)) { const v = String(f.get(field) ?? "").trim(); if (v) row[column] = v; }
    setStatus({ kind: "busy" });
    const { error } = await supabase().from("form_submissions").insert(row);
    setStatus(error ? { kind: "error", msg: friendly(error) } : { kind: "sent" });
  }

  if (status.kind === "sent") return <div className="form"><div className="full stack-sm"><h2 className="h3">Sent</h2><p>{done}</p></div></div>;
  return (
    <form className="form" onSubmit={send}>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} />
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
        <button type="submit" className="btn" disabled={status.kind === "busy"}>{status.kind === "busy" ? "Sending" : submit}</button>
        <div role="alert">{status.kind === "error" && <p className="verdict bad">{status.msg}</p>}</div>
      </div>
    </form>
  );
}
