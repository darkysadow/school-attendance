'use client'

const TeacherJournal = ({ lessonsData, studentsList, lessonsDates, marksData }) => {
    return (
        <table className="border border-solid border-black">
            <thead>
                <tr>
                    <th className="border border-solid border-black min-w-[100px] p-1"></th>
                    {lessonsData.map((date, colIndex) => (
                        <th
                            key={date.attributes.lessonDate}
                            className={`border border-solid border-black p-1 hover:bg-gray-200 ${colIndex === 0 ? 'hover:bg-blue-200' : ''}`}
                            dangerouslySetInnerHTML={{
                                __html: new Date(date.attributes.lessonDate)
                                    .toLocaleDateString()
                                    .replace(/\.(?=[^.]*$)/, '<br />'),
                            }}
                        ></th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {studentsList.map((student, rowIndex) => (
                    <tr key={student.id} className={`hover:bg-blue-200`}>
                        <td className="border border-solid border-black min-w-[100px] p-1">
                            {student.attributes.name}
                        </td>
                        {lessonsDates.map((date, colIndex) => {
                            const mark = marksData.data.find(
                                (item) =>
                                    item.attributes.lesson.data.attributes.lessonDate === date &&
                                    item.attributes.student.data.id === student.id
                            );
                            const isMissing = mark && mark.attributes.value.toLowerCase() === 'в';
                            const textColor = isMissing ? 'text-red-600 font-semibold' : '';
                            const rowHighlight = rowIndex === 0 ? `hover:bg-blue-200` : '';
                            const colHighlight = colIndex === 0 ? 'hover:bg-blue-200' : '';

                            return (
                                <td
                                    key={date}
                                    className={`border border-solid border-black p-1 ${textColor} ${rowHighlight} ${colHighlight} hover:bg-blue-300`}
                                    
                                >
                                    {mark ? mark.attributes.value : ''}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TeacherJournal;