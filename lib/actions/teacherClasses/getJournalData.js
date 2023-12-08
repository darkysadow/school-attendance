"use server"

import { fetcher } from "@/lib/api";

export default async function getJournalData(classId, subjectId) {
    const classesData = await fetcher(`${process.env.STRAPI_API_URL}/journals?populate=*&filters[class][id][$eq]=${classId}&filters[subject][id][$eq]=${subjectId}`)
    return classesData;
}