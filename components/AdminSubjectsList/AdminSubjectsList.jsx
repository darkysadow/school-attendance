"use client"

import { addNewSubject } from "@/lib/actions/addNewSubject";
import addTeacherToSubject from "@/lib/actions/addTeacherToSubject";
import deleteTeacherFromSubject from "@/lib/actions/deleteTeacherFromSubject";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

const AdminSubjectsList = ({ subjectsL, teachersL }) => {
    const [subjectsList, setSubjectsList] = useState(subjectsL)
    const [teachersList, setTeachersList] = useState(teachersL)
    const [isAddSubjectDialogOpen, setAddSubjectDialogOpen] = useState(false)
    const [newSubjectValue, setNewSubjectValue] = useState('')
    const [isAddTeacherToSubjectDialogOpen, setAddTeacherToSubjectDialogOpen] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState(undefined)
    const [teacherSelectedToAdd, setTeacherSelectedToAdd] = useState('')
    const [teacherSelectedToDelete, setTeacherSelectedToDelete] = useState(undefined)
    const [isDeleteTeacherFromSubjectDialogOpen, setDeleteTeacherFromSubjectDialogOpen] = useState(false)

    const closeAddSubjectDialog = () => {
        setAddSubjectDialogOpen(false)
        setNewSubjectValue('')
    }

    const closeAddTeacherToSubjectDialog = () => {
        setTeachersList(teachersL)
        setSelectedSubject(undefined)
        setTeacherSelectedToAdd('')
        setAddTeacherToSubjectDialogOpen(false)
    }
    
    const closeDeleteTeacherFromSubjectDialog = () => {
        setDeleteTeacherFromSubjectDialogOpen(false)
    }

    const handleAddNewSubject = async () => {
        const response = await addNewSubject(newSubjectValue).then(response => response.data)
        setSubjectsList(prevData => [...prevData, response])
        setAddSubjectDialogOpen(false)
        setNewSubjectValue('')
    }

    const handleAddTeacherToSubject = (subject) => {
        setSelectedSubject(subject)
        setTeachersList(prevTeachers => prevTeachers.filter(teacher => !subject.attributes.teachers.data.some(t => t.id === teacher.id)));
        setAddTeacherToSubjectDialogOpen(true)
    }

    const handleDeleteTeacher = (subject, teacher) => {
        setSelectedSubject(subject)
        setTeacherSelectedToDelete(teacher)
        setDeleteTeacherFromSubjectDialogOpen(true)
    }

    const addTeacherToSubjectAdmin = async () => {
        const responseData = await addTeacherToSubject(teacherSelectedToAdd.id, selectedSubject.id)
        const updatedSubjectsList = subjectsList.map(subject => {
            return subject.id === responseData.data.id ? responseData.data : subject;
        });
        setSubjectsList(updatedSubjectsList);
        setAddTeacherToSubjectDialogOpen(false)
        setSelectedSubject(undefined)
        setTeacherSelectedToAdd("")
    }

    const deleteTeacherFromSubjectAdmin = async () => {
        const responseData = await deleteTeacherFromSubject(teacherSelectedToDelete.id, selectedSubject.id)
        const updatedSubjectsList = subjectsList.map(subject => {
            return subject.id === responseData.data.id ? responseData.data : subject;
        });
        setSubjectsList(updatedSubjectsList);
        setDeleteTeacherFromSubjectDialogOpen(false)
        setSelectedSubject(undefined)
        setTeacherSelectedToDelete(undefined)
    }



    return (
        <div className="my-4">
            <ul>
                {subjectsList.map((subject, index) => (
                    <li key={subject.id} className="my-4 border-b-[0.5px] border-sky-300 border-opacity-30 py-2">
                        {index + 1}. {subject.attributes.name} <span className="text-slate-500 font-light">ID: {subject.id}</span><br />
                        {
                            subject.attributes.teachers.data.length === 0 ? 
                            <span className="ml-4 text-red-400">Викладачі не призначені!</span> :
                            <span className="ml-4 text-green-400">Викладачі: </span>
                        } <Button onClick={() => handleAddTeacherToSubject(subject)}>Додати викладача +</Button> <br />
                        {subject.attributes.teachers.data.map((teacher) =>
                            
                            <div key={teacher.id}>
                                <span className="ml-4 text-cyan-500">{teacher.attributes.name} <span className="text-slate-500 font-light">ID: {teacher.id}</span></span><Button onClick={() => handleDeleteTeacher(subject, teacher)} color={"error"}>╳</Button>
                                
                            </div>
                            )}
                    </li>
                ))}
                <Button onClick={() => setAddSubjectDialogOpen(true)}>Додати нову дисципліну +</Button>
            </ul>
            <Dialog open={isAddSubjectDialogOpen} onClose={closeAddSubjectDialog}>
                <DialogTitle>Додати дисципліну до списку</DialogTitle>
                <DialogContent>
                    <TextField
                        value={newSubjectValue}
                        onChange={(e) => setNewSubjectValue(e.target.value)}
                        label="Назва дисципліни"
                        className="my-2 w-full"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddSubjectDialog}>Закрити</Button>
                    <Button onClick={handleAddNewSubject} disabled={!newSubjectValue || newSubjectValue.length < 2}>Додати</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isAddTeacherToSubjectDialogOpen} onClose={closeAddTeacherToSubjectDialog}>
                <DialogTitle>Додати викладача до предмету</DialogTitle>
                <DialogContent>
                    Предмет: <br/>
                    {selectedSubject?.attributes?.name} <span className="text-slate-500 font-light">ID: {selectedSubject?.id}</span>
                </DialogContent>
                <FormControl fullWidth className="my-2">
                        <InputLabel id="select-teacher-to-subject" className="ml-2">Оберіть викладача</InputLabel>
                        <Select
                            className="mx-2"
                            labelId="select-teacher-to-subject"
                            value={teacherSelectedToAdd?.id ? teacherSelectedToAdd.id : ''}
                            onChange={(e) => setTeacherSelectedToAdd(teachersList.find(item => item.id === e.target.value))}
                            label="Оберіть викладача"
                        
                        >
                            <MenuItem value={undefined}>
                                <em>Оберіть Викладача</em>
                            </MenuItem>
                            {teachersList && teachersList.map((teacher) => (
                                <MenuItem key={teacher.id} value={teacher.id}>{teacher.attributes.name} <span className="text-slate-500 font-light"> ID: {teacher.id}</span></MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <DialogActions>
                        <Button onClick={closeAddTeacherToSubjectDialog}>Закрити</Button>
                        <Button onClick={addTeacherToSubjectAdmin} disabled={teacherSelectedToAdd === '' || teacherSelectedToAdd === undefined}>Додати</Button>
                    </DialogActions>
            </Dialog>
            <Dialog open={isDeleteTeacherFromSubjectDialogOpen} onClose={closeDeleteTeacherFromSubjectDialog}>
                <DialogTitle>Видалити вчителя</DialogTitle>
                <DialogContent>
                Ви дійсно хочете видалити вчителя {teacherSelectedToDelete?.attributes.name} <span className="text-slate-500 font-light"> ID: {teacherSelectedToDelete?.id}</span><br/>
                з дисципліни {selectedSubject?.attributes.name} <span className="text-slate-500 font-light"> ID: {selectedSubject?.id}</span>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteTeacherFromSubjectDialog}>Закрити</Button>
                    <Button onClick={deleteTeacherFromSubjectAdmin}>Видалити</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminSubjectsList;