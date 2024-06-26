import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getCourses } from '../redux/slices/CoursesSlice';

export default function Search() {

  const dispatch = useDispatch();

  const inputHandler = (e)=>{
    axios.post(`${import.meta.env.VITE_APP_URL}/api/search`,{query:e.target.value})
    .then((res)=>{
      // console.log(res.data.courses);
      dispatch(getCourses(res.data.courses))
    })
  }
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "90%", margin: "2rem auto" }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for Courses, instructor"
        inputProps={{ 'aria-label': 'search google maps' }}
        onChange={inputHandler}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}