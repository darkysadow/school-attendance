

import UserSidebar from "@/components/UserSidebar/UserSidebar";



export default function CabinetLayout({ children }) {


    return (

        <main className="container w-full mx-auto min-h-[82vh] flex flex-row my-4 px-5">
            <UserSidebar />
            <div className="w-full">
                {children}
            </div>
        </main>

    )



}