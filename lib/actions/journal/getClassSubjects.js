"use server"

import { fetcher } from "@/lib/api"

export default async function getClassSubjects(classId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=subjects`)
    return responseData.data.attributes.subjects.data;
}