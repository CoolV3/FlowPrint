"use client";

import Link from "next/link";
import {useParams} from "next/navigation";


export default function DetailedWorkerOverview() {
    const params = useParams()
    const WorkerId = params.workerId as string

    return(
        <div className="flex flex-col items-center justify-center gap-10 h-full ">
            <Link href={`/dashboard/workers/${WorkerId}/files`}  className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Files</Link>
            <Link href={`/dashboard/workers/${WorkerId}/upload`}  className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">File Upload Scad only</Link>
            <Link href={`/dashboard/workers/${WorkerId}/files`}  className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">More coming Soon</Link>
        </div>
    )
}