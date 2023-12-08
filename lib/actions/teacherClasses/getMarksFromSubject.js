"use server"

import { fetcher } from "@/lib/api";

export default async function getMarksFromSubject(subjectId) {
    const marksData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[subject][id][$eq]=${subjectId}`, { cache: 'no-store' })
    return marksData;
}