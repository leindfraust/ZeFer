import { TagRank } from "@/types/tag";
import Link from "next/link";

export default function TagContainer({ tag, usage }: TagRank) {
    return (
        <Link href={`/tag/${tag}`}>
            <button className="btn">
                # {tag} <span className="badge">{usage}</span>
            </button>
        </Link>
    );
}
