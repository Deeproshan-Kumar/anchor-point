import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trackingLinks, visits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

interface IpApiResponse {
    status: string;
    country?: string;
    countryCode?: string;
    regionName?: string;
    city?: string;
    lat?: number;
    lon?: number;
    isp?: string;
    org?: string;
    timezone?: string;
    query?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { slug, gpsLat, gpsLng, language } = body;

        // Find the link
        const link = await db.query.trackingLinks.findFirst({
            where: eq(trackingLinks.slug, slug),
        });

        if (!link) {
            return NextResponse.json({ error: "Link not found" }, { status: 404 });
        }

        // Get real IP address
        const forwarded = req.headers.get("x-forwarded-for");
        let ip =
            forwarded?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        // Local IP fallback for testing
        if (ip === "127.0.0.1" || ip === "::1" || ip === "unknown") {
            try {
                const ipifyRes = await fetch("https://api.ipify.org?format=json");
                const ipifyData = await ipifyRes.json();
                if (ipifyData.ip) ip = ipifyData.ip;
            } catch (err) {
                console.error("Public IP fetch failed:", err);
            }
        }

        // Parse User-Agent
        const ua = req.headers.get("user-agent") || "";
        const uaResult = new UAParser(ua).getResult();
        const browser = `${uaResult.browser.name || "Unknown"} ${uaResult.browser.version || ""}`.trim();
        const os = `${uaResult.os.name || "Unknown"} ${uaResult.os.version || ""}`.trim();
        const deviceType = uaResult.device.type || "desktop";

        // IP geolocation (fallback location)
        let geoData: IpApiResponse = { status: "fail" };
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,lat,lon,isp,org,timezone,query`);
            geoData = await geoRes.json();
        } catch {
            // IP lookup failed, continue with nulls
        }

        // Insert visit
        await db.insert(visits).values({
            linkId: link.id,
            ip: geoData.query || ip,
            country: geoData.country || null,
            countryCode: geoData.countryCode || null,
            region: geoData.regionName || null,
            city: geoData.city || null,
            lat: geoData.lat || null,
            lng: geoData.lon || null,
            gpsLat: gpsLat || null,
            gpsLng: gpsLng || null,
            isp: geoData.isp || null,
            org: geoData.org || null,
            timezone: geoData.timezone || null,
            deviceType,
            os,
            browser,
            userAgent: ua,
            referer: req.headers.get("referer") || null,
            language: language || req.headers.get("accept-language") || null,
        });

        return NextResponse.json({ redirectUrl: link.redirectUrl });
    } catch (error) {
        console.error("Track error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
