import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trackingLinks, visits } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const links = await db
            .select({
                id: trackingLinks.id,
                slug: trackingLinks.slug,
                label: trackingLinks.label,
                redirectUrl: trackingLinks.redirectUrl,
                createdAt: trackingLinks.createdAt,
                visitCount: count(visits.id),
            })
            .from(trackingLinks)
            .leftJoin(visits, eq(trackingLinks.id, visits.linkId))
            .groupBy(trackingLinks.id)
            .orderBy(sql`${trackingLinks.createdAt} DESC`);

        return NextResponse.json(links);
    } catch (error) {
        console.error("[links GET] DB error:", error);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { label, redirectUrl } = await req.json();
        if (!label || !redirectUrl) {
            return NextResponse.json({ error: "label and redirectUrl are required" }, { status: 400 });
        }

        const slug = nanoid(8);
        const [result] = await db.insert(trackingLinks).values({ slug, label, redirectUrl });

        const newLink = await db.query.trackingLinks.findFirst({
            where: eq(trackingLinks.id, (result as { insertId: number }).insertId),
        });

        return NextResponse.json(newLink, { status: 201 });
    } catch (error) {
        console.error("[links POST] DB error:", error);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}
