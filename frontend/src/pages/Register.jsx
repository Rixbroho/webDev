import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createUserApi } from '../services/api';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validation()) return

    try{
      const response = await createUserApi(formData);
      
      if(response.data.success){
        toast.success("Registration successful");
      }
      else{
        toast.error("error in registration");
      }
    }catch(err){
      toast.error("Registration failed");
    }
    console.log(formData) // send to backend later
  }

  const validation=()=>{
    // add validation logic here
    if(!formData.username.trim()){
      toast.error("Username is required");
      return false;
    }
    if(!formData.email.trim()){
      toast.error("Email is required");
      return false;
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)){
      toast.error("Email is invalid");
      return false;
    }
    if(!formData.password){
      toast.error("Password is required");
      return false;
    }
    if(formData.password.length<6){
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if(formData.password!==formData.confirmPassword){
      toast.error("Passwords do not match");
      return false;
    }
    
    return true;
  }

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <label htmlFor='username'>Username</label>
        <input
          type="text"
          name="username"
          placeholder='username'
          value={formData.username}
          onChange={handleChange}
        />

        {/* Email */}
        <label htmlFor='email'>Email</label>
        <input
          type="email"
          name="email"
          placeholder='mail'
          value={formData.email}
          onChange={handleChange}
        />

        {/* Password */}
        <label htmlFor='password'>Password</label>
        <input
          type="password"
          name="password"
          placeholder='password'
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor='password'>Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder='confirm password'
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {/* Role */}
        <label htmlFor='role'>I am a:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">Foodie (Customer)</option>
          <option value="owner">Restaurant Owner</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  )
}

export default Register
