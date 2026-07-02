import { Libre_Bodoni, Sen } from "next/font/google";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/Common/SmoothScroll/SmoothScroll";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";
import "@/styles/globals.css";

const libreBodoni = Libre_Bodoni({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

const sen = Sen({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-ui-loaded",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://cakestreats.com"),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: `${SITE_NAME} — ${SITE_TAGLINE}. Cakes, preserves, and afternoon treats.`,
  icons: {
    icon: [{ url: "/brand/logo-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${libreBodoni.variable} ${sen.variable}`}>
      <body>
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
