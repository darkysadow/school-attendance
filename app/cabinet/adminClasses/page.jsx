"use client"

import Preloader from "@/components/Preloader/Preloader";
import getClasses from "@/lib/actions/admin/getClasses";
import { authMe } from "@/lib/actions/authorisation";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { getNumberOfClass } from "@/lib/classNumber";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminClasses() {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [classes, setClasses] = useState(undefined);
    const [isClassesLoading, setIsClassesLoading] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                } else {
                    if (role === "Administrator") {
                        if (classes === undefined) {
                            const serverClassesData = await getClasses();
                            serverClassesData?.data ? setClasses(serverClassesData.data) : setClasses(undefined);
                            setIsClassesLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, loading, jwt, classes]);

    if (user && !loading) {
        if (role === "Administrator" && !isRoleLoading) {
            if (classes?.length === 0 && !isClassesLoading) {
                return (
                    <div>Список класів пустий!</div>
                )
            } else if (!isClassesLoading) {
                return (
                    <div className="w-full">
                        <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
                        <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                            {classes && classes.map((item) => (
                                <Link 
                                    key={item.id} 
                                    className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                                    href={`adminClasses/${item.id}`}
                                    passHref
                                >
                                    {getNumberOfClass(item.attributes.admissionYear)}-{item.attributes.classLetter}
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            } else {
                return <Preloader />
            }

        } else if (role !== "Administrator" && !isRoleLoading) {
            return <div>Ви не авторизовані в профілі адміністратора!</div>;
        } else {
            return <Preloader />
        }
    } else if (!user && !loading) {
        return <div className="w-full text-center">Ви не можете переглянути сторінку, оскільки не авторизувались!</div>;
    } else {
        return <Preloader />
    }
}

/* import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber"
import Link from "next/link"

export default async function AdminClasses() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes`)
    const classes = responseData.data
    return (
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {classes.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`adminClasses/${item.id}`}
                        passHref
                    >
                        {getNumberOfClass(item.attributes.admissionYear)}-{item.attributes.classLetter}
                    </Link>
                ))}
            </div>
        </div>
    )
} */