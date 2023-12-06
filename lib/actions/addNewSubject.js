"use server"

import { fetcher } from "../api";

export const addNewSubject = async (subjectName) => {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: {name: subjectName} }),
        });
        const data = await response;
        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}