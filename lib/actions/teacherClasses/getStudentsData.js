"use server"

import { fetcher } from "@/lib/api";

export default async function getStudentsData(classId) {
    const studentsData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=students`)
    return studentsData;
}