import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber"
import Link from "next/link"

export default async function TeacherClass({ params }) {
    const classId = params.class
    const teacherId = 1
    const classData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}`)
    const disciplinesData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?filters[class][id][$eq]=${classId}&filters[teacher][id][$eq]=${teacherId}`)

    return (
        <div>
            <h1>В класі {getNumberOfClass(classData.data.attributes.admissionYear)}-{classData.data.attributes.classLetter} Ви викладаєте такі дисципліни:</h1>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {disciplinesData.data.map((item) => (
                    <Link
                        key={item.id}
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`/cabinet/teacherClasses/${classId}/subjects/${item.id}`}
                        passHref
                    >
                        {item.attributes.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}