import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { authMeId, authMeUsername } from "./actions/authorisation";

export const setToken = (data) => {
    if(typeof window === 'undefined') {
        return;
    }
    Cookies.set('id', data.user.id);
    Cookies.set('username', data.user.username);
    Cookies.set('jwt', data.jwt)
    if(Cookies.get('username') && Cookies.get('id') && Cookies.get('jwt')) {
        return true;
    }
}

export const unsetToken = () => {
    if(typeof window === 'undefined') {
        return;
    }
    Cookies.remove('id')
    Cookies.remove('username')
    Cookies.remove('jwt')
    return true;
}

export const getUserFromLocalCookie = async () => {
    const jwt = getTokenFromLocalCookie();
    
    if (jwt) {
        const response = await authMeUsername(jwt)
        return await response
    } else {
        return;
    }
}

export const getIdFromLocalCookie = async () => {
    const jwt = getTokenFromLocalCookie();
    
    if (jwt) {
        return await authMeId(jwt)
    } else {
        return;
    }
}


export const getTokenFromLocalCookie = () => {
    return Cookies.get('jwt');
}

export const getTokenFromServerCookie = (req) => {
    if(!req.headers.cookie || '') {
        return undefined;
    }
    const jwtCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('jwt='));
    if (!jwtCookie) {
        return undefined;
    }
    const jwt = jwtCookie.split('=')[1];
    return jwt;
}

export const getIdFromServerCookie = (req) => {
    if(!req.headers.cookie || '') {
        return undefined;
    }
    const idCookie = req.headers.cookie
        .split(';')
        .find((c) => c.trim().startsWith('id='));
    if (!idCookie) {
        return undefined;
    }
    const id = idCookie.split('=')[1];
    return id;
}