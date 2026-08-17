import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Classic Patents — Historical Technical Patent Museum";
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0b0f17",
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(217, 119, 6, 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)",
        padding: "50px 65px",
        border: "12px solid #d97706",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            ⚙
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#f8fafc",
            }}
          >
            CLASSIC PATENTS
          </span>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "999px",
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            color: "#fbbf24",
            fontSize: "14px",
            fontWeight: "bold",
            display: "flex",
          }}
        >
          22 HISTORICAL MILESTONES
        </div>
      </div>

      {/* Center Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: 1.15,
            margin: 0,
            display: "flex",
          }}
        >
          History&apos;s Greatest Inventions, Decoded &amp; Simulated.
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "960px",
            margin: 0,
            display: "flex",
          }}
        >
          Original USPTO patents restored with full transcripts, Plain English engineering
          breakdowns, and interactive 3D WebGL physics engines.
        </p>
      </div>

      {/* Bottom Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#1e293b",
            color: "#38bdf8",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <span>3D WebGL Simulations</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#1e293b",
            color: "#4ade80",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <span>100% Unabbreviated Transcripts</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#1e293b",
            color: "#f59e0b",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          <span>classic-patents.com</span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
