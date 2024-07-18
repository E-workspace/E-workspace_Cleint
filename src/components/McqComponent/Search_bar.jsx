import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: "HTML" },
  { title: "JavaScript" },
  { title: "Java" },
  { title: "React.js" },
  { title: "Express.js" },
  { title: "MongoDB" },
  { title: "SQL" },
];

export default function SearchBar({ handleSearch }) {
  return (
    <Stack spacing={2} sx={{ width: "75%", marginLeft: "auto", marginRight: "auto" }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={top100Films.map((option) => option.title)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              type: 'search',
              onChange: (event) => handleSearch(event.target.value),
            }}
          />
        )}
      />
    </Stack>
  );
}
