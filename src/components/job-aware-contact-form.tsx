"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact-form";

export function JobAwareContactForm() {
  const params = useSearchParams();
  const jobTitle = params.get("job")?.slice(0, 160) ?? undefined;
  return <ContactForm jobTitle={jobTitle} />;
}
