
import TeacherJournal from "@/components/TeacherJournal/TeacherJournal";
import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber";

export default async function SubjectOfClass({ params }) {
    const classId = params.class //1
    const subjectId = params.subject //2
    const journalData = await fetcher(`${process.env.STRAPI_API_URL}/journals?populate=*&filters[class][id][$eq]=${classId}&filters[subject][id][$eq]=${subjectId}`, {

        headers: {
            'Content-Type': 'application/json',
        },

    })
    const subjectData = journalData.data[0].attributes.subject.data.attributes
    const classData = journalData.data[0].attributes.class.data.attributes
    const lessonsData = journalData.data[0].attributes.lessons.data
    const lessonsDates = Array.from(new Set(lessonsData.map(item => item.attributes.lessonDate)))

    const studentsData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=students`)
    const studentsList = studentsData.data.attributes.students.data.slice().sort((a, b) => {
        const nameA = a.attributes.name.toLowerCase();
        const nameB = b.attributes.name.toLowerCase();
        return nameA.localeCompare(nameB);
    })

    const marksData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[subject][id][$eq]=${subjectId}`)
    
    return (
        <div>
            <h1
                className="mb-5"
            >
                Журнал дисципліни "{subjectData.name}" {getNumberOfClass(classData.admissionYear)}-{classData.classLetter} класу
            </h1>
            <TeacherJournal
                lData={lessonsData}
                lDates={lessonsDates}
                mData={marksData}
                sList={studentsList}
                subject={journalData.data[0].attributes.subject.data}
            />

        </div>
    )
}