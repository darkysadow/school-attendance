"use client"

import Preloader from "@/components/Preloader/Preloader";
import { authMe } from "@/lib/actions/authorisation";
import getClassSubjects from "@/lib/actions/journal/getClassSubjects";
import getStudentClassId from "@/lib/actions/journal/getStudentClassId";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserJournal() {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [studentId, setStudentId] = useState(undefined);
    const [classId, setClassId] = useState(undefined);
    const [subjectsList, setSubjectsList] = useState(undefined);
    const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role && !studentId) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                    setStudentId(response.childrenId);
                } else {
                    if (role === "Parent") {
                        if (!classId) {
                            const serverClassId = await getStudentClassId(studentId);
                            serverClassId ? setClassId(serverClassId) : setClassId(undefined)
                        }
                        if (subjectsList === undefined && classId !== undefined) {
                            const serverSubjectsData = await getClassSubjects(classId);
                            serverSubjectsData ? setSubjectsList(serverSubjectsData) : setSubjectsList(undefined)
                            setIsSubjectsLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, studentId, subjectsList, classId]);

    if (user && !loading) {
        if (role === "Parent" && !isRoleLoading) {
            
            if(!subjectsList && !isSubjectsLoading) {
                return(
                    <div>Дисциплін не знайдено!</div>
                )
            } else if (!isSubjectsLoading) {
                return (
                    <div className="w-full">
                        <h2 className="mx-auto text-center">Оберіть дисципліну з списку:</h2>
            
                        <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                            {subjectsList && subjectsList.map((subject) => (
                                <Link 
                                    key={subject.id} 
                                    className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                                    href={`journal/${subject.id}`}
                                    passHref
                                >
                                    {subject.attributes.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            } else {
                return <Preloader />
            }
            
        } else if (role !== "Parent" && !isRoleLoading) {
            return <div>Ви не авторизовані в профілі батьків!</div>;
        } else {
            return <Preloader />
        }
    } else if (!user && !loading){
        return <div>Ви не можете переглянути сторінку, оскільки не авторизувались!</div>;
    } else {
        return <Preloader />
    }
}

/* import { fetcher } from "@/lib/api"
import { transliterate } from "@/lib/transliteration";
import Link from "next/link";

export default async function UserJournal() {
    //HARDCODE PARAMETERS
    const classIdentifier = 1

    /******************//*
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classIdentifier}?populate=subjects`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const subjectsList = responseData.data.attributes.subjects.data;
    
    return (
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть дисципліну з списку:</h2>

            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {subjectsList.map((subject) => (
                    <Link 
                        key={subject.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`journal/${subject.id}`}
                        passHref
                    >
                        {subject.attributes.name}
                    </Link>
                ))}
            </div>
        </div>
    )
} */