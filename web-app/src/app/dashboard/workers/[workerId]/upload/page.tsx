"use client";

import FileUploadScad from "@/componens/dashboard/upload_scad_component";
import {useParams} from "next/navigation";

export default function WorkerUploadPage() {
    const params = useParams()
    const WorkerId = params.workerId as string

    return(
        <div>
            <FileUploadScad workerId={WorkerId}/>
        </div>
    )
}