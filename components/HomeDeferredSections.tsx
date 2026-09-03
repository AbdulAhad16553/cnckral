"use client";

import dynamic from "next/dynamic";
import AnimatedSection from "@/components/AnimatedSection";
import { NeedHelpSection } from "@/components/NeedHelpSection";

const ResourceLinks = dynamic(
  () => import("@/components/ResourceLinks").then((m) => m.ResourceLinks),
  { ssr: false }
);
const NewsletterSection = dynamic(
  () => import("@/components/NewsletterSection").then((m) => m.NewsletterSection),
  { ssr: false }
);
const AEOFAQSection = dynamic(() => import("@/components/AEOFAQSection"), {
  ssr: false,
});
const MachineInstallationGuide = dynamic(
  () => import("@/components/MachineInstallationGuide"),
  { ssr: false }
);
const RouterFittingGuide = dynamic(() => import("@/components/RouterFittingGuide"), {
  ssr: false,
});

/** Below-fold homepage sections — code-split so they don't block LCP JS. */
export function HomeDesktopDeferredSections() {
  return (
    <>
      <div className="bg-brand-tint page-container py-12 lg:py-14">
        <AnimatedSection delay={0.08}>
          <NeedHelpSection />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Resources</h2>
            <ResourceLinks />
          </div>
        </AnimatedSection>
      </div>

      <div className="page-container py-12 lg:py-14 bg-white border-b border-[var(--secondary-color)]/10 space-y-16">
        <MachineInstallationGuide showPageLink />
        <RouterFittingGuide showPageLink />
      </div>

      <AEOFAQSection />

      <div className="page-container py-12 lg:py-14">
        <NewsletterSection />
      </div>
    </>
  );
}

export function HomeMobileDeferredGuides() {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <MachineInstallationGuide compact showPageLink />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <RouterFittingGuide compact showPageLink />
      </div>
    </div>
  );
}
