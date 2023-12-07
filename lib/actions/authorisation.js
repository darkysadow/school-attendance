"use server"
import { fetcher } from "../api"

 

export async function tryLogin (formData) {
    try {
        const response = await fetcher(
            `${process.env.STRAPI_API_URL}/auth/local`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: formData.login,
                    password: formData.password
                })
            }
        )
        const data = await response; 

        return data;
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
    
}

export async function authMeUsername(jwt) {
    try {
        return fetcher(
            `${process.env.STRAPI_API_URL}/users/me?populate=*`,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${jwt}`,
                }
            }
        ).then((data) => {
            
            return data.username;
        }).catch((error) => {
            console.error(error)
        })
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}

export async function authMeId(jwt) {
    try {
        return fetcher(
            `${process.env.STRAPI_API_URL}/users/me?populate=*`,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${jwt}`,
                }
            }
        ).then((data) => {
            return data.id;
        }).catch((error) => {
            console.error(error)
        })
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}

export async function authMe(jwt) {
    try {
        return fetcher(
            `${process.env.STRAPI_API_URL}/users/me?populate=*`,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${jwt}`,
                }
            }
        ).then((data) => {
            return data;
        }).catch((error) => {
            console.error(error)
        })
    } catch (error) {
        console.error('Помилка при відправленні POST-запиту:', error);
        throw error;
    }
}