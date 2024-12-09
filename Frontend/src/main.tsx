import { createRoot } from "react-dom/client";
import "./output.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/front.tsx";
import LogIn from "./pages/log_in.tsx";
import Register from "./pages/register.tsx";
import Forgor from "./pages/forgor.tsx";
import Poster from "./pages/post_recipe.tsx";
import Profile from "./pages/profile.tsx";
import Search from "./pages/search.tsx";
import MyList from "./pages/list.tsx";
import Forgor_Fill from "./pages/forgor_confirm.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Main />}></Route>
      <Route path="/log_in" element={<LogIn />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/forgot" element={<Forgor />}></Route>
      <Route path="/post_recipe" element={<Poster />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/recipes" element={<Search />}></Route>
      <Route path="/mylist" element={<MyList />}></Route>
      <Route path="/recover/*" element={<Forgor_Fill />}></Route>
    </Routes>
  </BrowserRouter>,
);
