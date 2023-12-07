"use server"

import { fetcher } from "@/lib/api";

export default async function getStudentMarks(subjectId, studentId) {
    const marksData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[student][id][$eq]=${studentId}&filters[subject][id][$eq]=${subjectId}`)
    return marksData;
}