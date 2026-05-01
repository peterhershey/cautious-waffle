import { Desk } from "@/components/Desk";
import { SiteFrame } from "../../components/SiteFrame";

export default function ArchiveDeskPage() {
  return (
    <>
      <SiteFrame label="DESK" scrambleKey="/archive/desk" />
      <Desk />
    </>
  );
}
