"use client"

import Preloader from "@/components/Preloader/Preloader";
import { authMe } from "@/lib/actions/authorisation";
import getTeacherSubjectClasses from "@/lib/actions/teacherClasses/getTeacherSubjectClasses";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { getNumberOfClass } from "@/lib/classNumber";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TeacherClasses({ params }) {
    const subjectId = params.subject
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(undefined);
    const [classesData, setClassesData] = useState(undefined)
    const [isClassesLoading, setIsClassesLoading] = useState(true)

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
                        if (classesData === undefined) {
                            const serverClassesData = await getTeacherSubjectClasses(subjectId, teacherId);
                            serverClassesData ? setClassesData(serverClassesData) : setClassesData(undefined);
                            setIsClassesLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, teacherId, loading, jwt, classesData]);

    if (user && !loading) {
        if (role === "Teacher" && !isRoleLoading) {
            if (classesData?.data?.length === 0 && !isClassesLoading) {
                return (
                    <div>Вам не призначено класів!</div>
                )
            } else if (!isClassesLoading) {
                return(
                    <div className="w-full">
                        <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
                        <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                            {classesData && classesData.data.map((item) => (
                                <Link 
                                    key={item.id} 
                                    className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                                    href={`/cabinet/teacherSubjects/${subjectId}/classes/${item.id}`}
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

        } else if (role !== "Teacher" && !isRoleLoading) {
            return <div>Ви не авторизовані в профілі вчителя!</div>;
        } else {
            return <Preloader />
        }
    } else if (!user && !loading) {
        return <div className="w-full text-center">Ви не можете переглянути сторінку, оскільки не авторизувались!</div>;
    } else {
        return <Preloader />
    }
}