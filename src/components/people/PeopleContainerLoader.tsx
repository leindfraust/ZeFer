import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function PeopleContainerLoader() {
    return (
        <div className="flex justify-center items-center gap-2">
            <div className="w-16 lg:w-[4.3rem] rounded-full">
                <Skeleton circle height={62} />
            </div>
            <div className="container">
                <Skeleton count={2} width={250} />
            </div>
        </div>
    )
}
