import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';

const Register = ({loadUser}) => {
    const [loading , setLoading] = useState(false);
    const [email , setEmail ]= useState('')
    const [username , setusername ]= useState('')
    const [password , setpassword ]= useState('')
    const [ConfirmPass , setConfirmPass ]= useState('')
    const navigate = useNavigate();



    const handleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/user/register' , {
                method:'POST',
                headers : {'Content-Type' : 'application/json'},
                body :JSON.stringify({
                    username : username ,
                    email : email ,
                    password : password ,
                    ConfirmPass : ConfirmPass,
                })
            });
            let data ;
            data = await response.json();
            console.log(data)
            if(data.message === 'Register successful!'){
            toast.success('account created successfully ' , {autoClose : 1500})
            setTimeout(() => navigate('/login'), 1500);
            }else{
                toast.error(data)
            }
            
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
            console.log(err); 
        }finally{
            setLoading(false);
        }

    }

    if (loading)     
      return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="p-6 rounded-lg shadow-md bg-white border border-gray-200">
          <ThreeDot color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]} />
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative flex flex-col p-8 m-6 space-y-6 bg-white shadow-2xl rounded-2xl w-96">
        <span className="mb-3 text-4xl font-bold">Welcome...</span>
        <span className="font-light text-gray-500">Create you account here </span>

        <div className="w-full">
          <label className="mb-2 text-md font-medium">User name</label>
          <input
            onChange={e => setusername(e.target.value)}
            type="name"
            name="username"
            className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
            placeholder="Enter your username"
          />
        </div>

        <div className="w-full">
          <label className="mb-2 text-md font-medium">Email</label>
          <input
            onChange={e => setEmail(e.target.value)}
            type="email"
            name="email"
            className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="w-full">
          <label className="mb-2 text-md font-medium">Password</label>
          <input
            onChange={e => setpassword(e.target.value)}           
            type="password"
            name="password"
            className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="w-full">
          <label className="mb-2 text-md font-medium">
            Confirm Password
            </label>
          <input
            onChange={e => setConfirmPass(e.target.value)}            
            type="password"
            name="ConfirmPass"
            className="w-full p-2 border border-gray-300 rounded-md placeholder:text-gray-500"
            placeholder="Confirm the password"
          />
        </div>

        

        <button
          onClick={handleSubmit}
          className={`w-full bg-black text-white p-3 rounded-lg 
            font-semibold hover:bg-white hover:text-black border border-black transition `} >
          Create new account 
        </button>

        

        
      </div>

      <ToastContainer />
    </div>
  )
}

export default Register