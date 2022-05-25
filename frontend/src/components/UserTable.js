import React, { useState, useEffect }  from 'react'
import UserService from '../services/user.service'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Avatar from '@mui/material/Avatar';

function UserTable() {
    const [users, setUsers] = useState();
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

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
                setStatusMessage(resMessage);
                setOpenStatusMessage(true);
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
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {users ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell><Avatar src={"http://localhost:5000/v1/users/storage/" + user.image} alt="User" /></TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell><MoreVertIcon /></TableCell>
                        </TableRow>
                    ))
                ) : (
                    <LinearProgress />
                )}
            </TableBody>
        </Table>
    </TableContainer>
    <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
    </>
  )
}

export default UserTable