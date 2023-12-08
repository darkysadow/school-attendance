"use client"

import Preloader from "@/components/Preloader/Preloader";
import { authMe } from "@/lib/actions/authorisation";
import getTeachersSubjects from "@/lib/actions/teacherClasses/getTeachersSubject";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeacherSubjects() {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(undefined);
    const [subjectsData, setSubjectsData] = useState(undefined);
    const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role && !teacherId) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                    setTeacherId(response.teacherId);
                } else {
                    if (role === "Teacher") {
                        if (subjectsData === undefined) {
                            const serverSubjectsData = await getTeachersSubjects(teacherId);
                            serverSubjectsData ? setSubjectsData(serverSubjectsData) : setSubjectsData(undefined);
                            setIsSubjectsLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, teacherId, loading, jwt, subjectsData]);
    if (user && !loading) {
        if (role === "Teacher" && !isRoleLoading) {
            if(subjectsData?.data?.length === 0 && !isSubjectsLoading) {
                return(
                    <div>Вам не призначено дисциплін!</div>
                )
            } else if(!isSubjectsLoading) {
                return(
                    <div className="w-full">
                        <h2 className="mx-auto text-center">Оберіть дисципліну яку ви викладаєте:</h2>
                        <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                            {subjectsData && subjectsData.map((item) => (
                                <Link 
                                    key={item.id} 
                                    className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                                    href={`teacherSubjects/${item.id}`}
                                    passHref
                                >
                                    {item.attributes.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            } else {
                return <Preloader />
            }
            
        } else if (role !== "Teacher" && !isRoleLoading) {
            return <div>Ви не авторизовані в профілі вчителя!</div>;
        } else {
            return <Preloader />
        }
    } else if (!user && !loading){
        return <div className="w-full text-center">Ви не можете переглянути сторінку, оскільки не авторизувались!</div>;
    } else {
        return <Preloader />
    }
}

/* import { fetcher } from "@/lib/api";
import Link from "next/link";

export default async function TeacherSubjects() {
    //HARDCODE PARAMETERS
    const teacherId = 1

    /******************//*
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?filters[teacher][id][$eq]=${teacherId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const subjectsList = responseData.data
    return(
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть дисципліну яку ви викладаєте:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {subjectsList.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`teacherSubjects/${item.id}`}
                        passHref
                    >
                        {item.attributes.name}
                    </Link>
                ))}
            </div>
        </div>
    )
} */