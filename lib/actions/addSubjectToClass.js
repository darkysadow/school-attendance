"use server"

import { fetcher } from "../api";

export default async function addSubjectToClass(classId, subjectId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=subjects`, {cache: 'no-store'}).then(response => response.data)
    const subjectsData = responseData.attributes.subjects.data || []
    const newSubject = { id: subjectId};
    const updatedData = {
        data: {
            subjects: [...subjectsData.map(subject => ({id: subject.id})), newSubject]
        }
    }
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=*`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
            cache: 'no-store'
        });
        const data = await fetcher (`${process.env.STRAPI_API_URL}/subjects/${subjectId}?populate=teachers&filters[class][id][$eq]=${classId}`)
        return data;
    } catch (error) {
        console.error('Помилка при відправленні PUT-запиту:', error);
        throw error;
    }
}