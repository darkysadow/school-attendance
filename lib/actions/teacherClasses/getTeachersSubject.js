"use server"

import { fetcher } from "@/lib/api";

export default async function getTeachersSubjects(teacherId) {
    const disciplinesData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?filters[teachers][id][$eq]=${teacherId}`)
    return disciplinesData.data
}