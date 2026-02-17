export const metadata = {
  title: "CommerceFlow | ร้านอุปกรณ์มือถือ",
  description: "เว็บขายอุปกรณ์มือถือ + หลังบ้าน + Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
