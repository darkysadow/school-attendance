"use server"

import { fetcher } from "@/lib/api"

export default async function getStudentClassId(studentId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/students/${studentId}?populate=class`)
    return responseData.data.attributes.class.data.id
}