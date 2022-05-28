import React, { useState, useEffect }  from 'react'
import CategoryService from "../services/category.service";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import useAlert from './Alerts/useAlert';

function CategorySelection(props) {
    const snackbar = useAlert();

    const [content, setContent] = useState();

    useEffect(() => {
        CategoryService.getAllCategories().then(
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
      }, []);

    return (
        <FormControl>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select labelId="category-select-label" label="Category" value={props.selectedCategory} onChange={e => props.setState(e.target.value)}>
                {content?.map(item => {
                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                })}
            </Select>
        </FormControl>
    )
}

export default CategorySelection