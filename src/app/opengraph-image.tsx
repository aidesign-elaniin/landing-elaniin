import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Elaniin: Ejecutemos tu próximo proyecto tecnológico.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));
const display = await font("dm-sans", "dm-sans-latin-600-normal.woff");

// Module-field texture of the site: 2px squares on a 16px pitch, only on the right side.
const dots: { x: number; y: number }[] = [];
for (let c = 0; c < 30; c++) for (let r = 0; r < 40; r++) dots.push({ x: 720 + c * 16 + 7, y: r * 16 + 7 });

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#000040", fontFamily: "DM Sans" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {dots.map((d, i) => (
            <rect key={i} x={d.x} y={d.y} width="2" height="2" fill="#ffffff" opacity={Math.min(0.22, 0.03 + (d.x - 720) / 3200)} />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "76px 80px 84px", width: "100%", height: "100%", position: "relative" }}>
          <svg width="190" height="51" viewBox="0 0 281.45 75.91" fill="#ffffff">
<path d="M41.42,59.92c.48-.5.79-.85.79-.85l8.06,5.28s-.25.53-.67,1.13c-5.63,7.9-15.43,11.26-25.28,10.25-11.26-1.15-20.35-9.09-23.18-19.59-1.59-5.91-1.52-12.11.29-17.93,1.36-4.38,3.81-8.15,7.21-11.37,5.09-4.82,11.61-7.14,18.75-7.02,15.03.25,25.49,11.65,25.49,26.29,0,4.22-.07,5.79-.07,5.79H10.41c1.24,8.21,7.61,13.56,16.36,13.82,5.64.16,10.81-1.79,14.64-5.79h0ZM35.95,32.59c-3.09-1.87-6.35-2.5-10.01-2.46-7.67.09-14.12,5.52-15.17,12.83l32.43-.02c-.77-4.48-3.4-8.15-7.24-10.35Z"/><polygon points="59.63 74.76 59.61 .06 70.15 0 70.16 74.77 59.63 74.76"/><path d="M129.19,74.78h-9.73l-.13-6.07c-3.67,4.24-8.58,6.7-14.17,7.11-4.34.32-8.69-.18-12.63-1.96-7.45-3.36-12.85-9.89-14.88-17.53-1.56-5.86-1.5-12.02.21-17.81,1.47-4.98,4.25-9.38,8.25-12.88,4.99-4.36,11.08-6.27,17.78-6.01,6.11.23,11.64,2.47,15.47,7.24l.03-6.46,11.21.02v54.35h-1.4ZM115.49,61.31c2.26-2.18,3.85-4.7,4.72-7.67,1.81-6.2.67-12.65-3.33-17.71-2.78-3.52-6.81-5.6-11.36-5.99-11.37-.96-19.09,7.9-18.82,18.56.27,10.39,8.34,18.42,19.22,17.24,3.7-.4,6.93-1.87,9.57-4.42h0Z"/><path d="M160.38,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0Z"/><path d="M206.07,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37Z"/><path d="M254.15,29.59c-5.76.84-10,5.14-11.11,10.58-.46,2.26-.5,4.39-.49,6.78l.04,27.82h-10.68l-.05-54.35h10.66s.05,6.46.05,6.46c5.12-6.32,11.41-7.79,19.47-7.07,8.1.72,14.91,5.87,17.71,13.24,1.08,2.83,1.59,5.79,1.6,8.98l.1,32.76h-10.76v-29.8c0-2.36-.23-4.45-.94-6.61-2.16-6.58-8.48-9.83-15.6-8.78h0Z"/><circle cx="200.72" cy="9.03" r="5.47"/><circle cx="219.55" cy="9.03" r="5.47"/><path d="M224.9,20.4h-10.78v54.37h10.86s-.07-54.37-.07-54.37Z"/>
          </svg>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "wrap", width: 980, fontSize: 76, lineHeight: 1.05, letterSpacing: "-0.035em", color: "#ffffff", fontWeight: 600 }}>
              <span style={{ marginRight: 20 }}>Proyectos críticos merecen</span>
              <span style={{ color: "#4d75fd" }}>ingeniería de primer nivel.</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: display, style: "normal", weight: 600 },
      ],
    },
  );
}
