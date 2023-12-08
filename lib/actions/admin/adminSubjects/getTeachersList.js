"use server"

import { fetcher } from "@/lib/api"


export default async function getTeachersList() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/teachers`, {cache: 'no-store'})
    return responseData.data
}