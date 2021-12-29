import React from 'react'
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LaptopIcon from '@mui/icons-material/Laptop';
import Button from '@mui/material/Button';

function CategoryCard(props) {
    return (
        <Button component={Link} to={props.link}>
        <Card>
            <CardContent sx={{textAlign: "center"}}>
                <LaptopIcon fontSize="large"/>
                <Typography>{props.name}</Typography>
            </CardContent>
        </Card>
        </Button>
    )
}

export default CategoryCard
