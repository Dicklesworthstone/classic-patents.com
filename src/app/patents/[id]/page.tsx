import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DualProjectionViewer } from "@/components/patents/DualProjectionViewer";
import { PatentHeader } from "@/components/patents/PatentHeader";
import { allPatents, getPatentById } from "@/data/patents";

interface PatentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return allPatents.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PatentPageProps): Promise<Metadata> {
  const { id } = await params;
  const patent = getPatentById(id);
  if (!patent) {
    return { title: "Patent Not Found" };
  }

  return {
    title: `${patent.shortTitle} (${patent.patentNumber}) — Plain English & Interactive Sim`,
    description: `${patent.subtitle}. ${patent.summary}`,
    openGraph: {
      title: `${patent.shortTitle} (${patent.patentNumber}) | Classic Patents`,
      description: patent.summary,
      url: `https://classic-patents.com/patents/${patent.id}`,
    },
  };
}

export default async function PatentDetailPage({ params }: PatentPageProps) {
  const { id } = await params;
  const patent = getPatentById(id);

  if (!patent) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Patent Header & Metadata Bar */}
      <PatentHeader patent={patent} />

      {/* Dual Projection Viewer (Plain English + Original Spec + Interactive Simulator) */}
      <DualProjectionViewer patent={patent} />
    </div>
  );
}
