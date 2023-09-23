import { StatusResponse } from "@/types/status";

export default function StautsNotif({ ok, status, statusText, message }: StatusResponse) {
    return (<>
        {!ok && typeof ok !== 'undefined' && <div className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3" role="alert">
            <p className="font-bold">{status}: {statusText}</p>
            <p className="text-sm">{message}</p>
        </div>}
    </>)

}