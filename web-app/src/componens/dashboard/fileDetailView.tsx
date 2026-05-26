"use client";

import {useState, useEffect, useCallback} from "react";
import Link from "next/link";

export default function FileDetailView({ fileId, workerId }: { fileId: string, workerId: string }) {
    const [fileContents, setFileContents] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFileInfo = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/api/worker/detailScadFile/${workerId}/${fileId}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const responseBody = await response.json();

            if (response.ok && responseBody.success) {
                setFileContents(responseBody.data);
            } else {
                setError(responseBody.error || "Datei konnte nicht geladen werden.");
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Ein unbekannter Fehler ist aufgetreten";
            setError(`Netzwerkfehler: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [fileId, workerId]);

    useEffect(() => {
        if (fileId && workerId) {
            fetchFileInfo();
        }
    }, [fileId, workerId, fetchFileInfo]);


    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Datei-Details: {fileId}</h2>

            {isLoading && (
                <div className="animate-pulse text-amber-600">Lade Dateiinhalt vom Worker...</div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
                    <strong>Fehler:</strong> {error}
                </div>
            )}

            {fileContents !== null && (
                <div className="mt-4">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-2xl overflow-x-auto font-mono text-sm shadow-inner">
                        <code>{fileContents}</code>
                    </pre>
                    <Link href={`/dashboard/workers/${workerId}/print`} className="flex grow bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Print!</Link>
                </div>
            )}
        </div>
    );
}