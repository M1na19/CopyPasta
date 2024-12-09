import { useState, useEffect, createRef } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import Cookies from "js-cookie";
import { is_logged_in, request } from "../requests";

function Forgor_Fill() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const newPassRef = createRef<HTMLInputElement>();
  const newPassConfirmRef = createRef<HTMLInputElement>();
  useEffect(() => {
    is_logged_in().then((l) => setIsLoggedIn(l));
  }, []);
  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
      <div className="oveflow-scroll-y min-h-ful w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-1/4 md:h-full max-md:px-[1vw] px-10`}
        >
          <Background />
          <object
            className="md:hidden md:mt-20 inline-block w-full max-w-xs"
            data="/logo.svg"
            type="image/svg+xml"
          ></object>
          <Card className="flex flex-col items-center justify center h-full w-full max-w-[500px] mt-10 md:mt-56 mb-10 px-20">
            <b className="max-md:text-[5vw] text-4xl text-white mt-10 text-center">
              Forgot password
            </b>
            <div className="flex flex-col mt-10 items-center max-sm:space-y-2 space-y-10 max-y-[100px] w-full">
              <div className="flex items-center space-x-4 border-b-2 border-white w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="stroke-white max-sm:min-w-[7vw] max-sm:h-[7vw] h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  ref={newPassRef}
                  type="password"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Parola Noua"
                ></input>
              </div>
              <div className="flex items-center space-x-4 border-b-2 border-white w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="stroke-white max-sm:min-w-[7vw] max-sm:h-[7vw] h-10"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <input
                  ref={newPassConfirmRef}
                  type="password"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Confirma Parola"
                ></input>
              </div>
            </div>
            <button className="flex items-center justify-center bg-green-500 mt-[5vw] md:mt-20 mb-10 rounded-2xl">
              <b
                className="text-white px-10 py-2"
                onClick={() => {
                  if (
                    newPassRef.current?.value !=
                    newPassConfirmRef.current?.value
                  ) {
                    console.warn("Password doesnt match");
                    return;
                  }
                  request(
                    `http://localhost:8000/change_password/${window.location.pathname.split("/").at(-1)}`,
                    "POST",
                    {
                      password: newPassRef.current?.value,
                    },
                  ).then(() => (window.location.href = "/"));
                }}
              >
                Send
              </b>
            </button>
          </Card>
        </div>
      </div>
      <div className="relative md:hidden flex items-center">
        <img
          className="mt-20 object-cover h-40 w-full"
          src="/foot_mobile.svg"
          alt="Footer"
        />
      </div>
    </>
  );
}
export default Forgor_Fill;
