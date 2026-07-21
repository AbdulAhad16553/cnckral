import type { Metadata } from "next";
import Layout from "@/components/Layout";
import MachineInstallationGuide from "@/components/MachineInstallationGuide";
import JsonLd from "@/components/JsonLd";
import { buildMachineInstallationFaqSchema } from "@/lib/machineInstallationGuide";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CNC KRAL Machine Installation Guide | Floor Anchoring",
  description:
    "Step-by-step guide in Urdu: CNC KRAL machine ko zameen mein lagane ka tareeqa — 10 base plates, M12 expansion bolts, welding, and concrete pillars for weak floors.",
  keywords: [
    "CNC KRAL installation",
    "CNC router floor anchor",
    "router machine base plate",
    "machine zameen mein lagana",
    "CNC machine setup Pakistan",
  ],
};

export default function MachineInstallationPage() {
  return (
    <Layout>
      <JsonLd data={buildMachineInstallationFaqSchema()} />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/80">
        <div className="page-container py-10 lg:py-14 max-w-4xl">
          <nav className="breadcrumb mb-6">
            <Link href="/" className="breadcrumb-link">
              Home
            </Link>
            <span className="breadcrumb-separator">/</span>
            <Link href="/machine" className="breadcrumb-link">
              Machines
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="text-slate-900 font-medium">Installation Guide</span>
          </nav>

          <MachineInstallationGuide />
        </div>
      </div>
    </Layout>
  );
}
