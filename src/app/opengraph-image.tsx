import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Classic Patents — Historical Technical Patent Museum";
export const size = {
  width: 1200,
  height: 630,
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
        backgroundColor: "#fbf9f5",
        backgroundImage:
          "linear-gradient(to right, rgba(217, 119, 6, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(217, 119, 6, 0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        padding: "60px 70px",
        border: "16px solid #d97706",
        fontFamily: "serif",
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
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: "#b45309",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            ⚙
          </div>
          <span
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#2a1f18",
              display: "flex",
            }}
          >
            CLASSIC PATENTS
          </span>
        </div>

        <div
          style={{
            padding: "6px 16px",
            borderRadius: "999px",
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            color: "#92400e",
            fontSize: "16px",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          HISTORICAL TECHNICAL ARCHIVE
        </div>
      </div>

      {/* Center Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "bold",
            color: "#1c1917",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          History&apos;s Greatest Inventions,
          <br />
          Decoded &amp; Simulated.
        </h1>
        <p
          style={{
            fontSize: "22px",
            color: "#57534e",
            maxWidth: "900px",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          Verified USPTO specifications, plain-English engineering deconstructions, and interactive
          3D physics simulations.
        </p>
      </div>

      {/* Bottom Catalog Pills */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "100%",
          borderTop: "2px solid #e7e5e4",
          paddingTop: "24px",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#b45309",
            fontWeight: "bold",
          }}
        >
          Wright Flyer (US 821,393)
        </div>
        <span style={{ color: "#a8a29e" }}>•</span>
        <div
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#b45309",
            fontWeight: "bold",
          }}
        >
          Tesla AC Motor (US 381,968)
        </div>
        <span style={{ color: "#a8a29e" }}>•</span>
        <div
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#b45309",
            fontWeight: "bold",
          }}
        >
          Noyce Microchip (US 2,981,877)
        </div>
        <span style={{ color: "#a8a29e" }}>•</span>
        <div
          style={{
            fontSize: "16px",
            fontFamily: "monospace",
            color: "#78716c",
          }}
        >
          classic-patents.com
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
