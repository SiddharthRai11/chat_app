import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl=import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendUrl;


export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem('token'))
    //Token is stored in the local storage of the browser when the user logs in and signup
    const [authUser,setAuthUser]=useState(null);
    const [onlineUsers,setonlineUsers]=useState([]);
    const [socket,setSocket]=useState(null);

    //Check is user is authenticated and if yes, set the user data and connect the socket
    const checkAuth=async()=>{
        try {
            const {data}=await axios.get('/api/auth/check');
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    // Login function to handle user Authentication and socket connection
    const login=async(state,credentials)=>{
        //state may be login or Signup
        //credential include the details
        try {
          /*  console.log("Sending credentials:", credentials);
            const {data}= await axios.post(`/api/auth/${state}`,credentials);
            console.log("Login Response:", data);*/
             console.log("Sending credentials:", credentials);
            const response = await axios.post(`/api/auth/${state}`, credentials);
            console.log("Login Response:", response.data, "Raw response:", response);

             const data = response.data;

            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token);
                localStorage.setItem('token',data.token);
                console.log("Login Response:", data);
                toast.success(data.msg);
                

            }else{
               console.log('Backend responded with failure:', data);
               toast.error(data.msg || "Something went wrong");
               return false;
                
            }

        } catch (error) {
            toast.error(error.message);
            console.log('error here 111')
            return false;
        }
    }
    //Logout function to handle user logout and socket disconnection
    const logout= async()=>{
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setonlineUsers([]);
        axios.defaults.headers.common['token']=null;
        socket.disconnect();
        toast.success('Logged out successfully')
    }
    //Update profile function to handle user profile update
    const updateProfile=async(body)=>{
        try {
            const {data}=await axios.put('/api/auth/upadate-profile',body);
            if(data.success){
                setAuthUser(data.user);
                toast.success('Profile Updated successfully');
            }
        } catch (error) {
            console.log('error here 222')
            toast.error(error.message)
        }
    }

    //Connect socket function to handle socket connection and online users update
    const connectSocket=(userData)=>{
        if(!userData||socket?.connected) return;
        const newSocket=io(backendUrl,{
            query:{
                userId:userData._id
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on('getOnlineUsers',(userIds)=>{
             setonlineUsers(userIds);
        })
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['token']=token;
            //Attachimg token to every axios request
        }
        checkAuth();
    },[])

    const value={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile

    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
//children is a special prop that represents anythig you wrap
//inside the AuthProvider component. It can be a JSX element, a function, or anything else.
//