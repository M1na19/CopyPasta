import { useState, useEffect, createRef } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import { is_logged_in, request } from "../requests";

function Register() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const usernameRef = createRef<HTMLInputElement>();
  const nameRef = createRef<HTMLInputElement>();
  const emailRef = createRef<HTMLInputElement>();
  const telRef = createRef<HTMLInputElement>();
  const passRef = createRef<HTMLInputElement>();
  const cPassRef = createRef<HTMLInputElement>();
  const descRef = createRef<HTMLTextAreaElement>();
  const imageRef = createRef<HTMLInputElement>();
  useEffect(() => {
    is_logged_in().then((l) => {
      setIsLoggedIn(l);
      if (l == true) {
        history.back();
      }
    });
  }, []);
  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
      <div className="oveflow-scroll-y min-h-full w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-1/4 md:h-full max-md:px-[1vw] px-10`}
        >
          <Background />
          <object
            className="md:hidden md:mt-20 inline-block w-full max-w-xs md:max-w-xl"
            data="/logo.svg"
            type="image/svg+xml"
          ></object>
          <Card className="flex flex-col items-center justify center h-full w-full max-w-[800px] mt-10 md:mt-56 mb-10 px-20">
            <b className="max-md:text-[5vw] text-4xl text-white mt-10 text-center">
              Hai, fă foamea cu noi!
            </b>
            <div className="flex flex-col mt-10 items-center max-sm:space-y-2 space-y-10 max-y-[100px] w-full">
              <div className="flex items-center space-x-4">
                <input
                  id="file-upload"
                  ref={imageRef}
                  type="file"
                  className="hidden"
                ></input>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Alege poza de profil
                </label>
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
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <input
                  ref={usernameRef}
                  type="text"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Nume utilizator"
                ></input>
              </div>
              <div className="flex items-center space-x-4 border-b-2 border-white h-full w-full">
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
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                <input
                  ref={nameRef}
                  type="text"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Nume"
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
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <input
                  ref={emailRef}
                  type="text"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Email"
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
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <input
                  ref={telRef}
                  type="tel"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Telefon"
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
                  ref={passRef}
                  type="password"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Parola"
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
                  ref={cPassRef}
                  type="password"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Confirmare Parola"
                ></input>
              </div>
              <div className="flex items-center space-x-4 border-2 rounded-xl border-white w-full max-h-32">
                <textarea
                  ref={descRef}
                  className="bg-transparent border-transparent outline-none text-white w-full h-full"
                  placeholder="Descriere"
                ></textarea>
              </div>
            </div>
            <button
              className="flex items-center justify-center bg-green-500 mt-[5vw] md:mt-20 mb-10 rounded-2xl"
              onClick={() => {
                const formData = new FormData();
                if (
                  !(
                    usernameRef.current &&
                    emailRef.current &&
                    passRef.current &&
                    cPassRef.current &&
                    cPassRef.current.value == passRef.current.value
                  )
                ) {
                  console.log("Not enough necessary info");
                  return;
                }
                formData.append("username", usernameRef.current.value);
                formData.append("email", emailRef.current.value);
                formData.append("password", passRef.current.value);
                if (nameRef.current && nameRef.current.value != "") {
                  formData.append("name", nameRef.current.value);
                }
                if (telRef.current && telRef.current.value != "") {
                  formData.append("telephone", telRef.current.value);
                }
                if (descRef.current && descRef.current.value != "") {
                  formData.append("description", descRef.current.value);
                }
                if (imageRef.current && imageRef.current.files?.length == 1) {
                  formData.append("file", imageRef.current.files[0]);
                }
                request(
                  "http://localhost:8000/request_sign_up",
                  "POST",
                  formData,
                ).then(() => {
                  window.location.href = "/";
                });
              }}
            >
              <b className="text-white px-10 py-2">Register</b>
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
export default Register;
