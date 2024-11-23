import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress , Switch, Pagination,  MenuItem,
  InputLabel,
  FormControl,
Select} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Show
import EditIcon from '@mui/icons-material/Edit'; // Edit
import DeleteIcon from '@mui/icons-material/Delete'; // Delete
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Add


import Draggable from 'react-draggable';
import axios from 'axios';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { Modal, List } from 'antd';
import './Notes.css'

// Draggable Paper Component
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

// Validation Schema with Yup
const noteSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title should be at least 3 characters long'),
  keyPoint: Yup.string()
    .required('Key Point is required')
    .min(3, 'Key Point should be at least 3 characters long'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description should be at least 10 characters long'),
});

export default function DraggableDialog() {
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [title, setTitle] = useState('');
  const [keyPoint, setKeyPoint] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); // For editing/viewing a note
  const [originalId, setOriginalId] = useState(null); // For storing original ID
  const [searchQuery, setSearchQuery] = useState('');
  const [showPastWeek, setShowPastWeek] = useState(false);
  const [showPastMonth, setShowPastMonth] = useState(false);
    // Pagination State
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    // Calculate total pages
    const totalPages = Math.ceil(notes.length / rowsPerPage);
  
    // Handle page change
    const handlePageChange = (event, value) => {
      setPage(value);
    };
  
    // Handle rows per page change
    const handleRowsPerPageChange = (event) => {
      setRowsPerPage(event.target.value);
      setPage(1); // Reset to first page when rows per page changes
    };
  
    // Calculate notes to display based on pagination
    const paginatedNotes = notes
      .filter(note => {
        const noteDate = new Date(note.createdAt);
        const today = new Date();
        const pastWeekDate = new Date(today.setDate(today.getDate() - 7));
        const pastMonthDate = new Date(today.setMonth(today.getMonth() - 1));
  
        const isWithinPastWeek = showPastWeek && noteDate >= pastWeekDate;
        const isWithinPastMonth = showPastMonth && noteDate >= pastMonthDate;
  
        const isDateFiltered = showPastWeek
          ? isWithinPastWeek
          : showPastMonth
          ? isWithinPastMonth
          : true;
  
        const matchesSearchQuery = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.keyPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.description.toLowerCase().includes(searchQuery.toLowerCase());
  
        return isDateFiltered && matchesSearchQuery;
      })
      .slice((page - 1) * rowsPerPage, page * rowsPerPage);
  

  const { user } = useAuth();
  console.log(user,"users")
  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (_, __, index) => index + 1, // Show index-based ID
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Tooltip title={text}>
          {/* Display truncated text if the length is greater than 30 characters */}
          <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Key Point',
      dataIndex: 'keyPoint',
      key: 'keyPoint',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tooltip title={text}>
          <span>{text.length > 30 ? `${text.substring(0, 30)}...` : text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => format(new Date(text), 'MM-dd-yyyy'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Show Button */}
          <Tooltip title="Show">
            <VisibilityIcon
              onClick={() => handleShowNotes(record)}
              style={{ color: '#0288d1', cursor: 'pointer' }}
            />
          </Tooltip>
    
          {/* Edit Button */}
          <Tooltip title="Edit">
            <EditIcon
              onClick={() => handleEdit(record)}
              style={{ color: '#1976d2', cursor: 'pointer' }}
            />
          </Tooltip>
    
          {/* Delete Button */}
          <Tooltip title="Delete">
            <DeleteIcon
              onClick={() => handleDelete(record._id)}
              style={{ color: '#d32f2f', cursor: 'pointer' }}
            />
          </Tooltip>
        </div>
      ),
    }
    
  ];
  

  const handleClickOpen = () => {
    setSelectedNote(null); // Clear selected note
    setTitle(''); // Clear the title input
    setKeyPoint(''); // Clear the key point input
    setDescription(''); // Clear the description input
    setOriginalId(null); // Reset the original ID for editing
    setOpen(true); // Open the modal
  };
  
  const handleClose = () => {
    setOpen(false);
    setViewOpen(false);
  };

  const handleViewOpen = (note) => {
    setSelectedNote(note);
    setViewOpen(true);
  };

  useEffect(() => {
    console.log(user, "user")
    if (user?.email && user?.username) {
      setUserDetails({
        username: user.username,
        email: user.email,
        role: user.role,
      });
      fetchNotes(user.email, user.username); // Ensure this is only called when both email and username are set.
    }
  }, [user]);

  // Fetch Notes
useEffect(() => {
  if (user?.email && user?.username) {
    fetchNotes(user.email, user.username);
  }
}, [user, showPastWeek]); // Ensure it runs when showPastWeek changes
  

  const fetchNotes = async (email, username) => {
    if (!email || !username) {
      console.error('Email and username are required to fetch notes.');
      return;
    }
  
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL_MS2}/Getnotes`, {
        email,
        username,
      }, {
        withCredentials: true,
      });
  
      setNotes(response.data.notes);
    } catch (error) {
      toast.error('Failed to fetch notes. Please try again later.');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_MS1}/csrf-token'`, {
        credentials: 'include',
      });
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      throw new Error("Unable to fetch CSRF token");
    }
  };

  const handleSave = async () => {
    const payload = {
      username: userDetails.username,
      email: userDetails.email,
      role: userDetails.role,
      title,
      keyPoint,
      description,
    };
  
    try {
      await noteSchema.validate(payload, { abortEarly: false });
      const csrfToken = await fetchCsrfToken();
  
      // Check if editing or adding a new note
      if (originalId) {
        // Edit existing note using the originalId
        await axios.put(`${process.env.REACT_APP_API_URL_MS2}/editNote/${originalId}`, payload, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        });
        toast.success("Note updated successfully!");
      } else {
        // Add new note
        await axios.post(`${process.env.REACT_APP_API_URL_MS2}/Savenotes`, payload, {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        });
        toast.success("Note saved successfully!");
      }
  
      // Reset fields and close modal
      setTitle('');
      setKeyPoint('');
      setDescription('');
      setOriginalId(null); // Clear original ID after saving
      handleClose();
  
      // Fetch updated notes list
      fetchNotes(userDetails.email, userDetails.username);
    } catch (error) {
      if (error.response) {
        toast.error(`Failed to save note: ${error.response.data.error || "Please try again later."}`);
        console.error('Server error:', error.response);
      } else if (error.errors) {
        toast.error(`Validation failed: ${error.errors.join(' ')}`);
        console.warn('Validation errors:', error.errors);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error);
      }
    }
  };
  
  const handleShowNotes = (note) => {
    setSelectedNote(note);
    handleViewOpen(note);
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setKeyPoint(note.keyPoint);
    setDescription(note.description);
    setOpen(true);
    setOriginalId(note._id); // Save original ID for updating
  };

  const handleDelete = async (noteId) => {
    // Show confirmation dialog using SweetAlert2
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });
  
    // If user confirms deletion
    if (result.isConfirmed) {
      try {
        setLoading(true); // Set loading state
        const csrfToken = await fetchCsrfToken();
  
        await axios.delete(`${process.env.REACT_APP_API_URL_MS2}/deleteNote/${noteId}`, {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        });
  
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId)); // Update state
        toast.success('Note deleted successfully!');
  
        // Show success confirmation alert after deletion
        Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
      } catch (error) {
        toast.error('Failed to delete note. Please try again later.');
        console.error('Error deleting note:', error);
      } finally {
        setLoading(false); // End loading state
      }
    } else {
      // If user cancels deletion
      Swal.fire('Cancelled', 'Your note is safe :)', 'error');
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Add Notes
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            id="search"
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
           
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={showPastWeek}
              onChange={() => {
                setShowPastWeek(prev => !prev);
              }}
              color="primary"
              inputProps={{ 'aria-label': 'past week notes' }}
            />
            <span>  Past Week</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={showPastMonth}
              onChange={() => setShowPastMonth(prev => !prev)}
              color="primary"
              inputProps={{ 'aria-label': 'past month notes' }}
            />
            <span>  Past Month</span>
          </Box>
        </Box>
      </Box>

      {/* Add/Edit Note Modal */}
      <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      sx={{
        '& .MuiDialog-paper': {
          width: '500px',
          borderRadius: '8px',
          fontFamily: '"Play", sans-serif', // Apply font to the dialog paper
        },
      }}
    >
      <DialogTitle
        style={{
          cursor: 'move',
          fontFamily: '"Play", sans-serif', // Apply font to the dialog title
          fontWeight: '700', // Bold title
        }}
        id="draggable-dialog-title"
      >
        {selectedNote ? 'Edit Note' : 'Add Note'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          style={{
            fontFamily: '"Play", sans-serif', // Apply font to the dialog content text
            fontWeight: '400', // Regular weight for content text
          }}
        >
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '100%' },
              fontFamily: '"Play", sans-serif', // Apply font to form
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': { fontFamily: '"Play", sans-serif' }, // Apply font to TextField input
                '& .MuiInputLabel-root': { fontFamily: '"Play", sans-serif' }, // Apply font to label
              }}
            />
            <TextField
              id="keyPoint"
              label="Key Point"
              variant="outlined"
              value={keyPoint}
              onChange={(e) => setKeyPoint(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': { fontFamily: '"Play", sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: '"Play", sans-serif' },
              }}
            />
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': { fontFamily: '"Play", sans-serif' },
                '& .MuiInputLabel-root': { fontFamily: '"Play", sans-serif' },
              }}
            />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          sx={{
            fontFamily: '"Play", sans-serif', // Apply font to buttons
            fontWeight: '400',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            backgroundColor: '#28a745',
            color: '#fff',
            '&:hover': { backgroundColor: '#218838' },
            fontFamily: '"Play", sans-serif', // Apply font to buttons
            fontWeight: '400',
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
    

      {/* View Note Modal */}
      <Dialog
        open={viewOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        sx={{
          '& .MuiDialog-paper': {
            width: '700px',
            maxHeight: '90vh',
            borderRadius: '8px',
            boxShadow: 24,
          },
        }}
      >
        <DialogTitle
          id="draggable-dialog-title"
          sx={{
            cursor: 'move',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            padding: '16px 24px',
            borderBottom: '1px solid #ddd',
            textAlign: 'center',
          }}
        >
          {selectedNote ? selectedNote.title : 'Note Title'}
        </DialogTitle>

        <DialogContent>
        <DialogContentText>
            {selectedNote ? (
                <Box sx={{ p: 2 }}>
                    {/* Key Point Section */}
                    <Box sx={{ mb: 2, borderBottom: '1px solid #000000', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: '900', marginBottom: '8px',  }}>Key Point:</p>
                        <p>{selectedNote.keyPoint}</p>
                    </Box>
    
                    {/* Description Section */}
                    <Box sx={{ mb: 2, borderBottom: '1px solid #000000', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px', }}>Description:</p>
                        <p>{selectedNote.description}</p>
                    </Box>
    
                    {/* Created Date Section */}
                    <Box sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary', borderBottom: '1px solid #000000', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: 'bold' }}>Created At:</p>
                        <p>{format(new Date(selectedNote.createdAt), 'MM-dd-yyyy')}</p>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Box>
            )}
        </DialogContentText>
    </DialogContent>
    

        <DialogActions>
          <Button autoFocus onClick={handleClose} sx={{ backgroundColor: '#6c757d', color: '#fff', '&:hover': { backgroundColor: '#5a6268' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes Table */}
      <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#007bff', color: '#fff' }}>
              {columns.map((column) => (
                <TableCell key={column.key} sx={{ color: '#fff', fontWeight: 'bold' }}>{column.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              paginatedNotes.map((note, index) => (
                <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    style={{
                      fontWeight: '600', // Bold for emphasis
                      fontFamily: '"Play", sans-serif', // Apply the Play font here
                    }}
                  >
                    {column.render
                      ? column.render(note[column.dataIndex], note, index)
                      : note[column.dataIndex]}
                  </TableCell>
                ))}
              </TableRow>
              
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            label="Rows per page"
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ '& .MuiPaginationItem-root': { color: '#007bff' } }}
        />
      </Box>
    </React.Fragment>
  );
};
