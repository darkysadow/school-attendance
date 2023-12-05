import { fetcher } from "@/lib/api";
import Link from "next/link";

export default async function TeacherSubjects() {
    //HARDCODE PARAMETERS
    const teacherId = 1

    /******************/
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?filters[teacher][id][$eq]=${teacherId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const subjectsList = responseData.data
    return(
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть дисципліну яку ви викладаєте:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {subjectsList.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`teacherSubjects/${item.id}`}
                        passHref
                    >
                        {item.attributes.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}