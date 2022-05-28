import React, { useState, useEffect }  from 'react'
import BrandService from "../services/brand.service";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from '@mui/material';
import useAlert from './Alerts/useAlert';

function BrandSelection(props) {
    const snackbar = useAlert();

    const [content, setContent] = useState();

    useEffect(() => {
        BrandService.getAllBrands().then(
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
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select labelId="brand-select-label" label="Brand" value={props.selectedBrand} onChange={e => props.setState(e.target.value)}>
                {content?.map(item => {
                    return <MenuItem value={item.id}>{item.name}</MenuItem>
                })}
            </Select>
        </FormControl>
    )
}

export default BrandSelection