"use server"

import { fetcher } from "../api";

export const createNewTeacher = async (teacherName) => {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/teachers?populate=*`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: {name: teacherName}}),
        });
        const data = await response; 
        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}