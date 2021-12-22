import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import BrandService from "../services/brand.service";

function Brandspage() {
    const [content, setContent] = useState();
    const [pageSize, setPageSize] = React.useState(10);

    const columns = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name"},

    ];

    useEffect(() => {
        BrandService.getAllBrands().then(
            response => {
                setContent(response.data);
                console.log(response.data)
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
            <DataTable content={content} columns={columns} pageSize={pageSize}/>
        </Container>
    )
}

export default Brandspage
