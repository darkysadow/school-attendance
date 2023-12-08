"use client"

import Preloader from "@/components/Preloader/Preloader"
import TeacherJournal from "@/components/TeacherJournal/TeacherJournal";
import { authMe } from "@/lib/actions/authorisation";
import getJournalData from "@/lib/actions/teacherClasses/getJournalData";
import getMarksFromSubject from "@/lib/actions/teacherClasses/getMarksFromSubject";
import getStudentsData from "@/lib/actions/teacherClasses/getStudentsData";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { getNumberOfClass } from "@/lib/classNumber";
import { useEffect, useState } from "react";

export default function SubjectOfClass({params}) {
    const classId = params.class
    const subjectId = params.subject
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [journalData, setJournalData] = useState(undefined);
    const [isJournalLoading, setIsJournalLoading] = useState(true)
    const [studentsData, setStudentsData] = useState(undefined);
    const [isStudentsDataLoading, setIsStudentsDataLoading] = useState(true);
    const [marksData, setMarksData] = useState(undefined)


    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                } else {
                    if (role === "Teacher") {
                        if (journalData === undefined) {
                            const serverJournalData = await getJournalData(classId, subjectId);
                            serverJournalData?.data ? setJournalData(serverJournalData) : setJournalData(undefined);
                            const serverStudentsData = await getStudentsData(classId);
                            serverStudentsData?.data ? setStudentsData(serverStudentsData) : setStudentsData(undefined);
                            const serverMarksData = await getMarksFromSubject(subjectId);
                            serverMarksData?.data ? setMarksData(serverMarksData) : setMarksData(undefined)
                            setIsStudentsDataLoading(false)
                            setIsJournalLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, loading, jwt, journalData]);

    const subjectData = (journalData && !isJournalLoading) && journalData?.data[0]?.attributes?.subject?.data?.attributes
    const classData = (journalData && !isJournalLoading)  && journalData?.data[0]?.attributes?.class?.data?.attributes
    const lessonsData = (journalData && !isJournalLoading)  && journalData?.data[0]?.attributes?.lessons?.data
    const lessonsDates = lessonsData && Array.from(new Set(lessonsData.map(item => item.attributes.lessonDate)))
    const studentsList = (studentsData && !isStudentsDataLoading) && studentsData?.data?.attributes?.students?.data?.slice().sort((a, b) => {
        const nameA = a.attributes.name.toLowerCase();
        const nameB = b.attributes.name.toLowerCase();
        return nameA.localeCompare(nameB);
    })

    if (user && !loading) {
        if (role === "Teacher" && !isRoleLoading) {
            if(journalData?.data?.length === 0 && !isJournalLoading) {
                return(
                    <div>Журналу по дисципліні не створено!</div>
                )
            } else if(!isJournalLoading) {
                return (
                    <div className="w-full">
                        <h1
                            className="mb-5"
                        >
                            Журнал дисципліни "{subjectData && subjectData?.name}" {getNumberOfClass(classData && classData?.admissionYear)}-{classData && classData?.classLetter} класу
                        </h1>
                        <TeacherJournal
                            lData={lessonsData}
                            lDates={lessonsDates}
                            mData={marksData}
                            sList={studentsList}
                            subject={journalData && journalData?.data[0]?.attributes?.subject?.data}
                            journalID={journalData && journalData?.data[0]?.id}
                        />
            
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
