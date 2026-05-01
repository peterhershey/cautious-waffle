import { SampleDeck } from "./SampleDeck";
import { SiteFrame } from "../../components/SiteFrame";
import "./sample.css";

export const metadata = {
  title: "Sample presentation — What is Peter up to?",
  description:
    "One of each template, rendered with placeholder content, to see the layouts in action.",
};

export default function SamplePage() {
  return (
    <>
      <SiteFrame label="TEMPLATES · SAMPLE" scrambleKey="/templates/sample" />
      <SampleDeck />
    </>
  );
}
