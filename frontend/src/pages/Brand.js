import React, { useState, useEffect }  from 'react'
import { useParams } from "react-router-dom";
import BrandService from "../services/brand.service";
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useAlert from '../components/Alerts/useAlert';

function BrandPage() {
    const snackbar = useAlert();

    const [content, setContent] = useState();
    let { id } = useParams()

    useEffect(() => {
        BrandService.getBrand(id).then(
            response => {
                setContent(response.data);
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
      }, [id]);

    return (
        <Container>
            {content ? (
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
            ) : (
                <CircularProgress />
            )}
        </Container>
    )
}

export default BrandPage
