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
                name: true,
                image: true,
            },
        },
    }
    return include
}