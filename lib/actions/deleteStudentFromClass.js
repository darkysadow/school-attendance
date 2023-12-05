"use server"

import { fetcher } from "../api";

export default async function deleteStudentFromClass(studentId) {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/students/${studentId}?populate=*`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: {class: null}}),
        });
        const data = await response; 
        return data;
    } catch (error) {
        console.error('Помилка при відправленні PUT-запиту:', error);
        throw error;
    }
}