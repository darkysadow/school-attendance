"use client"

import { useState } from "react";

const AdminClassSubjects = ({subjectsL}) => {
    const [subjectsList, setSubjectsList] = useState(subjectsL)

    return (
        <div>
            <ul className="ml-4 p-5">
                    {subjectsList.length > 0 ? subjectsList.map((subject, index) => (
                        <li 
                            key={subject.id} 
                            className="my-2"
                        >
                            {index+1}. {subject.attributes.name} <span className="text-slate-500 font-light">ID дисципліни: {subject.id}</span> <br /> <span className="text-cyan-500 ml-4"><span className="text-red-400">Викладач:</span> {subject.attributes.teacher.data.attributes.name} <span className="text-slate-500 font-light">ID викладача: {subject.attributes.teacher.data.id}</span></span>
                        </li>
                    )) : <li>Класу не призначено дисциплін!</li>}
                    
                </ul>
        </div>
    )
}

export default AdminClassSubjects;