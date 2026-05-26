"use client";

import {useCallback, useEffect, useState} from "react";
import Image from "next/image";

export default function StartNewPrintComponent({workerId}: {workerId: string}) {

    interface ScadParameter {
        caption?: ""
        group?: string,
        initial: string,
        name: string,
        type: string
    }

    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<string[]>([])
    const [currentFile, setCurrentFile] = useState("version6fsdafs")
    const [customParameters, setCustomParameters] = useState<ScadParameter[]>([])
    const [customizedParameters, setCustomizedParameters] = useState<Record<string, string | number>>({})
    const [previewImage, setPreviewImage] = useState()

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
        if (currentFile == null) {
            return
        }

        try {
            const response = await fetch(`http://localhost:3000/api/worker/getScadValues/${workerId}/${currentFile}` ,{
                credentials: "include",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const json = await response.json()

            if (json.success && json.data) {
                setCustomParameters(json.data.parameters)

                const initials: Record<string, string | number> = {};
                json.data.parameters.forEach(p => {
                    initials[p.name] = p.initial;
                });
            }

        } catch (error) {
            alert(error)
        }
    }

    const updateValue = async (name: string, value: string | number) => {

        setCustomizedParameters(prev => ({
            ...prev,
                [name]: value
        }))
    }

    const generatePrintPreview = async () => {


        try {
            const response = await fetch(`http://localhost:3000/api/worker/generatePrintPreview` ,{
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customizedParameters: customizedParameters,
                    workerId: workerId,
                    fileName: currentFile
                })
            })

            const json = await response.json()

            if (json.success && json.data) {
                setPreviewImage(json.data)
            }

        } catch (error) {
            alert(error)
        }
    }

    return(
        <div className="flex-col flex gap-10 relative">
            <div className="flex flex-col items-center justify-center gap-10">
                {files.length == null ? (
                    <div>
                        <h1>Please upload a file first</h1>
                    </div>
                ) : (
                    <div className="">
                        <select className="text-white bg-gray-600 p-4 rounded-2xl" onChange={(e) => setCurrentFile(e.target.value)}>
                            <option disabled value="">Wähle ein Scad File</option>
                        {files.map((fileName, index) => (
                            <>
                                <option key={index} value={fileName}>{fileName}</option>
                            </>
                        ))}
                        </select>
                    </div>
                )}


                <button onClick={(e) => getChangeableFields()} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">FetchInfos</button>
            </div>

            {customParameters.length != 0 && (
                <div className="grid grid-cols-2 gap-10 items-center justify-center bg-gray-700 p-10 rounded-2xl">
                    {customParameters.map((parameter, index) => (
                        <div key={index} className="flex flex-col gap-5">
                            <p>{parameter.name.replace("_"," ")}</p>

                            {parameter.type == "number" ? (
                                <input type="number" className="border-2 rounded-2xl p-2" placeholder={parameter.initial} onChange={(e) => updateValue(parameter.name, e.target.value)}/>
                            ): (
                                <input placeholder={parameter.initial} className="border-2 rounded-2xl p-2" onChange={(e) => updateValue(parameter.name, e.target.value)}/>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {customParameters.length != 0 && (
                <div className="flex grow">
                    <button onClick={generatePrintPreview} className="grow bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Generate Preview</button>
                </div>
            )}

            {previewImage != null && (
                <div className="absolute">
                    <Image
                        src={`data:image/png;base64,${previewImage}`}
                        alt="3D Vorschau"
                        width={800} 
                        height={600}
                        unoptimized
                        className="rounded-lg"
                    />
                </div>
            )}
        </div>
    )
}