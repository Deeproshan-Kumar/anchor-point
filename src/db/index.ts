import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
    connection: mysql.Pool | undefined;
};

const pool =
    globalForDb.connection ??
    mysql.createPool({
        uri: process.env.DATABASE_URL!,
        waitForConnections: true,
        connectionLimit: 10,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDb.connection = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
