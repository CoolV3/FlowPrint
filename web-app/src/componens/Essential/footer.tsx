import Link from "next/link";
import { MoveUpRight } from 'lucide-react';
import { SiGithub } from '@icons-pack/react-simple-icons';

export default function FooterSection() {

    const gitHubLink = "https://github.com/CoolV3"

    const links = [
        {
            title: "Home",
            href: "/#start",
        },
        {
            title: "About Me",
            href: "/about",
        },
        {
            title: "Projects",
            href: "/projects",
        },
        {
            title: "GitHub",
            href: "https://github.com/CoolV3",
        },
    ]

    return(
        <div className="bg-red-700 w-full h-full flex items-center justify-between">
            <div>
                <div className="flex items-center justify-start gap-3 px-10">
                    <Link href={gitHubLink}>
                        <SiGithub color="currentColor" size={40} className="cursor-pointer transition duration-500 hover:scale-130"/>
                    </Link>
                </div>
            </div>
            <div className="sm:pr-10 md:pr-20 lg:pr-30 xl:pr-40 grid grid-cols-2 transition-all">
                {links.map((link, index) => (
                    <Link href={link.href} key={index} className="flex items-center text-3xl group">{link.title} <MoveUpRight className="opacity-0 group-hover:opacity-100 transition-all duration-500 w-8 h-8"/></Link>
                ))}

            </div>
        </div>
    )
}