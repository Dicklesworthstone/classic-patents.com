import { ImageResponse } from "next/og";
import { getPatentById } from "@/data/patents";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export const runtime = "edge";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patent = getPatentById(id);

  const title = patent ? patent.shortTitle : "Classic Patent";
  const patentNumber = patent ? patent.patentNumber : "USPTO Patent";
  const inventors = patent ? patent.inventors.join(", ") : "Historical Inventor";
  const grantDate = patent ? patent.grantDate : "Historical Record";
  const subtitle = patent ? patent.subtitle : "Technical Breakthrough";

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
        border: "16px solid #b45309",
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
          <span
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#2a1f18",
              display: "flex",
            }}
          >
            CLASSIC PATENTS MUSEUM
          </span>
        </div>

        <div
          style={{
            display: "flex",
            padding: "6px 16px",
            borderRadius: "999px",
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            color: "#92400e",
            fontSize: "18px",
            fontFamily: "monospace",
            fontWeight: "bold",
          }}
        >
          {patentNumber}
        </div>
      </div>

      {/* Center Title & Subtitle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "52px",
            fontWeight: "bold",
            color: "#1c1917",
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            color: "#b45309",
            fontStyle: "italic",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Bottom Meta Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "2px solid #e7e5e4",
          paddingTop: "20px",
          fontSize: "18px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#44403c" }}>
          <span style={{ display: "flex", fontWeight: "bold", marginRight: "6px" }}>
            Inventors:
          </span>
          <span style={{ display: "flex" }}>{inventors}</span>
        </div>
        <div style={{ display: "flex", color: "#78716c" }}>
          <span style={{ display: "flex", fontWeight: "bold", marginRight: "6px" }}>Granted:</span>
          <span style={{ display: "flex" }}>{grantDate}</span>
        </div>
        <div style={{ display: "flex", color: "#b45309", fontWeight: "bold" }}>
          classic-patents.com
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
