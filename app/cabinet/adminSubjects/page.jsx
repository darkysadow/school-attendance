"use client"

import AdminSubjectsList from "@/components/AdminSubjectsList/AdminSubjectsList";
import Preloader from "@/components/Preloader/Preloader";
import getSubjectsList from "@/lib/actions/admin/adminSubjects/getSubjectsList";
import getTeachersList from "@/lib/actions/admin/adminSubjects/getTeachersList";
import { authMe } from "@/lib/actions/authorisation";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { useEffect, useState } from "react";

export default function AdminSubjects() {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [subjectsList, setSubjectsList] = useState(undefined);
    const [isSubjectsLoading, setIsSubjectsLoading] = useState(true);
    const [teachersList, setTeachersList] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                } else {
                    if (role === "Administrator") {
                        if (subjectsList === undefined) {
                            const serverSubjectsListData = await getSubjectsList();
                            serverSubjectsListData ? setSubjectsList(serverSubjectsListData) : setSubjectsList(undefined);
                            const serverTeachersData = await getTeachersList();
                            serverTeachersData ? setTeachersList(serverTeachersData) : setTeachersList(undefined);
                            setIsSubjectsLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, loading, jwt, subjectsList]);

    if (user && !loading) {
        if (role === "Administrator" && !isRoleLoading) {
            if (subjectsList?.length === 0 && !isSubjectsLoading) {
                return (
                    <div>Список класів пустий!</div>
                )
            } else if (!isSubjectsLoading) {
                return(
                    <div>
                        <h1>Список дисциплін</h1>
                        <AdminSubjectsList 
                            subjectsL={subjectsList}
                            teachersL={teachersList}
                        />
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

/* import AdminSubjectsList from "@/components/AdminSubjectsList/AdminSubjectsList";
import { fetcher } from "@/lib/api"

export default async function AdminSubjects() {
    const subjectsList = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`, {cache: 'no-store'}).then(response => response.data)
    const teachersList = await fetcher(`${process.env.STRAPI_API_URL}/teachers`, {cache: 'no-store'}).then(response => response.data)
    return(
        <div>
            <h1>Список дисциплін</h1>
            <AdminSubjectsList 
                subjectsL={subjectsList}
                teachersL={teachersList}
            />
        </div>
    )
} */