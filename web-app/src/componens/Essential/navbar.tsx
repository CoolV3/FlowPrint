"use client";

import { Menu } from 'lucide-react';
import Link from "next/link";
import { MoveUpRight, X } from 'lucide-react';
import {useState} from "react";
import Image from "next/image";

export default function NavBar() {

    const [menuOpen, setMenuOpen] = useState(false)
    const links = [
        {
            title: "About Me",
            href: "/about"
        },
        {
            title: "My Projects",
            href: "/projects"
        },
        {
            title: "Dashboard",
            href: "/dashboard"
        },
    ]

    return(
        <div className="relative h-full w-full bg-linear-to-r from-indigo-700 via-purple-900 to accent-pink-800 animate-nav-gradient justify-between flex ">


            <div className="flex items-center">
                <Link className="cursor-pointer pt-3" href="/">{<Image priority src={"/FlowPrintLogo.png"} alt={"Flow Print Logo"} width={200} height={200}/>}</Link>
            </div>
            <div className="md:flex items-center pr-10 gap-5 hidden">
                {links.map((link, index) =>(
                    <Link key={index} href={link.href} className="flex py-3 px-5 rounded-2xl transition bg-white text-black group">{link.title} <MoveUpRight className="w-0 overflow-hidden group-hover:w-5 group-hover:ml-1 transition-all duration-500 text-black "/> </Link>
                ))}
            </div>


            {/* Mobile Menu*/}

            {!menuOpen && (
                <div className="flex md:hidden items-center pr-5">
                    <Menu onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer size-8 hover:text-yellow-500 hover:size-10 transition-all duration-500"/>
                </div>
            )}

            {menuOpen && (
                <div className="flex flex-col ease-in-out absolute backdrop-blur-md bg-black/30 h-screen right-0 items-start justify-start z-50 w-64 ">
                    <div className="flex justify-end w-full pr-6 pt-6">
                        <X className="cursor-pointer size-8 hover:text-red-600 hover:size-10 transition-all duration-500" onClick={() => setMenuOpen(false)} />
                    </div>
                    <div className="w-full flex flex-col  items-center gap-5 pt-40">
                        {links.map((link, index) =>(
                            <Link key={index} href={link.href} onClick={() => setMenuOpen(false)} className="flex py-3 px-5 rounded-2xl transition bg-white text-black group items-center">{link.title} <MoveUpRight className="w-0 overflow-hidden group-hover:w-5 group-hover:ml-1 transition-all duration-500 text-black "/> </Link>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )

}