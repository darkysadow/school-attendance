const Footer = (props) => {
    return (
        <footer className="px-5">
            <div className=" border-blue-500 border-opacity-25 border-t-[0.05px]">
                <div className="container mx-auto px-5 py-4 flex flex-row-reverse justify-between items-center">
                    <div className="font-pacifico tracking-widest">
                        <span className="text-red-600">є</span>Журнал
                    </div>
                    <div className="text-slate-500 text-xs">
                    © Захищено авторським правом
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;