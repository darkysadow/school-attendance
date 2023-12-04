
import TeacherJournal from "@/components/TeacherJournal/TeacherJournal";
import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber";

export default async function SubjectOfClass({ params }) {
    const classId = params.class
    const subjectId = params.subject
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
    const studentsList = studentsData.data.attributes.students.data

    const marksData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[subject][id][$eq]=${subjectId}`)
    
    return (
        <div>
            <h1>Журнал дисципліни "{subjectData.name}" {getNumberOfClass(classData.admissionYear)}-{classData.classLetter} класу</h1>
            <TeacherJournal 
                lessonsData={lessonsData}
                lessonsDates={lessonsDates}
                marksData={marksData}
                studentsList={studentsList}
            />
            
        </div>
    )
}