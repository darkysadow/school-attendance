import { fetcher } from "@/lib/api";

export default async function SubjectJournal({ params }) {
    const studentId = 1
    const subjectId = params.journal
    const lessonsData = await fetcher(`${process.env.STRAPI_API_URL}/lessons?populate=*&filters[subject][id][$eq]=${subjectId}`)
    const subjectName = lessonsData.data[0].attributes.subject.data.attributes.name
    const lessonsDates = Array.from(new Set(lessonsData.data.map(item => item.attributes.lessonDate)))
    const marksData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[student][id][$eq]=${studentId}&filters[subject][id][$eq]=${subjectId}`)
    //console.log(marksData.data[0].attributes.lesson.data.attributes.lessonDate === lessonsDates[0]);
    //console.log(lessonsDates);
    //console.log(marksData.data.find(item => item.attributes.lesson.data.attributes.lessonDate === lessonsDates[0]))
    if (!subjectName) {
        return (
            <div>
                Журналу по дисципліні не знайдено!
            </div>
        )
    } else {
        return (
            <div>
                <h1>Журнал з дисципліни "{subjectName}"</h1>
                <table className="border border-solid border-black">
                    <thead>
                        <tr>
                            <th className="border border-solid border-black min-w-[100px] p-1"></th>
                            {lessonsDates.map(date => (
                                <th key={date} className="border border-solid border-black p-1"
                                    dangerouslySetInnerHTML={{
                                        __html: new Date(date).toLocaleDateString().replace(/\.(?=[^.]*$)/, '<br />'),
                                    }}
                                ></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Оцінка</td>
                            {lessonsDates.map(date => {
                                console.log(date)
                                const mark = marksData.data.find(item => item.attributes.lesson.data.attributes.lessonDate === date);
                                console.log(mark);
                                const isMissing = mark && mark.attributes.value.toLowerCase() === "в";
                                const textColor = isMissing ? 'text-red-600 font-semibold' : ''
                                return (
                                    <td key={date} className={`border border-solid border-black p-1 ${textColor}`}>
                                        {mark ? mark.attributes.value : ""}
                                    </td>);
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}