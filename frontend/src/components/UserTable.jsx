import React, { useState, useEffect } from 'react'
import UserService from '../services/user.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import UserTableActionMenu from './UserTableActionMenu';
import useAlert from './Alerts/useAlert';

function UserTable() {
    const snackbar = useAlert();
    const [users, setUsers] = useState();

    const loadUsers = () => {
        UserService.getAllUsers().then(
            response => {
                setUsers(response.data);
                console.log("USER LOADED")
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                snackbar.showError(resMessage);
            }
        )
    }

    useEffect(() => {
        UserService.getAllUsers().then(
            response => {
                setUsers(response.data);
                console.log("USER LOADED")
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                snackbar.showError(resMessage);
            }
        )
    }, []);

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell><Avatar src={import.meta.env.VITE_API_ENDPOINT + "v1/users/storage/" + user.image} alt="User" /></TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        {user.status == "active" ? (
                                            <Chip label="Active" color="success" />
                                        ) : (
                                            <Chip label="Inactive" color="error" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <UserTableActionMenu user={user} callback={() => loadUsers()} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <LinearProgress />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default UserTable