"use server"

import { fetcher } from "../api";

export default async function addTeacherToSubject(teacherId, subjectId) {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects/${subjectId}?populate=teachers`, {cache: 'no-cache'})
    const teachersData = responseData.data.attributes.teachers.data || []
    const newTeacher = { id: teacherId};
    const updatedData = {
        data: {
            teachers: [...teachersData.map(teacher => ({id: teacher.id})), newTeacher]
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