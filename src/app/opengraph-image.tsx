import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// Image d'aperçu des réseaux sociaux (1200×630), générée à la demande.
export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#18181b",
          color: "#fafafa",
        }}
      >
        <div style={{ fontSize: 30, color: "#818cf8", letterSpacing: 4, textTransform: "uppercase" }}>
          {site.role}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 24 }}>{site.name}</div>
        <div style={{ fontSize: 36, color: "#a1a1aa", marginTop: 32, maxWidth: 900 }}>
          Applications métiers qui tiennent en production.
        </div>
      </div>
    ),
    size
  );
}
