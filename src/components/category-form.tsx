"use client";

import { useActionState } from "react";
import type { Category } from "@/db/schema";
import { saveCategory, type FormState } from "@/app/admin/actions";
import { Field, inputCls } from "./admin-fields";

export function CategoryForm({ category, images }: { category: Category; images: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveCategory, undefined);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={category.id} />
      <div className="grid gap-5 sm:grid-cols-[1fr_auto_auto]">
        <Field label="Name"><input name="name" required defaultValue={category.name} className={inputCls} /></Field>
        <Field label="Colour"><input type="color" name="color" defaultValue={category.color} className="h-10 w-16 rounded border border-line" /></Field>
        <Field label="Order"><input type="number" name="sortOrder" defaultValue={category.sortOrder} className={`${inputCls} w-24`} /></Field>
      </div>
      <Field label="Tagline"><input name="tagline" defaultValue={category.tagline} className={inputCls} /></Field>
      <Field label="Meta description"><textarea name="description" rows={2} defaultValue={category.description} className={inputCls} /></Field>
      <Field label="Cover image">
        <input name="coverImage" list="images" defaultValue={category.coverImage ?? ""} className={inputCls} />
        <datalist id="images">{images.map((i) => <option key={i} value={i} />)}</datalist>
      </Field>
      <Field label="Guide" hint="Markdown">
        <textarea name="body" rows={24} defaultValue={category.body} className={`${inputCls} font-mono leading-relaxed`} />
      </Field>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-60">{pending ? "Saving…" : "Save"}</button>
        {state?.error && <p role="alert" className="text-sm font-semibold text-brand-dark">{state.error}</p>}
        {state?.ok && <p className="text-sm font-semibold text-green-700">{state.ok}</p>}
      </div>
    </form>
  );
}
