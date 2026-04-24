import OpinionsRail from "../_components/OpinionsRail";
import { getStories } from "@/lib/corpus";

type Props = { opinionIds: string[] };

export default function OpinionsBand({ opinionIds }: Props) {
  const opinions = getStories(opinionIds);
  return (
    <section
      style={{
        borderTop: "2px solid var(--ink)",
        paddingTop: 20,
        paddingBottom: 40,
        marginTop: 16,
      }}
    >
      <OpinionsRail opinions={opinions} />
    </section>
  );
}
