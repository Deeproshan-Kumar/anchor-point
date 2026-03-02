import { NextResponse } from "next/server";
import { db } from "@/db";
import { visits, trackingLinks } from "@/db/schema";
import { count, countDistinct, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const [totalLinks] = await db.select({ count: count() }).from(trackingLinks);
        const [totalVisits] = await db.select({ count: count() }).from(visits);
        const [uniqueIPs] = await db.select({ count: countDistinct(visits.ip) }).from(visits);
        const [uniqueCountries] = await db.select({ count: countDistinct(visits.country) }).from(visits);

        const recentVisits = await db
            .select({
                date: sql<string>`DATE(${visits.createdAt})`,
                count: count(),
            })
            .from(visits)
            .where(sql`${visits.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
            .groupBy(sql`DATE(${visits.createdAt})`)
            .orderBy(sql`DATE(${visits.createdAt}) ASC`);

        const topCountries = await db
            .select({
                country: visits.country,
                countryCode: visits.countryCode,
                count: count(),
            })
            .from(visits)
            .groupBy(visits.country, visits.countryCode)
            .orderBy(sql`count(*) DESC`)
            .limit(5);

        return NextResponse.json({
            totalLinks: totalLinks.count,
            totalVisits: totalVisits.count,
            uniqueIPs: uniqueIPs.count,
            uniqueCountries: uniqueCountries.count,
            recentVisits,
            topCountries,
        });
    } catch (error) {
        console.error("[stats] DB error:", error);
        return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }
}
