import AdminClassSubjects from "@/components/AdminClassSubjects/AdminClassSubjects";
import AdminStudentsList from "@/components/AdminStudentsList/AdminStudentsList";
import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber";

export default async function AdminClass({params}) {
    const classId = params.class
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=*`, {cache: 'no-store'})
    const classNumber = getNumberOfClass(responseData.data.attributes.admissionYear)
    const classLetter = responseData.data.attributes.classLetter
    const studentsList = responseData.data.attributes.students.data.slice().sort((a, b) => {
        const nameA = a.attributes.name.toLowerCase();
        const nameB = b.attributes.name.toLowerCase();
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    const subjectsList = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teachers&filters[class][id][$eq]=${classId}`).then((response) => response.data)

    return(
        <div className="w-full flex flex-col">
            <h1 className="text-xl">{classNumber}-{classLetter} клас. <span className="text-slate-500 font-light">ID: {responseData.data.id}</span></h1>
            <div className="my-5 border-b-[0.5px] border-sky-300 border-opacity-30">
                <h2>Список учнів:</h2>
                <AdminStudentsList 
                    studentsL={studentsList}  
                    nameOfClass={classNumber.toString()+"-"+classLetter}
                    classId={classId}
                />
            </div>
            <div className="my-5">
                <h2>Список дисциплін класу:</h2>
                <AdminClassSubjects subjectsL={subjectsList} />
            </div>
        </div>
    )
}