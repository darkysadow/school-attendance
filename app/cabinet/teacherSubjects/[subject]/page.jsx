import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber"
import Link from "next/link"

export default async function TeacherClasses({params}) {
    const subjectId = params.subject
    const teacherId = 1
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes?populate=*filters[teachers][id][$eq]=${teacherId}}&filters[subjects][id][$eq]=${subjectId}`)
    return(
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {responseData.data.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`/cabinet/teacherSubjects/${subjectId}/classes/${item.id}`}
                        passHref
                    >
                        {getNumberOfClass(item.attributes.admissionYear)}-{item.attributes.classLetter}
                    </Link>
                ))}
            </div>
        </div>
    )
}