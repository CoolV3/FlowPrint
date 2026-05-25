"use client";

import StartNewPrintComponent from "@/componens/dashboard/print/StartNewPrint";
import {useParams} from "next/navigation";


export default function PrintPage() {
    const params = useParams()
    const WorkerId = params.workerId as string

    return(
        <div className="flex items-center justify-center grow">
            <StartNewPrintComponent workerId={WorkerId}/>
        </div>
    )
}