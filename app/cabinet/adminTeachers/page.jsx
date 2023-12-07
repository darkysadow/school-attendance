import AdminTeachersList from "@/components/AdminTeachersList/AdminTeachersList"
import { fetcher } from "@/lib/api"

export default async function AdminTeachers() {
    const teachersData = await fetcher(`${process.env.STRAPI_API_URL}/teachers?populate=*`).then(response => response.data)

    return (
        <div>
            <h1>Список викладачів:</h1>
            <AdminTeachersList teachersD={teachersData} />
        </div>
    )
}