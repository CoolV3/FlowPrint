"use client";

import {useState} from "react";


export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorText, setErrorText] = useState("")

    const LogIn = async () => {
        if (email == "" || password == "") {
            setErrorText("Please type in a Email and a Password")
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/api/auth/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                credentials: "include"
            });

            if (response.ok) {
                
                alert("Erfolgreich eingeloggt!");
                window.location.href = "/dashboard";
            } else {
                const data = await response.json();
                setErrorText(data.error || "Login fehlgeschlagen");
            }
        } catch (error) {
            setErrorText(`Server-Fehler   ${error}`);

        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen dark">
            <div className="bg-white rounded-2xl p-10 h-auto flex flex-col items-center gap-10">
                <div>
                    <h1 className="text-black text-4xl">Log In</h1>
                    <p className="text-black">To PrintFlow</p>
                </div>
                <div>
                    <p className="text-black pl-1 pb-3">Email</p>
                    <input required onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="text-black border-2 rounded-2xl p-2"/>
                </div>
                <div>
                    <p className="text-black pl-1 pb-3">Password</p>
                    <input required onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="text-black border-2 rounded-2xl p-2"/>
                </div>
                <div className="items-center justify-center flex flex-col">
                    <button onClick={() => LogIn()} className="bg-amber-500 px-15 py-3 rounded-2xl cursor-pointer transition-colors hover:bg-amber-400 duration-400">Log In</button>
                    {errorText && (
                        <p className="text-red-500 p-4">{errorText}</p>
                    )}
                </div>
            </div>
        </div>
    )
}