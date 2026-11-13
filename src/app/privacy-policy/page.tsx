import type { Metadata } from "next";
import { Prose } from "@/components/prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${site.name} handles your information.`,
  alternates: { canonical: "/privacy-policy" },
};

const policy = `
_Last updated: 13 November 2026_

This policy explains what information ${site.name} ("we", "us") collects when you visit ${site.url.replace(/^https?:\/\//, "")}, and how we use it.

## Information we collect

**Visitors.** You can read every page on this site without creating an account. Like most websites, our hosting provider automatically records basic technical information when you visit, such as your IP address, browser type, the pages you view and the time of your visit. We use this only to keep the site secure and working.

**Editors.** People who write for the site sign in with an email address and password. We store the email address, name and a securely hashed password, and we set a cookie to keep them signed in.

## Cookies

We use a session cookie only for editors who sign in. We do not use cookies to track ordinary visitors. If we add analytics or advertising in the future, we'll update this policy and ask for consent where the law requires it.

## How we use information

We use information to run and secure the site, to fix problems and to understand which guides are useful. We do not sell your personal information.

## Third parties

The site is hosted by a cloud provider and our database is hosted by Neon. They process data on our behalf and are bound to keep it secure. Links to other websites are not covered by this policy.

## Your rights

Depending on where you live, you may have the right to access, correct or delete personal information we hold about you. To make a request, contact us using the details on this site.

## Children

This site is for general audiences. We do not knowingly collect personal information from children.

## Changes

We may update this policy from time to time. The date at the top shows when it last changed.
`;

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 font-display text-4xl">Privacy policy</h1>
      <Prose markdown={policy} />
    </div>
  );
}
