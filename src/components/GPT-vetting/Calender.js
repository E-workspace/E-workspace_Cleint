import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';
import StartInterview from './Ai';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = 'Asia/Kolkata';

export default function ResponsiveDatePickers() {
  const [selectedDate, setSelectedDate] = React.useState(dayjs().tz(IST));
  const [existingDate, setExistingDate] = React.useState(null);
  const { user } = useAuth();

  React.useEffect(() => {
    // Fetch existing interview date for the user
    fetch('https://e-workspace-server-v1-ms-2.onrender.com/api/preBookedUser/checkdatestatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        email: user.email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.interviewDate) {
          const existingDate = dayjs(data.interviewDate).tz(IST);
          setExistingDate(existingDate);
          Swal.fire({
            icon: 'success',
            title: 'Interview already scheduled',
            text: `You already have an interview scheduled on ${existingDate.format('MMMM D, YYYY h:mm A')}`,
            footer: '<a href="#">Why do I have this issue?</a>',
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching interview date:', error);
      });
  }, [user.username, user.email]);

  const shouldDisableDate = (date) => {
    const day = date.day();
    return day !== 5 && day !== 6 && day !== 0;
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate.tz(IST));
  };

  const handleDateSubmit = () => {
    if (existingDate && selectedDate.isSame(existingDate, 'minute')) {
      toast.error('You have already booked this slot. Please choose another date and time.');
      return;
    }

    fetch('https://e-workspace-server-v1-ms-2.onrender.com/api/start-interview/selected-date', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedDate: selectedDate.toISOString(),
        username: user.username,
        email: user.email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        toast.success('Interview successfully scheduled');
        setExistingDate(selectedDate); // Update existing date on successful booking
      })
      .catch((error) => {
        toast.error('Booking Date Only Available for Friday, Saturday, Sunday');
        console.error('Error:', error);
      });
  };

  return (
    <>
      {existingDate && dayjs().tz(IST).isSame(existingDate, 'minute') ? (
        <StartInterview />
      ) : (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['StaticDateTimePicker']}>
        
                <StaticDateTimePicker
                  defaultValue={selectedDate}
                  shouldDisableDate={shouldDisableDate}
                  onChange={handleDateChange}
                />
            </DemoContainer>
          </LocalizationProvider>
          <Button onClick={handleDateSubmit}>Submit</Button>
          <ToastContainer />
        </>
      )}
    </>
  );
}
