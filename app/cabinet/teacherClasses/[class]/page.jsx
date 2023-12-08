"use client"

import Preloader from "@/components/Preloader/Preloader";
import { authMe } from "@/lib/actions/authorisation";
import getClassForTeachersList from "@/lib/actions/teacherClasses/getClassForTeachersList";
import getTeacherClassSubjects from "@/lib/actions/teacherClasses/getTeacherClassSubjects";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { getNumberOfClass } from "@/lib/classNumber"
import Link from "next/link"
import { useEffect, useState } from "react";


export default function TeacherClass({params}) {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(undefined);
    const [classData, setClassData] = useState(undefined);
    const [disciplinesData, setDisciplinesData] = useState(undefined);
    const [isDisciplinesLoading, setIsDisciplinesLoading] = useState(true);
    const classId = params.class
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
                        if (disciplinesData === undefined) {
                            const serverSubjectsData = await getTeacherClassSubjects(classId, teacherId);
                            serverSubjectsData?.data ? setDisciplinesData(serverSubjectsData) : setDisciplinesData(undefined);
                            const serverClassesData = await getClassForTeachersList(classId);
                            serverClassesData?.data ? setClassData(serverClassesData) : setClassData(undefined)
                            setIsDisciplinesLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, teacherId, loading, jwt, disciplinesData]);

    if (user && !loading) {
        if (role === "Teacher" && !isRoleLoading) {
            if(disciplinesData?.data?.length === 0 && !isDisciplinesLoading) {
                return(
                    <div>Вам не призначено дисциплін!</div>
                )
            } else if(!isDisciplinesLoading) {
                return (
                    <div>
                        <h1>В класі {classData && getNumberOfClass(classData.data.attributes.admissionYear)}-{classData && classData.data.attributes.classLetter} Ви викладаєте такі дисципліни:</h1>
                        <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                            {disciplinesData && disciplinesData.data.map((item) => (
                                <Link
                                    key={item.id}
                                    className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                                    href={`/cabinet/teacherClasses/${classId}/subjects/${item.id}`}
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
