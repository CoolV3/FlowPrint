"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";


export default function FileUploadScad({ workerId }: { workerId: string }) {

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter()

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        const ScadFileString = await file.text()

        try {
            const response = await fetch('http://localhost:3000/api/worker/uploadscad', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    scadContent: ScadFileString,
                    fileName: file.name,
                    workerId: workerId
                }),
                credentials: "include"
            });

            if (response.ok) {
                router.push(`/dashboard/workers/${workerId}/files`)
                setFile(null);
            } else {
                const errorData = await response.json()
                alert(`Upload fehlgeschlagen. ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Fehler beim Upload:", error);
        } finally {
            setUploading(false);
        }
    };

    return(
        <div className="w-full px-10 py-10 ">
            <label className="flex flex-col items-center justify-center cursor-pointer group">
                <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-900 transition-colors dark:bg-neutral-900 dark:border-neutral-700">

                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {/* Upload Icon */}
                            <svg className="w-10 h-10 mb-3 text-gray-400 group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">{file ? file.name : "Click to Upload .scad files"}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Max. 10MB</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />


                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="mt-4 bg-amber-500 hover:bg-amber-400 text-white px-6 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {uploading ? "Wird hochgeladen..." : "Upload starten"}
                        </button>
                    )}
                </div>
            </label>
        </div>
    )
}