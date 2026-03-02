import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { visits, trackingLinks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const linkId = searchParams.get("link_id");

        const query = db
            .select({
                id: visits.id,
                linkId: visits.linkId,
                linkLabel: trackingLinks.label,
                linkSlug: trackingLinks.slug,
                ip: visits.ip,
                country: visits.country,
                countryCode: visits.countryCode,
                region: visits.region,
                city: visits.city,
                lat: visits.lat,
                lng: visits.lng,
                gpsLat: visits.gpsLat,
                gpsLng: visits.gpsLng,
                isp: visits.isp,
                org: visits.org,
                timezone: visits.timezone,
                deviceType: visits.deviceType,
                os: visits.os,
                browser: visits.browser,
                userAgent: visits.userAgent,
                language: visits.language,
                createdAt: visits.createdAt,
            })
            .from(visits)
            .leftJoin(trackingLinks, eq(visits.linkId, trackingLinks.id))
            .orderBy(sql`${visits.createdAt} DESC`);

        if (linkId) {
            const results = await query.where(eq(visits.linkId, parseInt(linkId)));
            return NextResponse.json(results);
        }

        const results = await query;
        return NextResponse.json(results);
    } catch (error) {
        console.error("[visits GET] DB error:", error);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}
