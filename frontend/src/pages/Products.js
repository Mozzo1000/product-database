import React, { useState, useEffect }  from 'react'
import { Link } from "react-router-dom";
import Container from '@mui/material/Container';
import DataTable from '../components/DataTable';
import ProductService from "../services/product.service";

function ProductsPage() {
    const [content, setContent] = useState();
    const [pageSize, setPageSize] = React.useState(10);

    const columns = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name"},
        {
            field: "category", headerName: "Category",
            valueGetter: (params) => {
                let result = [];
                if (params.row.category) {
                    result.push(params.row.category.name)
                }
                return result
            },
            renderCell: (params) => {
                return <Link to={"/category/" + params.row.category.id}>{params.value}</Link>
            }
        }
    ];

    useEffect(() => {
        ProductService.getAllProducts().then(
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

export default ProductsPage
