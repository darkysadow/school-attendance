import UserSidebar from "@/components/UserSidebar/UserSidebar";
import Link from "next/link";

export default function CabinetLayout({children}) {
    const userRole = 'Parent'
    switch (userRole) {
        case 'Parent':
            return (
                <main className="container w-full mx-auto min-h-[82vh] flex flex-row my-4 px-5">
                    <UserSidebar />
                    <div className="w-full">
                        {children}
                    </div>
                </main>
            )
        case 'Teacher':
            return (
                <main className="container mx-auto min-h-[82vh] flex flex-row my-4 px-5">
                    <ul>
                        <li>Класи</li>
                        <li>Дисципліни</li>
                    </ul>
                    <div >
                        {children}
                    </div>
                </main>
            )
        case 'Administration':
            return (
                <main className="container mx-auto min-h-[82vh] flex flex-row my-4 px-5">
                    <ul>
                        <li>Класи</li>
                        <li>Викладачі</li>
                        <li>Диципліни</li>
                    </ul>
                    <div >
                        {children}
                    </div>
                </main>
            )
        default:
            break;
    }
    
}