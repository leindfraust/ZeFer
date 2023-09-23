import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
type MenuItemProps = {
    icon?: IconDefinition
    title?: string
    action?: () => boolean | undefined | void
    isActive?: () => boolean | undefined
    type?: string
}

export type { MenuItemProps }