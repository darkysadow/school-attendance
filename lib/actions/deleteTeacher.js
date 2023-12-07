"use server"

import { fetcher } from "../api";

export const deleteTeacher = async (teacherId) => {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/teachers/${teacherId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response; 
        return data;
    } catch (error) {
        console.error('Помилка при відправленні DELETE-запиту:', error);
        throw error;
    }
}