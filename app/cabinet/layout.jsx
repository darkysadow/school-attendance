import UserSidebar from "@/components/UserSidebar/UserSidebar";
import Link from "next/link";

export default function CabinetLayout({ children }) {
    const userRole = 'Teacher'

    return (
        <main className="container w-full mx-auto min-h-[82vh] flex flex-row my-4 px-5">
            <UserSidebar role={userRole} />
            <div className="">
                {children}
            </div>
        </main>
    )

}