import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function PostContainerLoader() {
    return (
        <div className="grid grid-cols-2 mx-auto items-center p-2">
            <div className="lg:w-full space-y-4 break-words">
                <Skeleton count={3} />
            </div>
            <figure className="lg:w-1/2 w-4/5 ml-auto">
                <Skeleton height={100} />
            </figure>
        </div>
    )
}
