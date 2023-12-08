"use server"

import { fetcher } from "@/lib/api";

export default async function getTeacherSubjectClasses(subjectId, teacherId) {
    const disciplinesData = await fetcher(`${process.env.STRAPI_API_URL}/classes?populate=*filters[teachers][id][$eq]=${teacherId}}&filters[subjects][id][$eq]=${subjectId}`)
    return disciplinesData;
}