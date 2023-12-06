"use client"

import addSubjectToClass from "@/lib/actions/addSubjectToClass";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const AdminClassSubjects = ({ subjectsL, classId, classLetter, classNumber, allSubjects }) => {
    const [subjectsList, setSubjectsList] = useState(subjectsL)
    const [isAddDialogOpen, setAddDialogOpen] = useState(false)
    const [restSubjectsList, setRestSubjectsList] = useState(allSubjects)
    const [subjectSelectedToAdd, setSubjectSelectedToAdd] = useState('')

    useEffect(() => {
        const subjectsIds = subjectsList.map(subject => subject.id);
        const filteredRestSubjectsList = restSubjectsList.filter(subject => !subjectsIds.includes(subject.id));
        setRestSubjectsList(filteredRestSubjectsList);
    }, [subjectsList]);

    const closeAddDialog = () => {
        setSubjectSelectedToAdd('')
        setAddDialogOpen(false)
    }

    const handleOpenAddDialog = () => {
        setAddDialogOpen(true)
    }

    const handleAddSubject = async () => {
        const responseData = await addSubjectToClass(classId, subjectSelectedToAdd.id)

        setSubjectsList(prevData => [...prevData, responseData.data])
        
        closeAddDialog()
    }

    return (
        <div>
            <ul className="ml-4 p-5">
                {subjectsList.length > 0 ? subjectsList.map((subject, index) => (
                    <li
                        key={subject.id}
                        className="my-2"
                    >
                        {index + 1}. {subject.attributes.name} <span className="text-slate-500 font-light">ID дисципліни: {subject.id}</span> <br /> <span className="text-cyan-500 ml-4"><span className="text-red-400">{subject.attributes.teachers.data.length > 1 ? 'Викладачі' : 'Викладач'}</span> {subject.attributes.teachers.data.map(teacher => (<div key={teacher.id} className="ml-5">{teacher.attributes.name} <span className="text-slate-500 font-light">ID викладача: {teacher?.id}</span><br /></div>))} </span>
                    </li>
                )) : <li>Класу не призначено дисциплін!</li>}
                <Button onClick={() => handleOpenAddDialog()}>Додати дисципліну +</Button>
            </ul>
            <Dialog open={isAddDialogOpen} onClose={closeAddDialog}>
                <DialogTitle>Додати дисципліну</DialogTitle>
                <DialogContent>
                    Клас: {classNumber}-{classLetter} <span className="text-slate-500 font-light">ID: {classId}</span>
                </DialogContent>
                <FormControl fullWidth className="my-2">
                    <InputLabel id="select-subject-to-class" className="ml-2">Оберіть дисципліну</InputLabel>
                    <Select
                        className="mx-2"
                        labelId="select-subject-to-class"
                        value={subjectSelectedToAdd?.id ? subjectSelectedToAdd.id : ''}
                        onChange={(e) => setSubjectSelectedToAdd(restSubjectsList.find(item => item.id === e.target.value))}
                        label="Оберіть дисципліну"

                    >
                        <MenuItem value={undefined}>
                            <em>Оберіть дисципліну</em>
                        </MenuItem>
                        {restSubjectsList && restSubjectsList.map((subject) => (
                            <MenuItem key={subject.id} value={subject.id}>{subject.attributes.name} <span className="text-slate-500 font-light"> ID: {subject.id}</span></MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button onClick={closeAddDialog}>Закрити</Button>
                    <Button onClick={handleAddSubject} disabled={subjectSelectedToAdd === '' || subjectSelectedToAdd === undefined}>Додати</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminClassSubjects;