"use client";

import {useState} from "react";

export default function StartNewPrintComponent() {
    const [loading, setLoading] = useState(false)

    return(
        <div>
            <select className="text-white bg-gray-600">
                <option disabled value="">Wähle ein Scad File</option>
                <option value="bambu_p1p">version6keychain.scad</option>
                <option value="voron_24">blumenvase.scad</option>
            </select>
        </div>
    )
}