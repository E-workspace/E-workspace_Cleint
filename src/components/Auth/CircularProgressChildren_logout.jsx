import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from '@mui/icons-material/Warning';


export default function CircularProgressChildren() {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      <CircularProgress color="warning">
        <WarningIcon color="warning" />
      </CircularProgress>
     
    </Box>
  )
};
