import React, { useState, createRef, useEffect } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import Cookies from "js-cookie";
import { request, Type } from "../requests";
import { is_logged_in } from "../requests";

class TypesList extends React.Component {
  state = {
    search: "", // The search input value
    data: [] as Type[], // All data
    render: [] as Type[], // Data to be rendered (filtered data)
  };

  // Create a reference for the search input
  searchRef = createRef<HTMLInputElement>();
  dropdownRef = createRef<HTMLUListElement>();
  componentDidMount(): void {
    request("http://localhost:8000/get_types", "GET").then((data) => {
      const types: Type[] = data.types;
      const searchValue = this.searchRef.current?.value || "";
      const searched = types.filter((type) => type.name.includes(searchValue));
      this.setState({ search: searchValue, data: types, render: searched });
    });
  }

  handleSearchChange = () => {
    const searchValue = this.searchRef.current?.value || "";
    const searched = this.state.data.filter((type) =>
      type.name.includes(searchValue),
    );
    this.setState({ search: searchValue, render: searched });
  };
  openDropDown = () => {
    if (this.dropdownRef.current) {
      this.dropdownRef.current.classList.remove("hidden");
      this.handleSearchChange();
    }
  };
  hideDropDown = () => {
    if (this.dropdownRef.current) {
      this.dropdownRef.current.classList.add("hidden");
    }
  };
  render(): React.ReactNode {
    const list_items = this.state.render.map((type, idx) => (
      <li
        key={idx}
        className="px-10 py-1 text-blue-700 hover:bg-blue-500 hover:text-white rounded-md"
        onClick={() => {
          if (this.searchRef.current) {
            this.searchRef.current.value = type.name;
          }
        }}
      >
        {type.name}
      </li>
    ));

    return (
      <>
        {/* Search input */}
        <div className="border-b-2 border-white w-full outline-none bg-transparent">
          <input
            ref={this.searchRef}
            type="text"
            onFocus={this.openDropDown}
            onChange={this.handleSearchChange}
            onBlur={() => {
              setTimeout(this.hideDropDown, 100);
            }}
            className="bg-transparent outline-none text-white w-full border-0"
            placeholder="Tipul retetei"
          />
        </div>
        <ul
          ref={this.dropdownRef}
          className="flex-col w-full bg-white rounded-md hidden"
        >
          {list_items}
        </ul>
      </>
    );
  }
}
function Poster() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    is_logged_in().then((l) => {
      setIsLoggedIn(l);
      if (l == false) {
        history.back();
      }
    });
  }, []);

  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
      <div className="oveflow-scroll-y min-h-full w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-1/4 md:h-full max-md:px-[1vw] px-10 `}
        >
          <Background />
          <object
            className="md:hidden md:mt-20 inline-block w-full max-w-xs"
            data="/logo.svg"
            type="image/svg+xml"
          ></object>
          <Card className="flex flex-col items-center justify center h-full w-full max-w-[500px] mt-10 md:mt-56 mb-10 px-20">
            <b className="max-md:text-[5vw] text-4xl text-white mt-10 text-center">
              Posteaza retete!
            </b>

            <div className="flex flex-col mt-10 items-center max-sm:space-y-2 space-y-10 max-y-[100px] w-full">
              <div className="flex items-center space-x-4">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                ></input>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
                >
                  Alege poze reteta
                </label>
              </div>
              <div className="flex items-center space-x-4 border-b-2 border-white w-full">
                <input
                  type="text"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                  placeholder="Nume reteta"
                ></input>
              </div>
              <div className="flex flex-col h-full w-full">
                <TypesList />
              </div>
              <div className="flex items-center space-x-4 border-b-2 border-white w-full">
                <b className="text-white">Dificultate</b>
                <input
                  type="range"
                  className="bg-transparent border-transparent outline-none text-white w-full"
                ></input>
              </div>
              <div className="flex items-center space-x-4 border-b-2 border-white w-full">
                <b className="text-white">Timp(min)</b>
                <input
                  type="number"
                  className="bg-transparent text-center border-transparent outline-none text-white w-full"
                ></input>
              </div>
              <div className="flex items-center space-x-4 border-2 rounded-xl border-white w-full max-h-32">
                <textarea
                  className="bg-transparent border-transparent outline-none text-white w-full h-full"
                  placeholder="Descriere"
                ></textarea>
              </div>
            </div>

            <button className="flex items-center justify-center bg-green-500 mt-[5vw] md:mt-10 mb-10 rounded-2xl">
              <b className="text-white px-10 py-2">Posteaza</b>
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
export default Poster;
