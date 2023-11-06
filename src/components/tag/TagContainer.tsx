import { TagRank } from "@/types/tag";

export default function TagContainer({ tag, usage }: TagRank) {
    return (<button className='btn'># {tag} <span className='badge'>{usage}</span></button>)
}