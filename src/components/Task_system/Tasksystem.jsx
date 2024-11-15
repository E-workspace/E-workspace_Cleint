import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  TextField,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/system';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FormControl, Select, MenuItem } from '@mui/material';

import axios from 'axios';

const StyledTableContainer = styled(TableContainer)({
  marginTop: '20px',
  border: '2px solid #ddd',
  width: '100%',
  overflowX: 'auto',
  margin: '0 auto',
});

const StyledButton = styled(Button)(({ disabled }) => ({
  margin: '0 10px',
  fontSize: '14px',
  padding: '6px 12px',
  backgroundColor: disabled ? '#d3d3d3' : '#007bff',
  color: disabled ? '#a0a0a0' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
  '&:hover': {
    backgroundColor: disabled ? '#d3d3d3' : '#0056b3',
  },
}));

const StyledTableCell = styled(TableCell)({
  padding: '10px',
  borderRight: '1px solid #ddd',
  '&:last-child': {
    borderRight: 'none',
  },
});

const StatusBox = styled(Box)(({ status }) => ({
  color: '#fff',
  backgroundColor: status === 'Success' ? 'green' : (status === 'New' ? 'blue' : 'red'),
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '12px',
  textAlign: 'center',
}));

const ModalContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: 24,
  padding: '20px',
  outline: 'none',
});

const Image = styled('img')({
  width: '100%',
  borderRadius: '8px',
});

const getCsrfToken = async () => {
  try {
    const response = await axios.get(`https://e-workspace-server-v1-ms-1.onrender.com/api/csrf-token`);
    return response.data.csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};

const TaskTable = () => {
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTodayTasks, setShowTodayTasks] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [enabledTasks, setEnabledTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('');


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = showTodayTasks 
        ? `https://eworkspacems2-loszcsdz.b4a.run/api/getDailyTasks/today` // For the MS2 API
        : `https://e-workspace-server-v1-ms-1.onrender.com/api/auth/tasks`; // For the MS1 API
    
        const response = await axios.get(url);
        setTaskList(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [showTodayTasks]);

  const handleOpenDescriptionModal = async (task) => {
    setCurrentTask(task);
    setOpenDescriptionModal(true);
  
    console.log(task, "description data row");
  
    const csrfToken = await getCsrfToken();
  
    if (task.status === "New" ) {
      try {
        // Make the POST request to your backend on port 5000
        const response = await axios.post(`https://e-workspace-server-v1-ms-1.onrender.com/api/updatedescription`, 
          {
            id: task.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken, // If required
            },
          }
        );
  
        console.log(response.data, "response from description API");
  
        // Update task state to mark description as viewed
      
      } catch (error) {
        console.error("Error posting task data to API:", error);
      }
    }
  };
  

  const handleCloseDescriptionModal = () => {
    setOpenDescriptionModal(false);
    setCurrentTask(null);
  };

  const handleOpenImageModal = (task) => {
    setCurrentTask(task);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setCurrentTask(null);
  };

  const handleSubmitRepo = async (task) => {
    try {
      const csrfToken = await getCsrfToken();
      const { value: repoLink } = await Swal.fire({
        title: `Submit GitHub Repo for "${task.title}"`,
        input: 'url',
        inputLabel: 'GitHub Repository URL',
        inputPlaceholder: 'Enter your GitHub repository URL',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
          const urlPattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-]+(\/)?$/;
          if (!value || !urlPattern.test(value)) {
            return 'Please enter a valid GitHub repository URL!';
          }
          return null;
        },
      });
  
      if (repoLink) {
        // Update the status of the task to 'Success'
        setTaskList((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id ? { ...t, status: 'Success' } : t
          )
        );
  
        // Optionally, make an API call to save the GitHub link or update the status on the server
        await axios.post(`https://e-workspace-server-v1-ms-1.onrender.com/api/updateGitrepo`, {
          id: task.id,
          repoLink,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
        });
  
        Swal.fire({
          icon: 'success',
          title: 'Submitted!',
          text: `Your repository link has been submitted: ${repoLink}`,
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error submitting repository:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'There was an issue submitting the repository link.',
        confirmButtonText: 'OK',
      });
    }
  };
  

  const handleGetTask = async (task) => {
    try {
      const csrfToken = await getCsrfToken();

      if (!enabledTasks.includes(task.id)) {
        await axios.post(`https://e-workspace-server-v1-ms-1.onrender.com/tasks`, {
          id: task.id,
          title: task.title,
          date: task.date,
          dueDate: task.dueDate,
          technology: task.technology,
          description: task.description,
          images: task.images,
          status: task.status,
          hasViewedDescription: task.hasViewedDescription,
        }, {
          headers: {
            'csrf-token': csrfToken,
          },
        });

        Swal.fire({
          icon: 'success',
          title: 'Task Sent!',
          text: `Task "${task.title}" has been sent to the backend.`,
          confirmButtonText: 'OK',
        });

        setEnabledTasks((prev) => [...prev, task.id]);
      }
    } catch (error) {
      console.error('Error sending task:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: 'There was an issue sending the task to the backend.',
        confirmButtonText: 'OK',
      });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterTasks = (tasks) => {
    return tasks.filter(
      (task) =>
        (statusFilter === '' || task.status === statusFilter) &&
        (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };
  

  const handleToggleTodayTasks = (e) => {
    setShowTodayTasks(e.target.checked);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search tasks"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: '500px' , height:'30px', marginBottom:'20px'}} 
        />
        
        <Box ml={2} display="flex" alignItems="center">
        <FormControl variant="outlined" style={{ marginRight: '16px' }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} 
            displayEmpty
            style={{height:'40px', width:'100px'}}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Success">Success</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="New">New</MenuItem>
          </Select>
        </FormControl>
        <Typography component="span" mr={1}>
          Show Today’s Tasks
        </Typography>
        <Switch
          checked={showTodayTasks}
          onChange={handleToggleTodayTasks}
          inputProps={{ 'aria-label': 'show today tasks' }}
        />
      </Box>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table aria-label="task table">
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Technology</strong></TableCell>
              {!showTodayTasks && <TableCell><strong>Description</strong></TableCell>}
              {!showTodayTasks && <TableCell><strong>Show Image</strong></TableCell>}
              {!showTodayTasks && <TableCell><strong>Submit Task</strong></TableCell>}
              {showTodayTasks && <TableCell><strong>Get Task</strong></TableCell>}
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterTasks(taskList)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task) => (
                <TableRow key={task.id}>
                  <StyledTableCell>{task.id}</StyledTableCell>
                  <StyledTableCell>{task.title}</StyledTableCell>
                  <StyledTableCell>{task.date}</StyledTableCell>
                  <StyledTableCell>{task.dueDate}</StyledTableCell>
                  <StyledTableCell>{task.technology}</StyledTableCell>
                  {!showTodayTasks && (
                    <StyledTableCell>
                      <StyledButton
                        // disabled={task.hasViewedDescription}
                        onClick={() => handleOpenDescriptionModal(task)}
                      >
                        {task.hasViewedDescription ? 'Viewed' : 'Description'}
                      </StyledButton>
                    </StyledTableCell>
                  )}
                  {!showTodayTasks && (
                    <StyledTableCell>
                      <StyledButton onClick={() => handleOpenImageModal(task)}>Show Image</StyledButton>
                    </StyledTableCell>
                  )}
                  {!showTodayTasks && (
                    <StyledTableCell>
                      <StyledButton
                        disabled={task.status === 'Success'}
                        onClick={() => handleSubmitRepo(task)}
                      >
                        Submit Task
                      </StyledButton>
                    </StyledTableCell>
                  )}
                  {showTodayTasks && (
                    <StyledTableCell>
                      <StyledButton
                        disabled={enabledTasks.includes(task.id)}
                        onClick={() => handleGetTask(task)}
                      >
                        {enabledTasks.includes(task.id) ? 'Task Enabled' : 'Enable Task'}
                      </StyledButton>
                    </StyledTableCell>
                  )}
                  <StyledTableCell>
                    <StatusBox status={task.status}>{task.status}</StatusBox>
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filterTasks(taskList).length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledTableContainer>

      {/* Description Modal */}
      <Modal open={openDescriptionModal} onClose={handleCloseDescriptionModal}>
        <ModalContent>
          {currentTask && (
            <>
              <Typography variant="h6">{currentTask.title}</Typography>
              <Typography variant="body1">{currentTask.description}</Typography>
              <Button onClick={handleCloseDescriptionModal} style={{ marginTop: '10px' }}>
                Close
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      <Modal open={openImageModal} onClose={handleCloseImageModal}>
        <ModalContent>
          {currentTask && currentTask.images && (
            <Slider {...sliderSettings}>
              {currentTask.images.map((image, index) => (
                <div key={index}>
                  <Image src={image} alt={`Task Image ${index + 1}`} />
                </div>
              ))}
            </Slider>
          )}
          <Button onClick={handleCloseImageModal} style={{ marginTop: '10px' }}>
            Close
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskTable;
