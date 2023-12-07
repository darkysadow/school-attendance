"use client"

import { tryLogin } from "@/lib/actions/authorisation"
import { setToken, unsetToken } from "@/lib/auth"
import { UserProvider, useFetchUser, useUser } from "@/lib/authProvider"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import Link from "next/link"
import { useState } from "react"

const Header = (props) => {
    const {user, loading} = useFetchUser()
    const [formData, setFormData] = useState({login: '', password: ''})
    const [isErrorDialogOpen, setErrorDialogOpen] = useState(false)
    const [error, setError] = useState(undefined)

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const loginError = (error) => {
        setError(error)
        setErrorDialogOpen(true)
    }

    const closeErrorDialog = () => {
        setErrorDialogOpen(false)
        setError(undefined)
        setFormData({login: '', password: ''})
    }

    const handleSubmit = async () => {
        const responseData = await tryLogin(formData)
        if(responseData.data === null) {
            loginError(responseData.error)
        } else {
            const isTokenSetted = setToken(responseData)
            if(isTokenSetted === true) {
                location.reload()
                
            }
        }
    }

    const handleLogout = () => {
        const logoutResult = unsetToken()
        if(logoutResult) {
            location.reload()
        }
    }

    return (
        <UserProvider value={{user, loading}}>
            <header className="px-5">
                <div className="container mx-auto px-5 py-4 flex flex-row justify-between items-center border-blue-500 border-opacity-25 border-b-[0.05px]">
                    <div className="font-pacifico tracking-widest">
                        <span className="text-red-600">є</span>Журнал
                    </div>
                    <div className="flex flex-row gap-3">
                    {!loading && (user ? (
                    <li className="list-none"><Link href={'/cabinet'} className="hover:text-sky-400 transition-all">Кабінет</Link></li>
                ) : (''))}
                {!loading && (user ? (
                    <li onClick={() => handleLogout()} className="hover:cursor-pointer list-none hover:text-red-400 transition-all">Logout</li>
                ) : (''))}
                {!loading && !user ? (
                    <>
                        <TextField size="small" label='Логін' variant="filled" name="login" value={formData.login} onChange={handleChange}/>
                        <TextField type="password" size="small" label="Пароль" name="password" variant="filled" value={formData.password} onChange={handleChange} />
                        <Button variant="outlined" onClick={handleSubmit}>Увійти</Button>
                    </>
                ) : ""}
                        
                    </div>
                </div>
            </header>
            <Dialog open={isErrorDialogOpen} onClose={closeErrorDialog}>
                <DialogTitle>Помилка авторизації</DialogTitle>
                <DialogContent>
                    Код помилки: {error?.status}<br/>
                    Повідомлення <p className="text-red-600">{error?.message}</p><br />
                    Введіть коректні данні!
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeErrorDialog}>
                        Закрити
                    </Button>
                </DialogActions>
            </Dialog>
        </UserProvider>
    )
}

export default Header