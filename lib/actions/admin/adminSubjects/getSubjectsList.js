"use server"

import { fetcher } from "@/lib/api"


export default async function getSubjectsList() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`, {cache: 'no-store'})
    return responseData.data
}