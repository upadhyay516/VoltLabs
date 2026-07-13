import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VoltLab Builds — Turn breadboard ideas into real builds";
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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a12",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            border: "4px solid #00f0ff",
            backgroundColor: "#12121f",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              backgroundColor: "#ff2ee6",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex" }}>VOLTLAB&nbsp;</div>
          <div style={{ display: "flex", color: "#ff2ee6" }}>BUILDS</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8b8bb0",
            marginTop: 20,
          }}
        >
          Turn breadboard ideas into real builds
        </div>
      </div>
    ),
    { ...size }
  );
}
