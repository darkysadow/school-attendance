"use server"

import { fetcher } from "@/lib/api";

export default async function getTeacherClassSubjects(classId, teacherId) {
    const disciplinesData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?filters[class][id][$eq]=${classId}&filters[teachers][id][$eq]=${teacherId}`)
    return disciplinesData;
}