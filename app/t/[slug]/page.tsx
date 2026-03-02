import { db } from "@/db";
import { trackingLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { Metadata } from "next";
import TrackingClient from "./TrackingClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Please wait...",
};

export default async function TrackingPage({ params }: Props) {
  const { slug } = await params;

  // Verify slug exists
  const link = await db.query.trackingLinks.findFirst({
    where: eq(trackingLinks.slug, slug),
  });

  if (!link) notFound();

  return <TrackingClient slug={slug} />;
}
