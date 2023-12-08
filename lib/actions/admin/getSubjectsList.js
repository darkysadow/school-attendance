"use server"

import { fetcher } from "@/lib/api"


export default async function getSubjectsList(classId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers&filters[class][id][$eq]=${classId}`)
    return responseData.data
}