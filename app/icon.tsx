import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          background: "#0C0C0C",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E11D2E",
          fontWeight: 900,
          borderRadius: 6,
          letterSpacing: -1,
        }}
      >
        IS
      </div>
    ),
    {
      ...size,
    }
  );
}
