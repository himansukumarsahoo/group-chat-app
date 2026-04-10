import React from 'react'
import chatIcon from "../Assets/chat.png"
import { useState } from 'react'
import { toast } from 'react-toastify'
import { createROOM, joinChatApi } from '../services/RoomServices'
import { useChatContext } from '../context/Chatcontext'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Home = () => {

  const [details,setDetails]=useState({
    roomId:"",
    userName:""
  })
  const {currentUser, setCurrentUser, roomID, setroomID,connected,setConnected}=useChatContext();
  const navigate=useNavigate();

  const handleInput =(e)=>{
    setDetails({...details,[e.target.name]:e.target.value})
  }
  const validateForm = ()=>{
    if(details.roomId=="" || details.userName==""){
      toast.error("invalid credentials")
      return false
    }
    return true
  }

  const joinRoom =async ()=>{
    if(validateForm()){
      try {
        const room = await joinChatApi(details.roomId)
        toast.success("Room joined successfully..")
        setCurrentUser(details.userName)
        setroomID(room.roomId)
        setConnected(true)
        navigate("/chat")

      } catch (error) {
        toast.error("error in joining room")
        console.log(error);
      }
    }
  }
  const createRoom =async()=>{
    if(validateForm()){
      console.log(details);
      try {
        const response =  await createROOM(details.roomId)
        console.log(response);
        toast.success("Room Created Successfully")
        setCurrentUser(details.userName)
        setroomID(response.roomId)
        setConnected(true)
        navigate("/chat")
      } catch (error) {
        console.log(error);
        if(error.status==400){
          toast.error("Room is already created.")
        }else{
          console.log("something wrong");
        }
      }
    }
  }


  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 px-4'>
      <div className='relative p-6 sm:p-10 border border-gray-200 dark:border-gray-700 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-colors duration-300 flex flex-col gap-5'>
        <div className='absolute top-4 right-4 sm:top-6 sm:right-6'>
          <ThemeToggle />
        </div>

        <div className='w-16 mx-auto'>
          <img src={chatIcon} alt="Chat Icon" />
        </div>

        <h1 className='text-2xl font-semibold text-center'>Join or Create Room</h1>
        
        {/* this is for name of user */}
        <div>
            <label htmlFor="name" className='block font-medium mb-2'>Your Name</label>
            <input type="text" name="userName" placeholder='Enter Your Name' value={details.userName} id="name" onChange={handleInput} className='w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300'/>
        </div>
        
        {/* this is for room id */}
        <div>
            <label htmlFor="roomid" className='block font-medium mb-2'>Room ID / New Room ID</label>
            <input type="text" name="roomId" placeholder='Enter Room Id' value={details.roomId} id="roomid" onChange={handleInput} className='w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300'/>
        </div>
        
        {/* this is for button */}
        <div className='flex flex-col sm:flex-row justify-center gap-4 mt-4'>
          <button onClick={joinRoom} className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors duration-300 rounded-xl font-semibold shadow hover:shadow-lg">
            Join Room
          </button>
          <button onClick={createRoom} className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white transition-colors duration-300 rounded-xl font-semibold shadow hover:shadow-lg">
            Create Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home