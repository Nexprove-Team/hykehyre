import { Outfit, Instrument_Serif } from "next/font/google";
import "./global.css";
import { Providers } from "@/components/providers";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fontDisplay = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

export const metadata = {
  title: "Quiet Hire — AI-Powered Recruitment",
  description:
    "Streamline your recruitment process, automate tasks, and hire top talent faster with Quiet Hire's AI-powered ATS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
