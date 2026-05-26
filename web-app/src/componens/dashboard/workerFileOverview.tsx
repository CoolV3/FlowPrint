"use client";

import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import Link from "next/link";

export default function WorkerFileOverviewComponent({ workerId }: { workerId: string }) {
    const router = useRouter()
    const [files, setFiles] = useState<string[]>([])

    const fetchAllFiles = useCallback(async ()  => {

        if (!workerId || workerId == "") {
            router.push("/dashboard/workers")
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/api/worker/allScadFiles/${workerId}`, {
                method: "GET",
                credentials: "include"
            })
            const json = await response.json()

            if (response.ok) {
                setFiles(json.files?.data || [])
            } else {

            }

        } catch(error) {
            alert(`An error happend:   ${error}`)
        }
    }, [workerId, router])

    useEffect(() => {
        const loadFiles = async () => {
            await fetchAllFiles();
        };
        loadFiles()
    }, [fetchAllFiles]);



    return(
        <div className="flex items-center justify-center flex-col gap-10 pt-10">
            {files.length == 0 && (
                <div>
                    <h1 className="text-4xl ">Please upload a file First</h1>
                    <Link href={`/dashboard/workers/${workerId}/upload`} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Upload a file</Link>
                </div>
            )}
            {files.map((fileName, index) => (
                <div key={index} className="bg-amber-400 text-black rounded-2xl min-w-80 min-h-40 flex items-start flex-col p-5 w-auto">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-lg">{fileName}</h1>

                        <div className="border border-dashed bg-white rounded-2xl px-3 py-1 flex items-center justify-center gap-2 shadow-sm">
                            <span className="text-sm font-medium ">.scad</span>
                        </div>
                    </div>
                    <div className="mt-auto flex justify-center items-center w-full">
                        <Link href={`/dashboard/workers/${workerId}/files/${fileName}`} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">See More</Link>
                    </div>
                </div>
            ))}
        </div>
    )
}