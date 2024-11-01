import React, { useState, useEffect } from 'react';
import { register } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';



const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [role, setRole] = useState('');
    const [batch, setBatch] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        console.log(token, "token")

        if (token) {
          
            navigate('/dashboard');
        }
    }, [token, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profileImage', profileImage);
        formData.append('role', role);
        formData.append('batch', batch);
        formData.append('selectedDistrict', selectedDistrict);
        formData.append('phoneNumber', phoneNumber);
    

        try {
            await register(formData);
            toast.success('OTP sent to your email');
            // Request notification permission after successful registration
            requestNotificationPermission();


            navigate('/verify-otp', { state: { email } });
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
        }
    };


    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
                // You can handle any further logic here if needed
            } else {
                console.log('Notification permission denied.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white gap-[10px]">
        <div className="w-full max-w-4xl p-8 space-y-8">
            <h2 className="text-3xl font-bold text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-6">
                <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3 mb-4 space-y-4"> {/* Added space-y-4 */}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                          <input
                            type="tel"
                            placeholder=" Mobile Number (optional)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            pattern="[0-9]{10}" // Adjust the pattern according to the mobile number format
                            title="Please enter a valid 10-digit mobile number (optional)"
                            required
/>

                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-4 space-y-4"> {/* Added space-y-4 */}
                        <input
                            type="file"
                            onChange={(e) => setProfileImage(e.target.files[0])}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                        <select
                            value={batch}
                            onChange={(e) => setBatch(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        >
                               <option value="" disabled>Select Batch</option>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                        </select>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        >
                             <option value="" disabled>Select Role</option>
                                <option value="Full Stack Developer">Full Stack Developer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="Cyber Security">Cyber Security</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Test Engineer">Test Engineer</option>
                        </select>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                            className="w-full px-4 py-3 text-lg text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        >
                           <option value="" disabled>Select District</option>
                                <option value="Chennai">Chennai</option>
                                <option value="Coimbatore">Coimbatore</option>
                                <option value="Cuddalore">Cuddalore</option>
                                <option value="Dharmapuri">Dharmapuri</option>
                                <option value="Dindigul">Dindigul</option>
                                <option value="Erode">Erode</option>
                                <option value="Kanchipuram">Kanchipuram</option>
                                <option value="Kanyakumari">Kanyakumari</option>
                                <option value="Karur">Karur</option>
                                <option value="Krishnagiri">Krishnagiri</option>
                                <option value="Madurai">Madurai</option>
                                <option value="Nagapattinam">Nagapattinam</option>
                                <option value="Namakkal">Namakkal</option>
                                <option value="Nilgiris">Nilgiris</option>
                                <option value="Perambalur">Perambalur</option>
                                <option value="Pudukkottai">Pudukkottai</option>
                                <option value="Ramanathapuram">Ramanathapuram</option>
                                <option value="Salem">Salem</option>
                                <option value="Sivaganga">Sivaganga</option>
                                <option value="Tenkasi">Tenkasi</option>
                                <option value="Thanjavur">Thanjavur</option>
                                <option value="Theni">Theni</option>
                                <option value="Thoothukudi">Thoothukudi</option>
                                <option value="Tiruchirappalli">Tiruchirappalli</option>
                                <option value="Tirunelveli">Tirunelveli</option>
                                <option value="Tirupathur">Tirupathur</option>
                                <option value="Tirupur">Tirupur</option>
                                <option value="Vellore">Vellore</option>
                                <option value="Viluppuram">Viluppuram</option>
                                <option value="Virudhunagar">Virudhunagar</option>
                            {/* ...other options... */}
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-3 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-200"
                >
                    Register
                </button>
            </form>
            <div className="text-center">
                <p className="text-sm text-gray-700">
                    Already registered?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Log in</a>
                </p>
            </div>
        </div>
    </div>
    
    );
};

export default Register;
