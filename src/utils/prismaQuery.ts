export function postContainerInclude() {
    const include = {
        _count: {
            select: {
                reactions: true,
                comments: true,
            },
        },
        organization: {
            select: {
                id:true,
                name: true,
                image: true,
                username:true,
            },
        },
    }
    return include
}