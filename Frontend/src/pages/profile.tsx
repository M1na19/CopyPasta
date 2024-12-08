import React, { useState, useEffect, createRef, useRef } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import { request, User } from "../requests";

class Profile extends React.Component {
  state = {
    isLoggedIn: false,
    user: {
      username: "Gogu",
      email: "gogu.com",
      uploadTime: new Date(),
      name: null,
      telephone: null,
      description: null,
      image: null,
    } as User,
  };

  componentDidMount(): void {
    request("http://localhost:8000/logged_in", "GET")
      .then((data) => {
        const username = data.username;
        this.setState({ isLoggedIn: true });
        request(
          `http://localhost:8000/get_user_data?username=${username}`,
          "GET",
        ).then((data) => {
          const userData = data.user;
          this.setState({ user: userData });
        });
      })
      .catch(() => {
        history.back();
      });
  }
  render(): React.ReactNode {
    const isLoggedIn = this.state.isLoggedIn;
    const user = this.state.user!;
    return (
      <>
        <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
        <div className="oveflow-scroll-y min-h-full min-w-full">
          <div
            className={`relative flex flex-col items-center justify-center w-full h-1/4 md:h-full max-md:px-[1vw] px-10`}
          >
            <Background />
            <object
              className="md:hidden md:mt-20 inline-block w-full max-w-xs"
              data="/logo.svg"
              type="image/svg+xml"
            ></object>
            <div className="flex max-md:flex-col items-center justify-center w-full">
              <Card className="flex flex-col items-center justify center h-full w-full max-w-[500px] mt-10 md:mt-56 mb-10 px-10 py-20 space-y-10">
                <div className="w-full flex items-center justify-center h-full ">
                  <img
                    className="max-h-96 max-w-96"
                    src={user.image ? user.image : "/profile_def.svg"}
                  ></img>
                </div>
                <div className="mt-20 w-full flex items-center justify-center border-b-2">
                  <b className="text-white text-2xl">{user.username}</b>
                </div>
              </Card>
              <Card className="flex flex-col items-center justify center h-full w-full max-w-[500px] mt-10 md:mt-56 mb-10 py-10 px-20 md:ml-[5vw]">
                <b className=" text-4xl text-white mt-10 text-center">Date</b>
                <div className="flex flex-col mt-10 items-center max-sm:space-y-2 space-y-10 max-y-[100px] w-full">
                  <div className="flex max-md:flex-col items-center space-x-4 border-b-2 border-white w-full">
                    <b className="text-2xl text-white">Nume</b>
                    <p className="text-white text-xl">
                      {user.name ? user.name : "No name"}
                    </p>
                  </div>
                  <div className="flex max-md:flex-col items-center space-x-4 border-b-2 border-white w-full">
                    <b className="text-2xl text-white">Email</b>
                    <p className="text-white text-xl">{user.email}</p>
                  </div>
                  <div className="flex max-md:flex-col items-center space-x-4 border-b-2 border-white w-full">
                    <b className="text-2xl text-white">Telefon</b>
                    <p className="text-white text-xl">
                      {user.telephone ? user.telephone : "No telephone"}
                    </p>
                  </div>
                  <div className="flex max-md:flex-col items-center space-x-4 border-b-2 border-white w-full">
                    <b className="text-2xl text-white">Creat</b>
                    <p className="text-xl text-white">
                      {user.uploadTime.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex max-md:flex-col items-center space-x-4 w-full border-b-2 border-white">
                    <b className="text-2xl text-white">Descriere</b>
                  </div>
                  <div className="flex max-md:flex-col flex-wrap items-center space-x-4 w-full text-xl text-white text-balance overflow-hidden">
                    <p className="break-words">{user.description}</p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="flex flex-wrap justify-center">
              <a
                href="/post_recipe"
                className="bg-green-500 mb-10 mt-20 py-3 px-4 rounded-2xl text-4xl text-white ml-5 mr-5"
              >
                Add a recipe
              </a>
              <a
                href="/mylist"
                className="bg-green-500 mb-10 mt-20 py-3 px-4 rounded-2xl text-4xl text-white ml-5 mr-5"
              >
                See personal list
              </a>
            </div>
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
}
export default Profile;
