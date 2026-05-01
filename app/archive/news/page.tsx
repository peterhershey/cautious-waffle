import NewsShell from "./_components/NewsShell";
import { SiteFrame } from "../../components/SiteFrame";

export default function NewsHome() {
  return (
    <>
      <SiteFrame label="NEWS" scrambleKey="/archive/news" />
      <NewsShell />
    </>
  );
}
