"use client"

import { createNewTeacher } from "@/lib/actions/createNewTeacher";
import { deleteTeacher } from "@/lib/actions/deleteTeacher";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

const AdminTeachersList = ({teachersD}) => {
    const [teachersData, setTeachersData] = useState(teachersD);
    const [isAddDialogOpen, setAddDialogOpen] = useState(false);
    const [newTeacherValue, setNewTeacherValue] = useState('');
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(undefined);

    const closeAddDialog = () => {
        setAddDialogOpen(false)
    }

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false)
        setSelectedTeacher(undefined)
    }

    const handleDeleteDialogOpen = (teacher) => {
        setSelectedTeacher(teacher);
        setDeleteDialogOpen(true);
    }

    const handleAddTeacher = async () => {
        const responseData = await createNewTeacher(newTeacherValue)
        setTeachersData(prevState => [...prevState, responseData.data])
        setNewTeacherValue('')
        closeAddDialog()
    }

    const handleDeleteTeacher = async () => {
        const responseData = await deleteTeacher(selectedTeacher.id)
        setTeachersData(prevState => prevState.filter(teacher => teacher.id !== responseData.data.id))
        setSelectedTeacher(undefined)
        closeDeleteDialog()
    }

    return (
        <ul className="ml-4 py-4">
            {teachersData.map((teacher, index) => (
                <li key={index} className="py-2">
                    {index + 1}. {teacher.attributes.name} <span className="text-slate-500 font-light">ID: {teacher.id}</span> <Button color={'error'} className="ml-6" onClick={() => handleDeleteDialogOpen(teacher)}>╳</Button>
                </li>
            ))}
            <Button onClick={() => setAddDialogOpen(true)}>Додати викладача +</Button>
            <Dialog open={isAddDialogOpen} onClose={closeAddDialog}>
                <DialogTitle>Додати Викладача</DialogTitle>
                <DialogContent>
                    <TextField
                        value={newTeacherValue}
                        onChange={(e) => setNewTeacherValue(e.target.value)}
                        label="ПІБ викладача"
                        className="my-2 w-full"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialog}>Відміна</Button>
                    <Button onClick={handleAddTeacher} disabled={newTeacherValue === "" || newTeacherValue.length < 2}>Додати</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Видалити викладача</DialogTitle>
                <DialogContent>
                    Ви впевнені, що хочете видалити викладача<br/>
                    {selectedTeacher?.attributes?.name} <span className="text-slate-500 font-light">ID: {selectedTeacher?.id}</span><br/>
                    Ця дія є невідворотною!
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Відміна</Button>
                    <Button onClick={handleDeleteTeacher}>Видалити</Button>
                </DialogActions>
            </Dialog>
        </ul>
    )
}

export default AdminTeachersList;