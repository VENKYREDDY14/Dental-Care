import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [isDoctorLogin, setIsDoctorLogin] = useState(false); // Toggle between User and Doctor login

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const adminGmail = process.env.REACT_APP_ADMIN_GMAIL;
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlingLogin = async (data) => {
    const { gmail, password } = data;

    // Admin login logic
    if (gmail === adminGmail && password === adminPassword) {
      toast.success('Admin login successful');
      return navigate('/admin'); // Redirect to Admin page
    }

    // Determine login endpoint based on user type
    const endpoint = isDoctorLogin ? 'doctor' : 'user';
    const userDetails = { email: gmail, password };

    try {
      const response = await axios.post(`${backendUrl}/api/${endpoint}/login`, userDetails);

      if (response.status === 200) {
        const { jwtToken, role } = response.data;
        console.log(role)
        if (jwtToken) {
          localStorage.setItem('jwtToken', jwtToken); // Store the token in localStorage
          toast.success('Login Successful');

          // Redirect based on role
          if (role === 'patient') {
            navigate('/'); // Redirect to patient home page
          } else if (role === 'doctor') {
            navigate('/dappointments'); // Redirect to doctor dashboard
          } else {
            toast.error('Invalid role. Please contact support.');
          }
        } else {
          toast.error('Token not received. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login Error:', error.message); // Debugging log
      setErrorStatus(true);
      toast.error('Invalid credentials or something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-md ${!isDoctorLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsDoctorLogin(false)}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${isDoctorLogin ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setIsDoctorLogin(true)}
          >
            Doctor Login
          </button>
        </div>

        <form onSubmit={handleSubmit(handlingLogin)} className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-700 text-center">
            {isDoctorLogin ? 'Doctor Login' : 'User Login'}
          </h2>
          <p className="text-gray-500 text-center">Login to your account</p>

          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="gmail"
              {...register('gmail', { required: 'Email is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
            />
            {errors.gmail && <p className="text-red-500 text-sm">{errors.gmail.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', { required: 'Password is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-password"
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>

          {errorStatus && <p className="text-red-500 text-center">Invalid credentials</p>}

          <div className="text-center">
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;