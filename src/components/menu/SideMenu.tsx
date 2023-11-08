import { faBookmark, faHashtag, faQuestion, faPhone, faEyeSlash, faThumbsUp, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import SearchBar from "../SearchBar";
import TagRankingMenu from "./TagRankingMenu";

export default function SideMenu() {
    return (<>
        <div className="flex justify-center lg:hidden">
            <SearchBar />
        </div>
        <ul className="menu rounded-box">
            <li>
                <a>
                    <FontAwesomeIcon icon={faBookmark} width={20} />
                    Bookmarks
                </a>
            </li>
            <li>
                <Link href={'/tag'}>
                    <FontAwesomeIcon icon={faHashtag} width={20} />
                    Tags
                </Link>
            </li>
            <li>
                <a className="text-sm">
                    <FontAwesomeIcon icon={faQuestion} width={20} />
                    About
                </a>
            </li>
            <li>
                <a>
                    <FontAwesomeIcon icon={faPhone} width={20} />
                    Contact
                </a>
            </li>
            <div className="divider divider-vertical"></div>
            <li>
                <a>
                    <FontAwesomeIcon icon={faEyeSlash} width={20} />
                    Privacy Policy
                </a>
            </li>
            <li>
                <a>
                    <FontAwesomeIcon icon={faThumbsUp} width={20} />
                    Code of Conduct
                </a>
            </li>
            <li>
                <a>
                    <FontAwesomeIcon icon={faMagnifyingGlass} width={20} />
                    Terms and Conditions
                </a>
            </li>
        </ul>
        <div className="lg:hidden mt-2">
            <TagRankingMenu />
        </div>
    </>)
}