/**
 * Safe fetch that always returns parsed JSON, or null on error.
 * Also handles cases where the server returns HTML (e.g. crash page)
 * instead of JSON.
 */
export async function safeFetch<T>(
    url: string,
    options?: RequestInit
): Promise<T | null> {
    try {
        const res = await fetch(url, options);
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
            console.error(`[safeFetch] Non-JSON response from ${url} (${res.status})`);
            return null;
        }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error(`[safeFetch] Error from ${url}:`, err);
            return null;
        }
        return (await res.json()) as T;
    } catch (e) {
        console.error(`[safeFetch] Fetch failed for ${url}:`, e);
        return null;
    }
}
