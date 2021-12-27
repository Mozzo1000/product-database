import React, { useState, useEffect }  from 'react'
import { useParams } from "react-router-dom";
import ProductService from "../services/product.service";
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function ProductPage() {
    const [content, setContent] = useState();
    let { id } = useParams()

    useEffect(() => {
        ProductService.getProduct(id).then(
            response => {
                setContent(response.data);
                console.log(response.data.attribute.length);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        )
      }, []);

    return (
        <Container>
            {content ? (
                <>
                <Card>
                    <CardHeader title={content.name} subheader={"Added: " + content.created_at}/>
                    <CardContent>
                        <Typography>Internal ID: {content.id}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Edit</Button>
                        <Button size="small" color="error">Delete</Button>
                    </CardActions>
                </Card>
                <Card>
                    <CardHeader title="Attributes" />
                    <CardContent>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Attribute</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {content.attribute.length > 0 ? (
                                        content.attribute.map((attribute) => (
                                            <TableRow key={attribute.name}>
                                                <TableCell>{attribute.name}</TableCell>
                                                <TableCell>{attribute.value}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <Typography>No attributes found</Typography>

                                    )}
                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                </>
            ) : (
                <CircularProgress />
            )}
        </Container>
    )
}

export default ProductPage
