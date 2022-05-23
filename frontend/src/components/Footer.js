import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const heart = <span style={{color: '#e25555'}}>&hearts;</span>;

function Footer() {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px'}}>
        <Typography><span style={{opacity: 0.4}}>Made with</span> {heart} <span style={{opacity: 0.4}}>by <a href="https://andreasbackstrom.se" target="_blank" rel="noreferrer">Andreas Backström</a></span></Typography>
    </Box>
  )
}

export default Footer