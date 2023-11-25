import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { MenuItemProps } from "@/types/menu";

export default function MenuItems({
    icon,
    title,
    action,
    isActive,
}: MenuItemProps) {
    return (
        <>
            <button
                className={`btn btn-ghost ${
                    isActive && isActive() ? "btn-active" : ""
                }`}
                onClick={action}
                title={title}
            >
                <FontAwesomeIcon icon={icon as IconDefinition} />
            </button>
        </>
    );
}
