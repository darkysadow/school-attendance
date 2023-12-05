"use client"


import addStudentToClass from "@/lib/actions/addStudentToClass";
import getStudentsWithoutClass from "@/lib/actions/getStudentsWithoutClass";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

const AdminStudentsList = ({ studentsL, nameOfClass, classId }) => {
    const [studentsList, setStudentsList] = useState(studentsL)
    const [studentsWithoutClass, setStudentsWithoutClass] = useState(null)
    const [isAddDialogOpen, setAddDialogOpen] = useState(false)
    const [studentSelectedToAdd, setStudentSelectedToAdd] = useState(undefined)

    
    const openAddStudentWindow = async () => {
        const studentsList = await getStudentsWithoutClass()
        setStudentsWithoutClass(studentsList)
        setAddDialogOpen(true)
    }

    const handleAddStudentToClass = async () => {
        const response = await addStudentToClass(studentSelectedToAdd, classId)

        setStudentsList(prevData => [...prevData, response.data].sort((a, b) => a.attributes.name.localeCompare(b.attributes.name)))
        setAddDialogOpen(false)
        setStudentSelectedToAdd(undefined)
    }   

    const closeAddDialog = () => {
        setAddDialogOpen(false)
    }

    return (
        <div>
            <ul className="ml-4 p-5">
                {studentsList.length > 0 ? studentsList.map((student, index) => (
                    <li key={student.id} className="py-1">{index + 1}. {student.attributes.name} <span className="text-slate-500 font-light">ID учня: {student.id}</span></li>
                )) : <li>Список учнів пустий!</li>}
                <Button onClick={openAddStudentWindow}>Додати учня +</Button>
            </ul>
            <Dialog open={isAddDialogOpen} onClose={closeAddDialog} className="gap-4">
                <DialogTitle>Додати учня до класу</DialogTitle>
                <DialogContent className="flex flex-col">
                    Клас: {nameOfClass} <span className="text-slate-500 font-light">ID: {classId}</span>
                    <FormControl fullWidth className="my-2">
                        <InputLabel id="demo-simple-select-label">Оберіть учня</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            value={studentSelectedToAdd?.id ? studentSelectedToAdd.id : ''}
                            onChange={(e) => setStudentSelectedToAdd(studentsWithoutClass.find(item => item.id === e.target.value))}
                            label="Оберіть учня"
                        
                        >
                            <MenuItem value={undefined}>
                                <em>Оберіть учня</em>
                            </MenuItem>
                            {studentsWithoutClass && studentsWithoutClass.map((student) => (
                                <MenuItem key={student.id} value={student.id}>{student.attributes.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddDialog}>Закрити</Button>
                    <Button 
                        onClick={handleAddStudentToClass}
                        disabled={studentSelectedToAdd === undefined}
                    >
                        Додати
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminStudentsList;