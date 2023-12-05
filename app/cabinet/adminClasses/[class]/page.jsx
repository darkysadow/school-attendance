import { fetcher } from "@/lib/api"
import { getNumberOfClass } from "@/lib/classNumber";

export default async function AdminClass({params}) {
    const classId = params.class
    const responseData = await fetcher(`${process.env.STRAPI_API_URL}/classes/${classId}?populate=*`)
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
    const subjectsList = await fetcher(`${process.env.STRAPI_API_URL}/subjects?populate=teacher&filters[class][id][$eq]=${classId}`).then((response) => response.data)
    
    return(
        <div className="w-full flex flex-col">
            <h1 className="text-xl">{classNumber}-{classLetter} клас. <span className="text-slate-500 font-light">ID: {responseData.data.id}</span></h1>
            <div className="my-5 border-b-[0.5px] border-sky-300 border-opacity-30">
                <h2>Список учнів:</h2>
                <ul className="ml-4 p-5">
                    {studentsList.length > 0 ? studentsList.map((student, index) => (
                        <li key={student.id}>{index+1}. {student.attributes.name} <span className="text-slate-500 font-light">ID учня: {student.id}</span></li>
                    )) : <li>Список учнів пустий!</li>}
                    
                </ul>
            </div>
            <div className="my-5">
                <h2>Список дисциплін класу:</h2>
                <ul className="ml-4 p-5">
                    {subjectsList.length > 0 ? subjectsList.map((subject, index) => (
                        <li key={subject.id}>{index+1}. {subject.attributes.name} <span className="text-slate-500 font-light">ID дисципліни: {subject.id}</span> <br /> <span className="text-cyan-500 ml-4">Викладач: {subject.attributes.teacher.data.attributes.name} <span className="text-slate-500 font-light">ID викладача: {subject.attributes.teacher.data.id}</span></span></li>
                    )) : <li>Класу не призначено дисциплін!</li>}
                    
                </ul>
            </div>
        </div>
    )
}