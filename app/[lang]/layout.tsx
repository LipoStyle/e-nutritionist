import "./globals.css";

export const metadata = {
  title: "E-Nutritionist",
  description: "Online nutrition consultations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="light-mode">
      <body>{children}</body>
    </html>
  );
}
