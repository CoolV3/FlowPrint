"use client";
import { useState, useEffect } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%@#$";

export default function LetterSwapText({ label }: { label: string }) {
    const safeLabel = label || "";
    // Wir setzen den initialen State direkt auf das safeLabel
    const [displayText, setDisplayText] = useState(safeLabel);

    useEffect(() => {
        // Falls sich das Label ändert (z.B. vom Ladezustand zum echten Code),
        // starten wir die Animation neu.

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(() =>
                safeLabel
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return safeLabel[index];
                        }
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join("")
            );

            if (iteration >= safeLabel.length) {
                clearInterval(interval);
            }
            iteration += 1 / 3;
        }, 30);

        // Wichtig: Immer das Intervall aufräumen!
        return () => clearInterval(interval);
    }, [safeLabel]); // Reagiert auf Änderungen des Labels

    return (
        <span className="font-mono cursor-default">
            {displayText}
        </span>
    );
}