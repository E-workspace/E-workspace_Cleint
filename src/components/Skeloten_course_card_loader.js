// src/components/Media.js
import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Media({ loading }) {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(15)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box sx={{ width: '100%', marginRight: 1, my: 5 }}>
            <Skeleton variant="rectangular" width="100%" height={250} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton />
              <Skeleton width="80%" />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default Media;
