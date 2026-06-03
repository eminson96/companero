import "./globals.css";

export const metadata = {
  title: "Compañero · Experience Tenerife with a local",
  description: "Find your Compañero to experience Tenerife — private days with verified local companions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
