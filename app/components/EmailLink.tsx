"use client";

/* Renders the contact "Email" link without putting the literal address
   in static HTML or in the JS bundle as a contiguous string. The address
   is split into base64-encoded parts and assembled at runtime, so naive
   regex-based spam scrapers (the ~95% case) never see it.

   Initial SSR render: clickable element with href="#" and an inline
   handler. The handler decodes & navigates on click, so the link works
   even before hydration completes. After mount, the real `mailto:` is
   set via useEffect so right-click → "Copy link" also works. */

import { useEffect, useState } from "react";

export type EmailLinkProps = {
  /** Visible label, e.g. "Email". */
  label: string;
  /** base64 of the local-part (the bit before @). */
  user: string;
  /** base64 of the domain. */
  domain: string;
  className?: string;
  tone?: string;
};

function decode(user: string, domain: string): string {
  return `${atob(user)}@${atob(domain)}`;
}

export function EmailLink({ label, user, domain, className, tone }: EmailLinkProps) {
  const [href, setHref] = useState<string>("#");

  useEffect(() => {
    setHref(`mailto:${decode(user, domain)}`);
  }, [user, domain]);

  return (
    <a
      className={className}
      data-tone={tone}
      href={href}
      onClick={(e) => {
        if (href === "#") {
          e.preventDefault();
          window.location.href = `mailto:${decode(user, domain)}`;
        }
      }}
    >
      {label}
    </a>
  );
}
