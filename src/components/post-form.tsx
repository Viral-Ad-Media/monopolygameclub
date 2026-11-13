"use client";

import { useActionState } from "react";
import type { Category, Post } from "@/db/schema";
import { savePost, type FormState } from "@/app/admin/actions";
import { Field, inputCls } from "./admin-fields";

const toLocal = (d: Date | null | undefined) => (d ? new Date(d).toISOString().slice(0, 16) : "");

export function PostForm({ post, categories, images }: { post?: Post; categories: Category[]; images: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePost, undefined);
  return (
    <form action={action} className="space-y-5">
      {post && <input type="hidden" name="id" value={post.id} />}
      <Field label="Title">
        <input name="title" required defaultValue={post?.title} className={inputCls} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="URL slug" hint="leave empty to use the title">
          <input name="slug" defaultValue={post?.slug} className={inputCls} placeholder="my-new-article" />
        </Field>
        <Field label="Game">
          <select name="categoryId" defaultValue={post?.categoryId ?? ""} className={inputCls}>
            <option value="">None</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Excerpt" hint="shown on cards and in search results">
        <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={inputCls} />
      </Field>
      <Field label="Article" hint="Markdown: ## Heading, **bold**, [link](/monopoly), ![alt](/images/file.jpg), tables">
        <textarea name="body" rows={24} defaultValue={post?.body} className={`${inputCls} font-mono leading-relaxed`} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cover image" hint="/images/... or https://">
          <input name="coverImage" list="images" defaultValue={post?.coverImage ?? ""} className={inputCls} />
          <datalist id="images">{images.map((i) => <option key={i} value={i} />)}</datalist>
        </Field>
        <Field label="Cover image description (alt text)">
          <input name="coverAlt" defaultValue={post?.coverAlt} className={inputCls} />
        </Field>
      </div>
      <details className="rounded-xl border border-line bg-white p-4">
        <summary className="cursor-pointer text-sm font-semibold">SEO settings</summary>
        <div className="mt-4 space-y-4">
          <Field label="SEO title"><input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={inputCls} /></Field>
          <Field label="Meta description"><textarea name="seoDescription" rows={2} defaultValue={post?.seoDescription ?? ""} className={inputCls} /></Field>
        </div>
      </details>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Status">
          <select name="status" defaultValue={post?.status ?? "draft"} className={inputCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <Field label="Publish date" hint="UTC; future dates are scheduled">
          <input type="datetime-local" name="publishedAt" defaultValue={toLocal(post?.publishedAt)} className={inputCls} />
        </Field>
      </div>
      <div className="flex items-center gap-4">
        <button disabled={pending} className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        {state?.error && <p role="alert" className="text-sm font-semibold text-brand-dark">{state.error}</p>}
        {state?.ok && <p className="text-sm font-semibold text-green-700">{state.ok}</p>}
      </div>
    </form>
  );
}
