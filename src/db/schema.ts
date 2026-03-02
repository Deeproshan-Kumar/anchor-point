import {
    mysqlTable,
    varchar,
    text,
    int,
    double,
    timestamp,
    bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const trackingLinks = mysqlTable("tracking_links", {
    id: int("id").primaryKey().autoincrement(),
    slug: varchar("slug", { length: 32 }).notNull().unique(),
    label: varchar("label", { length: 255 }).notNull(),
    redirectUrl: text("redirect_url").notNull(),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const visits = mysqlTable("visits", {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    linkId: int("link_id").notNull(),
    ip: varchar("ip", { length: 64 }),
    country: varchar("country", { length: 100 }),
    countryCode: varchar("country_code", { length: 10 }),
    region: varchar("region", { length: 100 }),
    city: varchar("city", { length: 100 }),
    lat: double("lat"),
    lng: double("lng"),
    // GPS from browser (more accurate)
    gpsLat: double("gps_lat"),
    gpsLng: double("gps_lng"),
    isp: varchar("isp", { length: 255 }),
    org: varchar("org", { length: 255 }),
    timezone: varchar("timezone", { length: 100 }),
    // Device info
    deviceType: varchar("device_type", { length: 50 }),
    os: varchar("os", { length: 100 }),
    browser: varchar("browser", { length: 100 }),
    userAgent: text("user_agent"),
    referer: text("referer"),
    language: varchar("language", { length: 50 }),
    createdAt: timestamp("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export type TrackingLink = typeof trackingLinks.$inferSelect;
export type NewTrackingLink = typeof trackingLinks.$inferInsert;
export type Visit = typeof visits.$inferSelect;
export type NewVisit = typeof visits.$inferInsert;
