import { useEffect, useState } from 'react'
import { Background, NavbarCopyPasta } from './modules'
import Cookies from "js-cookie"
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const token = Cookies.get("RefreshToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
  }, []);
  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page='Home'/>
      <div className='oveflow-scroll h-screen w-screen'>
        <div className={`relative flex items-center justify-center w-full h-1/3 md:h-full`} >
          <Background/>
          <object 
            className="mt-20 inline-block h-auto w-full max-w-xs md:max-w-xl" 
            data='/logo.svg'
            type="image/svg+xml"
          >
          </object>
        </div>
        <div className='flex flex-col items-center bg-blue-900 h-1/3 w-full md:space-y-10'>
          <b className='text-center text-white text-2xl  md:text-6xl mt-10 mb-20'>Top Rated Recipes</b>
          <div className='flex items-center justify-between'>
              
          </div>
        </div>
        <div className=''>

        </div>
      </div>
      
    </>
  )
}

export default App
