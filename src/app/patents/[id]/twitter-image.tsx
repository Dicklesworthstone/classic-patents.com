import { ImageResponse } from "next/og";
import { allPatents, getPatentById } from "@/data/patents";

export const size = {
  width: 1200,
  height: 600,
};
export const contentType = "image/png";

export function generateStaticParams() {
  return allPatents.map((p) => ({ id: p.id }));
}

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
          <span
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              letterSpacing: "2px",
              color: "#f8fafc",
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
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            color: "#fbbf24",
            fontSize: "16px",
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
            fontSize: "46px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: 1.15,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "960px",
            display: "flex",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Bottom Metadata Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "20px",
          borderTop: "1px solid #334155",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
            }}
          >
            Inventors
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#f8fafc",
              display: "flex",
            }}
          >
            {inventors}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
            }}
          >
            USPTO Grant Date
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#fbbf24",
              display: "flex",
            }}
          >
            {grantDate}
          </span>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
