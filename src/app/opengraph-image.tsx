import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Zajcon Firmy - Marketplace s.r.o.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #2d2d2d 100%)",
          padding: "80px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 40,
          }}
        >
          <div style={{ fontSize: 48, fontWeight: 800, color: "white" }}>
            Zajcon
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#b8965a",
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            Firmy
          </div>
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "white",
            letterSpacing: -2,
          }}
        >
          Hotové firmy
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "white",
            letterSpacing: -2,
            display: "flex",
          }}
        >
          k <span style={{ color: "#b8965a", fontStyle: "italic", marginLeft: 16 }}>okamžitému</span>
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1.05,
            color: "white",
            letterSpacing: -2,
          }}
        >
          převzetí
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            fontSize: 24,
            color: "#9a9a9a",
          }}
        >
          firmy.zajcon.cz
        </div>
      </div>
    ),
    { ...size }
  );
}
