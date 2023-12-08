"use client"

import AdminClassSubjects from "@/components/AdminClassSubjects/AdminClassSubjects";
import AdminStudentsList from "@/components/AdminStudentsList/AdminStudentsList";
import Preloader from "@/components/Preloader/Preloader";
import getAllSubjects from "@/lib/actions/admin/getAllSubjects";
import getClassWithInfo from "@/lib/actions/admin/getClassWithInfo";
import getSubjectsList from "@/lib/actions/admin/getSubjectsList";
import { authMe } from "@/lib/actions/authorisation";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { getNumberOfClass } from "@/lib/classNumber";
import { useEffect, useState } from "react";

export default function AdminClass({ params }) {
    const classId = params.class
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [responseData, setResponseData] = useState(undefined);
    const [isResponseDataLoading, setIsResponseDataLoading] = useState(true);
    const [subjectsList, setSubjectsList] = useState(undefined);
    const [allSubjects, setAllSubjects] = useState(undefined);

    const classNumber = responseData && getNumberOfClass(responseData.data.attributes.admissionYear)
    const classLetter = responseData && responseData.data.attributes.classLetter
    const studentsList = responseData && responseData.data.attributes.students.data.slice().sort((a, b) => {
        const nameA = a.attributes.name.toLowerCase();
        const nameB = b.attributes.name.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                } else {
                    if (role === "Administrator") {
                        if (responseData === undefined) {
                            const serverResponseData = await getClassWithInfo(classId);
                            serverResponseData ? setResponseData(serverResponseData) : setResponseData(undefined);
                            const serverSubjectList = await getSubjectsList(classId);
                            serverSubjectList ? setSubjectsList(serverSubjectList) : setSubjectsList(undefined);
                            const serverAllSubject = await getAllSubjects();
                            serverAllSubject ? setAllSubjects(serverAllSubject) : setAllSubjects(undefined)
                            setIsResponseDataLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, loading, jwt, responseData]);

    if (user && !loading) {
        if (role === "Administrator" && !isRoleLoading) {
            if (responseData?.data?.length === 0 && !isResponseDataLoading) {
                return (
                    <div>Список класів пустий!</div>
                )
            } else if (!isResponseDataLoading) {
                return (
                    <div className="w-full flex flex-col">
                        <h1 className="text-xl">{classNumber}-{classLetter} клас. <span className="text-slate-500 font-light">ID: {responseData.data.id}</span></h1>
                        <div className="my-5 border-b-[0.5px] border-sky-300 border-opacity-30">
                            <h2>Список учнів:</h2>
                            <AdminStudentsList
                                studentsL={studentsList}
                                nameOfClass={classNumber.toString() + "-" + classLetter}
                                classId={classId}
                            />
                        </div>
                        <div className="my-5">
                            <h2>Список дисциплін класу:</h2>
                            <AdminClassSubjects
                                subjectsL={subjectsList}
                                classId={classId}
                                classLetter={classLetter}
                                classNumber={classNumber}
                                allSubjects={allSubjects}
                            />
                        </div>
                    </div>
                )
            } else {
                return <Preloader />
            }

        } else if (role !== "Administrator" && !isRoleLoading) {
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
