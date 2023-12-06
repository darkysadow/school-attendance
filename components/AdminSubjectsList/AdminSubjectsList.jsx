"use client"

import { addNewSubject } from "@/lib/actions/addNewSubject";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const AdminSubjectsList = ({ subjectsL }) => {
    const [subjectsList, setSubjectsList] = useState(subjectsL)
    const [isAddDialogOpen, setAddDialogOpen] = useState(false)
    const [newSubjectValue, setNewSubjectValue] = useState('')

    const closeAddDialog = () => {
        setAddDialogOpen(false)
        setNewSubjectValue('')
    }

    const handleAddNewSubject = async () => {
        const response = await addNewSubject(newSubjectValue).then(response => response.data)
        setSubjectsList(prevData => [...prevData, response])
        setAddDialogOpen(false)
        setNewSubjectValue('')
    }



    return (
        <div className="my-4">
            <ul>
                {subjectsList.map((subject, index) => (
                    <li key={subject.id}>
                        {index + 1}. {subject.attributes.name} <span className="text-slate-500 font-light">ID: {subject.id}</span><br />
                        {
                            subject.attributes.teachers.data.length === 0 ? 
                            <span className="ml-4 text-red-400">Викладачі не призначені!</span> :
                            <span className="ml-4 text-red-400">Викладачі: </span>
                        } <br />
                        {subject.attributes.teachers.data.map((teacher) =>
                            
                            <span key={teacher.id} className="ml-4 text-cyan-500">{teacher.attributes.name} <span className="text-slate-500 font-light">ID: {teacher.id}</span></span>)}
                    </li>
                ))}
                <Button onClick={() => setAddDialogOpen(true)}>Додати нову дисципліну +</Button>
            </ul>
            <Dialog open={isAddDialogOpen} onClose={closeAddDialog}>
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
                    <Button onClick={closeAddDialog}>Закрити</Button>
                    <Button onClick={handleAddNewSubject} disabled={!newSubjectValue || newSubjectValue.length < 2}>Додати</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminSubjectsList;