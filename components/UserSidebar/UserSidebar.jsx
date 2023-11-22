import Link from "next/link";

const UserSidebar = (props) => {
    const links = [
        {
            name: 'subjects',
            title: 'Предмети',
        },
        {
            name: 'journal',
            title: 'Журнал',
        },
        {
            name: 'notifications',
            title: 'Повідомлення',
        },
        {
            name: 'remarks',
            title: 'Зауваження',
        }
    ]
    return (
        <div className="flex flex-col items-start justify-start w-[200px] gap-2 border-blue-500 border-opacity-25 border-r-[0.05px] mr-3">
            {links.map((link, index) => (<Link key={index} href={`/cabinet/${link.name}`} passHref className="hover:text-blue-900 transition-all">
                {link.title}
            </Link>))}
        </div>
    )
}

export default UserSidebar;