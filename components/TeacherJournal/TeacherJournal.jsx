'use client'

import { addNewLesson } from "@/lib/actions/addNewLesson";
import { correctMark, postNewMark } from "@/lib/actions/postNewMark";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/uk';
import { useEffect, useState } from "react";

const TeacherJournal = ({ lData, sList, lDates, mData, subject, journalID }) => {
    const [lessonsData, setLessonsData] = useState(lData);
    const [studentsList, setStudentsList] = useState(sList);
    const [lessonsDates, setLessonsDates] = useState(lDates);


    const [marksData, setMarksData] = useState(mData);
    const [selectedMark, setSelectedMark] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [newMarkValue, setNewMarkValue] = useState('');
    const [attendance, setAttendance] = useState('present');
    const [isAddLessonDialogOpen, setAddLessonDialogOpen] = useState(false)
    const [datePickerValue, setDatePickerValue] = useState(null)

    const handleAttendanceChange = (event) => {
        setAttendance(event.target.value);
    };

    const handleAddMark = (date, student, mark) => {
        mark ? setNewMarkValue(mark.attributes.value) : setNewMarkValue('')
        setSelectedStudent(student)
        setSelectedLesson(date)
        setSelectedMark(mark)
        setDialogOpen(true)
    }


    const saveNewMark = async () => {
        if (selectedMark === undefined) {
            const response = await postNewMark({
                value: !newMarkValue && attendance === "absent" ? "В" : newMarkValue,
                student: selectedStudent.id,
                subject: subject.id,
                lesson: lessonsData.find(item => item.attributes.lessonDate === selectedLesson).id
            })
            setMarksData(prevData => {
                const newData = { ...prevData };
                newData.data.push(response.data);
                return newData;
            })
        } else {
            await correctMark(selectedMark.id, {
                value: !newMarkValue && attendance === "absent" ? "В" : newMarkValue.toString(),
            })
            setMarksData(prevData => {
                const newData = { ...prevData };
                const markIndex = newData.data.findIndex(mark => mark.id === selectedMark.id);

                if (markIndex !== -1) {
                    newData.data[markIndex].attributes.value = newMarkValue;
                }

                return newData;
            })
        }

        setDialogOpen(false)
    }

    const closeDialog = () => {

        setSelectedLesson(null)
        setSelectedStudent(null)
        setDialogOpen(false)
    }

    const handleNewMarkChange = (e) => {
        setNewMarkValue(e.target.value)
    }

    const closeAddLessonDialog = () => {
        setAddLessonDialogOpen(false)
    }

    const addLesson = async () => {
        const inputDate = new Date(datePickerValue);

        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        const response = await addNewLesson(formattedDate, journalID, subject.id)
        setLessonsData((prevLessons) => [...prevLessons, response.data])
        setLessonsDates((prevDates) => [...prevDates, response.data.attributes.lessonDate]);
        setAddLessonDialogOpen(false)
    }

    return (
        <div className="">
            <Button className="w-[300px] m-3" onClick={() => setAddLessonDialogOpen(true)}>Додати урок +</Button>
            <table className="border border-solid border-black">
                <thead>
                    <tr>
                        <th className="border border-solid border-black min-w-[100px] p-1"></th>
                        {lessonsData.map((date, colIndex) => (
                            <th
                                key={date.attributes.lessonDate}
                                className={`border border-solid border-black p-1 text-[0.6em] hover:bg-gray-200 ${colIndex === 0 ? 'hover:bg-blue-200' : ''}`}
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
                                        onClick={() => handleAddMark(date, student, mark)}
                                    >
                                        {mark ? mark.attributes.value : ''}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Dialog open={isDialogOpen} onClose={closeDialog} className="gap-4">
                <DialogTitle>Оцінка</DialogTitle>

                <DialogContent>
                    <h3>Дисципліна: {subject.attributes.name}</h3>
                    <h3>Урок: {new Date(selectedLesson).toLocaleDateString("en-GB")}</h3>
                    <h3>Учень: {selectedStudent?.attributes.name}</h3>
                    <RadioGroup value={newMarkValue.toLowerCase() === "в" ? 'absent' : attendance} onChange={handleAttendanceChange}>
                        <FormControlLabel value="present" control={<Radio />} label="Присутн(я)ій" />
                        <FormControlLabel value="absent" control={<Radio />} label="Відсутн(я)ій" />
                    </RadioGroup>
                    <TextField
                        label="Оцінка"
                        variant="outlined"
                        value={newMarkValue}
                        onChange={handleNewMarkChange}
                        className="my-3"
                        disabled={attendance === 'absent'}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Відміна
                    </Button>
                    <Button onClick={saveNewMark} color="primary" disabled={!newMarkValue && attendance === 'present'}>
                        Виставити
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isAddLessonDialogOpen} onClose={closeAddLessonDialog} className="gap-4">
                <DialogTitle>Додати урок</DialogTitle>
                <DialogContent>
                    <h3>Дисципліна: {subject.attributes.name}</h3>
                    {/*Вибір дати уроку */}
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'uk'}>
                        <DatePicker
                            label="Controlled picker"
                            value={datePickerValue}
                            onChange={(newValue) => setDatePickerValue(newValue)}
                        />
                    </LocalizationProvider>

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddLessonDialog} color="primary">
                        Відміна
                    </Button>
                    <Button onClick={addLesson} color="primary" disabled={!datePickerValue}>
                        Додати
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TeacherJournal;