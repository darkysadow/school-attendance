"use server"

import { fetcher } from "@/lib/api";

export default async function getLessonsData(subjectId) {
    const lessonsData = await fetcher(`${process.env.STRAPI_API_URL}/lessons?populate=*&filters[subject][id][$eq]=${subjectId}`)
    return lessonsData;
}