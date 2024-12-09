import React, { createRef, useEffect, useState } from "react";
import { Background, NavbarCopyPasta, StarBuilder } from "./modules";
import Cookies from "js-cookie";
import { Recipe, request } from "../requests";
import { is_logged_in } from "../requests";

import RecipePopUp from "./recipe";

class RecipePromo extends React.Component {
  state = {
    data: [] as Recipe[],
    showing: null as string | null,
  };
  componentDidMount(): void {
    request("http://localhost:8000/recipes", "GET").then((data) => {
      let recipes: Recipe[] = data.recipes;
      recipes.sort((a, b) => {
        return (a.rating || 0) - (b.rating || 0);
      });
      let nr = 1;
      const { innerWidth: width } = window;
      if (width > 800) nr++;
      if (width > 1200) nr++;
      recipes = recipes.slice(0, nr);

      recipes.map((rec) => {
        if (rec.images == null) {
          rec.images = ["basic.webp"];
        }
      });
      this.setState({ data: recipes });
    });
  }
  componentDidUpdate(): void {
    let recipes: Recipe[] = this.state.data;
    recipes.sort((a, b) => {
      return (a.rating || 0) - (b.rating || 0);
    });
    let nr = 1;
    const { innerWidth: width } = window;
    if (width > 800) nr++;
    if (width > 1200) nr++;
    recipes = recipes.slice(0, nr);
  }
  render(): React.ReactNode {
    const images: React.ReactNode[] = [];
    this.state.data.forEach((rec, idx) => {
      if (rec.images == null || rec.images[0] == "") {
        rec.images = ["/images/basic.webp"];
      }
      images.push(
        <React.Fragment key={idx}>
          <button
            className="flex items-center border-black border-2 h-full w-full"
            onClick={() => {
              this.setState({ showing: rec.uuid });
            }}
          >
            {this.state.showing === rec.uuid && (
              <RecipePopUp
                uuid={rec.uuid}
                reseter={() => {
                  this.setState({ showing: "" }, () => {
                    this.setState({ showing: null });
                    document.body.style.overflow = "auto";
                  });
                }}
              />
            )}
            <img
              src={`${rec.images![0]}`}
              className="max-w-56 h-56 border-r-green-700 border-2"
            />
            <div className="bg-white max-w-56 h-56 flex flex-col items-center">
              <b className="text-xl mt-8">{rec.name}</b>
              <div className="mt-2">
                <StarBuilder num_stars={rec.rating || 0} />
              </div>
              <p className="mt-7">Author:</p>
              <p>{rec.users.username}</p>
            </div>
          </button>
        </React.Fragment>,
      );
    });
    return images;
  }
}

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    is_logged_in().then((l) => setIsLoggedIn(l));
  }, []);
  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
      <div className="h-screen w-screen">
        <div
          className={`relative flex items-center justify-center w-full h-1/4 md:h-full`}
        >
          <Background />
          <object
            className="md:mt-20 inline-block h-auto w-full max-w-xs md:max-w-xl"
            data="/logo.svg"
            type="image/svg+xml"
          ></object>
        </div>
        <div className="flex flex-col items-center justify-between bg-blue-900 w-full md:space-y-10">
          <b className="text-center text-white text-4xl  md:text-6xl mt-10 mb-20">
            Top Rated Recipes
          </b>
          <div className="md:flex items-center justify-between space-x-20 pb-10">
            <RecipePromo />
          </div>
        </div>
        <div className="bg-white flex flex-col">
          <div className="mt-10 flex max-md:flex-col md:space-x-32 w-full items-center justify-center px-10">
            <div className="flex flex-col max-w-[30rem] w-full">
              <b className="text-4xl text-green-700">Contact us</b>
              <input
                className="mt-12 h-10 w-full border-green-700 border-2"
                placeholder="First Name"
              ></input>
              <input
                className="mt-10 h-10 w-full border-green-700 border-2"
                placeholder="Last Name"
              ></input>
              <input
                className="mt-10 h-10 w-full border-green-700 border-2"
                placeholder="Email"
              ></input>
            </div>
            <div className="flex flex-col items-center max-w-[30rem] w-full justify-center">
              <div className="mt-10 md:mt-40"></div>
              <textarea
                className="h-48 w-full border-green-700 border-2"
                placeholder="Message"
              ></textarea>
              <div className="mt-10 w-full flex flex-row-reverse items-center">
                <button className="bg-green-700 px-4 py-2 text-white rounded-2xl">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="relative hidden md:flex items-center">
            <img
              className="mt-20 object-cover h-40 w-full"
              src="/foot.svg"
              alt="Footer"
            />

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-10">
              <img className="h-10 mb-10" src="/insta.svg" alt="Instagram" />
              <img className="h-10 mb-10" src="/facebook.svg" alt="Facebook" />
              <img className="h-10 mb-10" src="/YT.svg" alt="YouTube" />
              <img className="h-10 mb-10" src="/Twitch.svg" alt="Twitch" />
            </div>
          </div>
          <div className="relative md:hidden flex items-center">
            <img
              className="mt-20 object-cover h-40 w-full"
              src="/foot_mobile.svg"
              alt="Footer"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
