"use client";

import WorkerFileOverviewComponent from "@/componens/dashboard/workerFileOverview";
import {useParams} from "next/navigation";

export default function WorkerFileOverviewPage() {
    const params = useParams()
    const WorkerId = params.workerId as string

    return(
        <div>
            <WorkerFileOverviewComponent workerId={WorkerId}/>
        </div>
    )
}