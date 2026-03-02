import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trackingLinks, visits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const linkId = parseInt(id, 10);

    await db.delete(visits).where(eq(visits.linkId, linkId));
    await db.delete(trackingLinks).where(eq(trackingLinks.id, linkId));

    return NextResponse.json({ success: true });
}
