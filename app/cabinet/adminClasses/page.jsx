import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber"
import Link from "next/link"

export default async function AdminClasses() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes`)
    const classes = responseData.data
    return (
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {classes.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`adminClasses/${item.id}`}
                        passHref
                    >
                        {getNumberOfClass(item.attributes.admissionYear)}-{item.attributes.classLetter}
                    </Link>
                ))}
            </div>
        </div>
    )
}