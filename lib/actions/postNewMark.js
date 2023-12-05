"use server"

import { fetcher } from "../api";

export const postNewMark = async (payload) => {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: payload}),
        });
        const data = await response; 
        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}

export const correctMark = async (markId, newValue) => {
    try {
        const response = await fetcher(`${process.env.STRAPI_API_URL}/marks/${markId}?populate=*`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: newValue}),
        });
        const data = await response; 
        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}