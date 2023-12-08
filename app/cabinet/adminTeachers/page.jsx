"use client"

import AdminTeachersList from "@/components/AdminTeachersList/AdminTeachersList";
import Preloader from "@/components/Preloader/Preloader";
import getTeachersList from "@/lib/actions/admin/adminTeachers/getTeachersList";
import { authMe } from "@/lib/actions/authorisation";
import { getTokenFromLocalCookie } from "@/lib/auth";
import { useFetchUser } from "@/lib/authProvider";
import { useEffect, useState } from "react";

export default function AdminTeachers() {
    const { user, loading } = useFetchUser();
    const jwt = getTokenFromLocalCookie();
    const [role, setRole] = useState(undefined);
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const [isTeachersLoading, setIsTeachersLoading] = useState(true);
    const [teachersData, setTeachersData] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            if (user && !loading) {
                if (!role) {
                    const response = await authMe(jwt);
                    setRole(response.role.name);
                    setIsRoleLoading(false)
                } else {
                    if (role === "Administrator") {
                        if (teachersData === undefined) {
                            const serverTeachersData = await getTeachersList();
                            serverTeachersData ? setTeachersData(serverTeachersData) : setTeachersData(undefined);
                            setIsTeachersLoading(false)
                        }
                    }
                }
            }
        };

        fetchData();
    }, [user, role, loading, jwt, teachersData]);

    if (user && !loading) {
        if (role === "Administrator" && !isRoleLoading) {
            if (teachersData?.length === 0 && !isTeachersLoading) {
                return (
                    <div>Список викладачів пустий!</div>
                )
            } else if (!isTeachersLoading) {
                return (
                    <div>
                        <h1>Список викладачів:</h1>
                        <AdminTeachersList teachersD={teachersData} />
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
