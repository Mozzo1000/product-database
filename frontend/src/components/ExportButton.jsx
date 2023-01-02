import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';
import { parse } from 'json2csv/dist/json2csv.umd'

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


function ExportButton(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCSV = () => {
    const fields = props.csv_fields
    const opts = { fields };

    try {
      const csv = parse(props.data, opts);
      console.log(csv);
      const element = document.createElement("a");
      const file = new Blob([csv], {
        type: "text/csv"
      });
      element.href = URL.createObjectURL(file);
      element.download = props.filename + ".csv";
      document.body.appendChild(element);
      element.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button aria-controls={open ? 'demo-customized-menu' : undefined} aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined} variant="contained" disableElevation
        onClick={handleClick} endIcon={<KeyboardArrowDownIcon />}>
        Export
      </Button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleCSV}>CSV</MenuItem>
      </StyledMenu>
    </>
  )
}

export default ExportButton