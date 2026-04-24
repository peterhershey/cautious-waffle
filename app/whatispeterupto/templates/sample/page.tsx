import { SampleDeck } from "./SampleDeck";
import "./sample.css";

export const metadata = {
  title: "Sample presentation — What is Peter up to?",
  description:
    "One of each template, rendered with placeholder content, to see the layouts in action.",
};

export default function SamplePage() {
  return <SampleDeck />;
}
