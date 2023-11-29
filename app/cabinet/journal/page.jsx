import { fetcher } from "@/lib/api"
import { transliterate } from "@/lib/transliteration";
import Link from "next/link";

export default async function UserJournal() {
    //HARDCODE PARAMETERS
    const classIdentifier = 1

    /******************/
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classIdentifier}?populate=subjects`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const subjectsList = responseData.data.attributes.subjects.data;
    
    return (
        <div className="w-full">
            <h2 className="mx-auto text-center">Оберіть дисципліну з списку:</h2>
            {/* <ul>
                {subjectsList.map((subject) => (
                    <li key={subject.id}>
                        {subject.attributes.name}
                    </li>
                ))}
            </ul> */}
            <div className="mx-auto py-2 px-3 flex flex-row justify-between gap-y-8 w-[50%] flex-wrap">
                {subjectsList.map((subject) => (
                    <Link 
                        key={subject.id} 
                        className="p-5 flex flex-row rounded bg-emerald-100 border border-emerald-200 hover:scale-[1.02] transition-all"
                        href={`journal/${subject.id}`}
                        passHref
                    >
                        {subject.attributes.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}