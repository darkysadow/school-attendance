import UserSidebar from "@/components/UserSidebar/UserSidebar";
import Link from "next/link";

export default function CabinetLayout({children}) {
    
    return (
        <main className="container mx-auto min-h-[82vh] flex flex-row my-4 px-5">
            <UserSidebar />
            <div >
                {children}
            </div>
        </main>
    )
}