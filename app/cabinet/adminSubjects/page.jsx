import AdminSubjectsList from "@/components/AdminSubjectsList/AdminSubjectsList";
import { fetcher } from "@/lib/api"

export default async function AdminSubjects() {
    const subjectsList = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`, {cache: 'no-store'}).then(response => response.data)
    const teachersList = await fetcher(`${process.env.STRAPI_API_URL}/teachers`, {cache: 'no-store'}).then(response => response.data)
    return(
        <div>
            <h1>Список дисциплін</h1>
            <AdminSubjectsList 
                subjectsL={subjectsList}
                teachersL={teachersList}
            />
        </div>
    )
}