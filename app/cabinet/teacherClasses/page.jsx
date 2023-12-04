import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber";
import { transliterate } from "@/lib/transliteration";
import Link from "next/link";

export default async function UserJournal() {
    //HARDCODE PARAMETERS
    const teacherId = 1

    /******************/
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/teachers/${teacherId}?populate=classes`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const classesList = responseData.data.attributes.classes.data
    console.log(classesList);
    
    return (
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть навчальний клас:</h2>
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {classesList.map((item) => (
                    <Link 
                        key={item.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`teacherClasses/${item.id}`}
                        passHref
                    >
                        {getNumberOfClass(item.attributes.admissionYear)}-{item.attributes.classLetter}
                    </Link>
                ))}
            </div>
        </div>
    )
}