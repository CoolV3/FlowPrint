"use client";

import FileDetailView from "@/componens/dashboard/fileDetailView";
import {useParams} from "next/navigation";


export default function FileDetailPage() {

    const params = useParams()
    const FileId = params.fileId as string
    const WorkerId = params.workerId as string
    return(
        <div>
            <FileDetailView fileId={FileId} workerId={WorkerId}/>
        </div>
    )
}