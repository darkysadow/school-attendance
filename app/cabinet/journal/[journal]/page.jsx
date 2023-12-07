"use client"
import Preloader from "@/components/Preloader/Preloader";
import { authMe } from "@/lib/actions/authorisation";
import getLessonsData from "@/lib/actions/journal/getLessonsData";
import getStudentMarks from "@/lib/actions/journal/getStudentMarks";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { useEffect, useState } from "react";

export default function SubjectJournal({ params }) {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [studentId, setStudentId] = useState(undefined);
    const [lessonsData, setLessonsData] = useState(undefined);
    const [subjectName, setSubjectName] = useState(undefined);
    const [marksData, setMarksData] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [isLessonsLoading, setIsLessonsLoading] = useState(true);

    const handleMarksData = async (subjectId, studentId) => {
        return await getStudentMarks(subjectId, studentId);
    };

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
                        const subjectId = params.journal;
                        if (lessonsData === undefined) {
                            const serverLessonsData = await getLessonsData(subjectId);
                            setLessonsData(serverLessonsData);
                            setIsLessonsLoading(false)
                        }
                        if (lessonsData && subjectName === undefined) {
                            lessonsData.data.length !== 0 ? 
                            setSubjectName(lessonsData.data[0].attributes.subject.data.attributes.name)
                            :
                            setSubjectName(undefined)
                        }

                        // Запит на отримання даних оцінок
                        const marksData = await handleMarksData(params.journal, studentId);
                        setMarksData(marksData)
                        
                    }
                }
            }
        };

        fetchData();
    }, [user, role, studentId, loading, jwt, params.journal, lessonsData, subjectName]);

    if (user && !loading) {
        if (role === "Parent" && !isRoleLoading) {
            const lessonsDates = lessonsData && Array.from(new Set(lessonsData.data.map(item => item.attributes.lessonDate)))
            if(!subjectName && lessonsDates?.length === 0 && !isLessonsLoading) {
                return(
                    <div>Журналу з дисципліни не знайдено!</div>
                )
            } else if (!isLessonsLoading) {
                return (
                    <div>
                        <h1>Журнал з дисципліни "{subjectName}"</h1>
                        
                        <table className="border border-solid border-black">
                            <thead>
                                <tr>
                                    <th className="border border-solid border-black min-w-[100px] p-1"></th>
                                    {lessonsDates && lessonsDates.map(date => (
                                        <th key={date} className="border border-solid border-black p-1"
                                            dangerouslySetInnerHTML={{
                                                __html: new Date(date).toLocaleDateString().replace(/\.(?=[^.]*$)/, '<br />'),
                                            }}
                                        ></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Оцінка</td>
                                    {lessonsDates && lessonsDates.map(date => {
                                        const mark = marksData && marksData.data.find(item => item.attributes.lesson.data.attributes.lessonDate === date);
                                        const isMissing = mark && mark.attributes.value.toLowerCase() === "в";
                                        const textColor = isMissing ? 'text-red-600 font-semibold' : ''
                                        return (
                                            <td key={date} className={`border border-solid border-black p-1 ${textColor}`}>
                                                {mark ? mark.attributes.value : ""}
                                            </td>);
                                    })}
                                </tr>
                            </tbody>
                        </table> 
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