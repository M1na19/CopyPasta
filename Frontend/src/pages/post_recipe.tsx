import { useState, useEffect } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import Cookies from "js-cookie"
import { redirect } from "react-router-dom";

function Poster(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get("RefreshToken");
        if (token) {
          setIsLoggedIn(true);
          redirect('/');
        } else {
          setIsLoggedIn(false);
        }
    }, []);
    return (
      <>
        <NavbarCopyPasta signed_in={isLoggedIn} current_page='Home'/>
        <div className='oveflow-scroll-y min-h-full w-screen'>
          <div className={`relative flex items-center justify-center w-full h-1/4 md:h-full`} >
            <Background/>
            <Card className="flex flex-col items-center h-full w-[700px] mt-56 px-10 mb-10">                
                <div className="flex items-center mt-32 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Nume utilizator"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Nume"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Email"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <input type="tel" className="bg-transparent border-transparent outline-none text-white" placeholder="Telefon"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Parola"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Confirmare Parola"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-2 rounded-xl border-white w-full h-32">
                    <textarea className="bg-transparent border-transparent outline-none text-white w-full h-full" placeholder="Descriere"></textarea>
                </div>
                <button className="flex items-center justify-center bg-green-500 mt-20 mb-10 rounded-2xl">
                    <b className="text-white px-10 py-2">Register</b>
                </button>
            </Card>
          </div>
        </div>
      </>
    )
}
export default Poster