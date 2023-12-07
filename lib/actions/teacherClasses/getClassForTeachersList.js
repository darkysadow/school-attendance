"use server"

import { fetcher } from "@/lib/api";

export default async function getClassForTeachersList(classId) {
    const classData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}`)
    return classData;
}