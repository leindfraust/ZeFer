type DisplayImageProps = {
    id: string
    name: string
    image: string
    session: boolean
}

type EditUserDetailsProps = {
    vanityUrl?: string
    name: string
    bio?: string
    address?: string
    occupation?: string,
    email: string
    socials?: UserSocials[]
    viewsVisibility: boolean;
}


type UserSocials = {
    name: string,
    url: string
}

export type { DisplayImageProps, EditUserDetailsProps, UserSocials }