"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";


export default function SignupForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorText, setErrorText] = useState("")
    const router = useRouter()

    const LogIn = async () => {
        if (email == "" || password == "" || name == "") {
            setErrorText("Please type in a Email and a Password and a Name")
            return
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                // Erfolgreich registriert (Status 201)
                console.log("Registrierung erfolgreich. Du kannst dich jetzt einloggen.");
                router.push("/login")
            } else {
                // Falls ein Fehler vom Server kommt (Status 400)
                const errorData = await response.json();
                setErrorText(errorData.error || "Fehler bei der Registrierung");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setErrorText(`Ein unerwarteter Fehler ist aufgetreten. ${error}`);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen dark">
            <div className="bg-white rounded-2xl p-10 h-auto flex flex-col items-center gap-10">
                <div>
                    <h1 className="text-black text-4xl">Sign Up</h1>
                    <p className="text-black">To PrintFlow</p>
                </div>
                <div>
                    <p className="text-black pl-1 pb-3">Name</p>
                    <input required onChange={(e) => setName(e.target.value)} type="email" placeholder="Max Mustermann" className="text-black border-2 rounded-2xl p-2"/>
                </div>
                <div>
                    <p className="text-black pl-1 pb-3">Email</p>
                    <input required onChange={(e) => setEmail(e.target.value)} type="email" placeholder="hello@example.com" className="text-black border-2 rounded-2xl p-2"/>
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