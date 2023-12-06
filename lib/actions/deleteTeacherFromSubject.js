"use server"

import { fetcher } from "../api";

export default async function deleteTeacherFromSubject(teacherId, subjectId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects/${subjectId}?populate=teachers`, {cache: 'no-cache'})
    const teachersData = responseData.data.attributes.teachers.data || []
    const toDelete = { id: teacherId};
    const updatedData = {
        data: {
            teachers: [...teachersData.filter(teacher => teacher.id !== toDelete.id)]
        }
    }
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/subjects/${subjectId}?populate=teachers`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
            cache: 'no-store'
        });
        const data = await response;
        return data;
    } catch (error) {
        console.error('Помилка при відправленні PUT-запиту:', error);
        throw error;
    }
}