import { Google_Sans } from "next/font/google";

/* Shared between the standalone prototypes layout and the case-study
   PrototypeEmbed wrapper — next/font dedupes identical declarations. */
export const googleSans = Google_Sans({
  variable: "--proto-font",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});
