'use client'
import { authMe } from "@/lib/actions/authorisation";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const UserSidebar = () => {
    //const role = "Parent"
    const {user, loading} = useFetchUser()
    const jwt = getTokenFromLocalCookie()
    const [userData, setUserData] = useState(undefined)
    const [role, setRole] = useState(undefined)
    const handler = async() => {
        if(user && !loading) {
            const response = await authMe(jwt)
            setRole(response.role.name)

        }
        
    }
    useEffect(() => {
        handler()
    }, [user])
    const parentLinks = [
        {
            name: 'subjects',
            title: 'Предмети',
        },
        {
            name: 'journal',
            title: 'Журнал',
        },
        {
            name: 'notifications',
            title: 'Повідомлення',
        },
        {
            name: 'remarks',
            title: 'Зауваження',
        }
    ]

    const teacherLinks = [
        {
            name: 'teacherClasses',
            title: 'Класи',
        },
        {
            name: 'teacherSubjects',
            title: 'Дисципліни',
        },
    ]

    const adminLinks = [
        {
            name: 'adminClasses',
            title: 'Класи',
        },
        {
            name: 'adminTeachers',
            title: 'Викладачі',
        },
        {
            name: 'adminSubjects',
            title: 'Дисципліни',
        },
    ]
    const pathname = usePathname()
    const slug = pathname.substring(pathname.lastIndexOf("/") + 1);
    switch (role) {
        case 'Parent':
            return (
                <div className="flex flex-col items-start justify-start w-[200px] gap-2 border-blue-500 border-opacity-25 border-r-[0.05px] mr-3">
                    {parentLinks.map((link, index) => (<Link key={index} href={`/cabinet/${link.name}`} passHref className={link.name === slug ? "text-blue-900 hover:text-blue-500 transition-all" : "hover:text-blue-900 transition-all"}>
                        {link.title}
                    </Link>))}
                </div>
            )
        case 'Teacher':
            return (
                <div className="flex flex-col items-start justify-start w-[200px] gap-2 border-blue-500 border-opacity-25 border-r-[0.05px] mr-3">
                    {teacherLinks.map((link, index) => (<Link key={index} href={`/cabinet/${link.name}`} passHref className={link.name === slug ? "text-blue-900 hover:text-blue-500 transition-all" : "hover:text-blue-900 transition-all"}>
                        {link.title}
                    </Link>))}
                </div>
            )
        case 'Administrator':
            return (
                <div className="flex flex-col items-start justify-start w-[200px] gap-2 border-blue-500 border-opacity-25 border-r-[0.05px] mr-3">
                    {adminLinks.map((link, index) => (<Link key={index} href={`/cabinet/${link.name}`} passHref className={link.name === slug ? "text-blue-900 hover:text-blue-500 transition-all" : "hover:text-blue-900 transition-all"}>
                        {link.title}
                    </Link>))}
                </div>
            )
        default:
            break;
    }
}

export default UserSidebar;