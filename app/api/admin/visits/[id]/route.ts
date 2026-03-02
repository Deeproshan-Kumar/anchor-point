import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { visits, trackingLinks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const [visit] = await db
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
            referer: visits.referer,
            createdAt: visits.createdAt,
        })
        .from(visits)
        .leftJoin(trackingLinks, eq(visits.linkId, trackingLinks.id))
        .where(eq(visits.id, parseInt(id)));

    if (!visit) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(visit);
}
