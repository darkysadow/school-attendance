import { fetcher } from "@/lib/api";

export default async function SubjectJournal({params}) {
    //temp hardcode variables
    const childId = 1
    
    //**********************/
    const disciplineId = params.journal
   
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/marks?populate=*&filters[student][id][$eq]=${childId}&filters[subject][id][$eq]=${disciplineId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Додайте будь-які інші необхідні заголовки, наприклад, токен авторизації, якщо вони потрібні
        },
      })
    const subjectName = responseData?.data[0]?.attributes?.subject?.data?.attributes?.name
    console.log(responseData?.data[0]?.attributes?.subject);
    return (
        <div>
            Журнал з дисципліни "{subjectName}"
        </div>
    )
}