import AdminSubjectsList from "@/components/AdminSubjectsList/AdminSubjectsList";
import { fetcher } from "@/lib/api"

export default async function AdminSubjects() {
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers`)
    const subjectsList = responseData.data
    return(
        <div>
            <h1>Список дисциплін</h1>
            <AdminSubjectsList subjectsL={subjectsList} />
        </div>
    )
}