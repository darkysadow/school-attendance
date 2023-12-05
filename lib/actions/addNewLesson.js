"use server"

import { fetcher } from "../api";

export const addNewLesson = async (date, journal, subject) => {
    
    const reqBody = {
        lessonDate: date,
        journal: {
            id: journal
        },
        subject: {
            id: subject
        }
    }
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/lessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: reqBody }),
        });
        const data = await response;
        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}