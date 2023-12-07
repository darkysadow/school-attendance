"use server"

import { fetcher } from "@/lib/api";

export default async function getTeacherClasses(teacherId) {
    const classesData = await fetcher(`${process.env.STRAPI_API_URL}/teachers/${teacherId}?populate=classes`)
    return classesData;
}