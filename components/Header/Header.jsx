
import { Button, TextField } from "@mui/material"

const Header = (props) => {

    return(
        <header className="px-5">
            <div className="container mx-auto px-5 py-4 flex flex-row justify-between items-center border-blue-500 border-opacity-25 border-b-[0.05px]">
                <div className="font-pacifico tracking-widest">
                    <span className="text-red-600">є</span>Журнал
                </div>
                <div className="flex flex-row gap-3">
                <TextField size="small" label='Логін' variant="filled" />
                <TextField type="password" size="small" label="Пароль" variant="filled"/>
                <Button variant="outlined">Увійти</Button>
                </div>
            </div>
        </header>
    )
}

export default Header