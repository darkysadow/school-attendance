"use server"

import { fetcher } from "../api"

export default async function getStudentsWithoutClass() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/students?filters[class][id][$null]=true`)
        .then(response => response.data)
    return responseData
}