"use client";

import {useCallback, useEffect, useState} from "react";

export default function StartNewPrintComponent({workerId}: {workerId: string}) {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<string[]>([])
    const [currentFile, setCurrentFile] = useState("")

    const fetchAllFiles = useCallback(async ()  => {

        if (!workerId || workerId == "") {
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
    }, [workerId])

    useEffect(() => {
        const loadFiles = async () => {
            await fetchAllFiles();
        };
        loadFiles()
    }, [fetchAllFiles]);

    const getChangeableFields = async () => {

        if (files.length == null) {
            return
        }

        try {
            const response = fetch(`localhost:3000/api/worker/getScadValues/${workerId}/${currentFile}` ,{
                credentials: "include",
                method: "GET"
            })
        } catch (error) {
            alert(error)
        }
    }

    return(
        <div className="flex-col flex gap-10">
            {files.length == null ? (
                <div>
                    <h1>Please upload a file first</h1>
                </div>
            ) : (
                <div className="">
                    <select className="text-white bg-gray-600" onChange={(e) => setCurrentFile(e.target.value)}>
                        <option disabled value="">Wähle ein Scad File</option>
                    {files.map((fileName, index) => (
                        <>
                            <option key={index} value={fileName}>{fileName}</option>
                        </>
                    ))}
                    </select>
                </div>
            )}


            <div>
                <p>Label1</p>
                <input placeholder="Attribut"/>
            </div>
            <button onClick={(e) => getChangeableFields()}>FetchInfos</button>

        </div>
    )
}