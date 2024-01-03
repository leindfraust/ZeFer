import {
    faHashtag,
    faQuestion,
    faPhone,
    faEyeSlash,
    faThumbsUp,
    faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import SearchBar from "../ui/SearchBar";
import TagRankingMenu from "./TagRankingMenu";

export default function SideMenu() {
    return (
        <>
            <div className="flex justify-center lg:hidden">
                <SearchBar />
            </div>
            <ul className="menu rounded-box">
                <li>
                    <Link href={"/tag"}>
                        <FontAwesomeIcon icon={faHashtag} width={20} />
                        Tags
                    </Link>
                </li>
                <li>
                    <Link href={"/about"} className="text-sm">
                        <FontAwesomeIcon icon={faQuestion} width={20} />
                        About
                    </Link>
                </li>
                <li>
                    <Link href={"https://www.facebook.com/leindfraust/"}>
                        <FontAwesomeIcon icon={faPhone} width={20} />
                        Contact
                    </Link>
                </li>
                <div className="divider divider-vertical"></div>
                <li>
                    <Link href={"/privacy"}>
                        <FontAwesomeIcon icon={faEyeSlash} width={20} />
                        Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link href={"/coc"}>
                        <FontAwesomeIcon icon={faThumbsUp} width={20} />
                        Code of Conduct
                    </Link>
                </li>
                <li>
                    <Link href={"/terms"}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} width={20} />
                        Terms and Conditions
                    </Link>
                </li>
            </ul>
            <div className="lg:hidden mt-2">
                <TagRankingMenu />
            </div>
        </>
    );
}
