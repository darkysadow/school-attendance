"use server"

import { fetcher } from "@/lib/api"


export default async function getClasses() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes`)
    return responseData
}