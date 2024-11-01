import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './codestore.css';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2'; // Import SweetAlert2

const columns = [
  { id: 'filename', label: 'File Name', minWidth: 170 },
  { id: 'date', label: 'Date', minWidth: 100 },
  { id: 'actions', label: 'Actions', minWidth: 170, align: 'center' },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  backgroundColor: 'black',
  borderRadius: 8,
};

const contentStyle = {
  maxHeight: 'calc(100% - 50px)',
  overflow: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: '#6c757d #1e1e1e',
  backgroundColor: 'black',
};

const scrollBarStyle = `
  ::-webkit-scrollbar {
    width: 8px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background: #1e1e1e;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #6c757d;
    border-radius: 30px;
    border: 2px solid #1e1e1e;
  }

  scrollbar-width: thin;
  scrollbar-color: #6c757d #1e1e1e;
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StickyHeadTable() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('javascript');
  const [copyAlert, setCopyAlert] = useState(false);

  useEffect(() => {
    if (user) {
      getData();
    }
  }, [user]);

  const getData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL_MS2}/getSavedCode/GetCode`, {
        username: user.username,
        email: user.email,
      });
      if (response.data && response.data.data) {
        setRows(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching saved code:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL_MS2}/deleteCode/`, { data: { filename } });
      getData();
    } catch (error) {
      console.error('Error deleting code:', error);
    }
  };

  const confirmDelete = (filename) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this code snippet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(filename);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  };

  const handleView = (code, language) => {
    setCurrentCode(code);
    setCurrentLanguage(language.toLowerCase());
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCopy = () => {
    setCopyAlert(true);
  };

  const handleCopyClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setCopyAlert(false);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <style>{scrollBarStyle}</style>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow style={{ backgroundColor: 'black' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, color: 'white', backgroundColor: '#0096FF', fontFamily: 'Oswald, serif', fontWeight: '650' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id.$oid}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if (column.id === 'actions') {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <Button variant="contained" color="primary" onClick={() => handleView(row.code, row.filename)}>
                              View
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => confirmDelete(row.filename)} style={{ marginLeft: 8 }}>
                              Delete
                            </Button>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth, fontWeight: '650', fontFamily: 'Oswald, sans-serif' }}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" color="white">
            <CopyToClipboard text={currentCode} onCopy={handleCopy}>
              <IconButton color="primary">
                <ContentCopyIcon />
              </IconButton>
            </CopyToClipboard>
            <IconButton
            onClick={handleClose}
            sx={{
              color: 'white',
              float: 'right',
              '&:hover': {
                backgroundColor: 'red', // Background turns red on hover
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          
          </Typography>
          <Box sx={contentStyle}>
            <SyntaxHighlighter
              language={currentLanguage}
              style={atomOneDark}
              customStyle={{ backgroundColor: '#000000', padding: '20px', borderRadius: '4px' }}
            >
              {currentCode}
            </SyntaxHighlighter>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar for copy alert */}
      <Snackbar open={copyAlert} autoHideDuration={3000} onClose={handleCopyClose}>
        <Alert onClose={handleCopyClose} severity="success" sx={{ width: '100%' }}>
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
