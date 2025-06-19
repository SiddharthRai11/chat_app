import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [current, setcurrent] = useState('Signup')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const [agreed, setAgreed] = useState(false);
  //Importing login function from authcontext
  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {

    event.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the terms and privacy policy");
      return;
    }

    if (current === 'Signup' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    login(current === 'Signup' ? 'signup' : 'login', {
      fullName, email, password, bio
    })
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center
    justify-center gap-10 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/*------left-------*/}
      <img src={assets.logo_big} alt='' className='w-[min(30vw,250px)]' />
      {/*-----right-----*/}
      <div>
        <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6
        flex flex-col gap-6 rounded-lg shadow-lg'>
          <h2 className='font-medium text-2xl flex justify-between items-center'>
            {current}
            {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt='' className='w-5 cursor-pointer' />}
          </h2>
          {current === "Signup" && !isDataSubmitted && (
            <input onChange={(e) => setFullName(e.target.value)}
              value={fullName} type='text' className='p-2 border border-gray-500 rounded-md
          focus:outline-none focus:ring-2' placeholder='Full Name' required></input>
          )}
          {!isDataSubmitted && (
            <>
              <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='Email Address' required className='p-2 border
          border-gray-500 rounded-md focus-outline-none focus:ring-2 
          focus:ring-indigo-500'/>
              <input onChange={(e) => setPassword(e.target.value)}
                value={password} type='password' placeholder='Passsword' required className='p-2 border border-gray-500 rounded-md focus-outline-none focus:ring-2 
          focus:ring-indigo-500'/>

            </>

          )}
          {current === 'Signup' && isDataSubmitted && (
            <textarea onChange={(e) => setBio(e.target.value)} value={bio}
              rows={4} className=' p-2 border border-gray-500 rounded-md focus-outline-none focus:ring-2 
          focus:ring-indigo-500' placeholder='provide a short bio...' required>

            </textarea>
          )}
          {/*<button type='submit' className='py-3 bg-gradient-to-r from-purple-400
          to-violet-600 text-white rounded-md cursor-pointer'>
            {current==='Signup'?'Create Account':'Login Now'}
          </button>*/}
          <button
            type="submit"
            disabled={!agreed} // ← optional condition (e.g. terms checkbox)
            className={`
    py-3 px-6 w-full text-white rounded-md font-semibold transition-all duration-200
    ${agreed ? 'bg-gradient-to-r from-purple-400 to-violet-600 hover:opacity-90' : 'bg-gray-500 cursor-not-allowed'}
  `}
          >
            {current === 'Signup' ? 'Create Account' : 'Login Now'}
          </button>

          <div className='flex justify-between items-center gap-2 text-sm
          text-gray-500'>
            <input type='checkbox' id="terms" checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)} className="mr-2"></input>
            {/*<p>Agree to the terms of use & privacy policy</p>*/}
            <label htmlFor="terms" className="text-sm text-gray-300">
              Agree to the terms of use & privacy policy</label>
          </div>
          <div className='flex flex-col gap-2'>
            {current === 'Signup' ?
              (<p className='text-sm text-gray-600'>Already have an acoount?
                <span onClick={() => { setcurrent('Login'); setIsDataSubmitted(false) }} className='font-medium text-violet-500 mx-2 cursor-pointer'>Login here..</span></p>)
              : (<p className='text-sm text-gray-600'>Create an account
                <span onClick={() => setcurrent('Signup')} className='font-medium text-violet-500 mx-2 cursor-pointer'>Click here..</span></p>)}
          </div>

        </form>

      </div>
    </div>
  )
}

export default LoginPage
