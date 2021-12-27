import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import CategoryService from "../services/category.service";

function CategoriesPage() {
    const [content, setContent] = useState();
    const [pageSize, setPageSize] = React.useState(10);

    const columns = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name",
            renderCell: (params) => {
                return <Link to={"/category/" + params.row.id}>{params.value}</Link>
            }
        },
    ];

    useEffect(() => {
        CategoryService.getAllCategories().then(
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

export default CategoriesPage
