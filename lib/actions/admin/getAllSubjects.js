"use server"

import { fetcher } from "@/lib/api"


export default async function getAllSubjects() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`)
    return responseData.data
}