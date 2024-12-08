import axios, { AxiosError } from "axios";

export interface Recipe {
  uuid: string;
  name: string;
  rating: number | null;
  images: string[] | null;
  users: {
    username: string;
  };
  types: {
    name: string;
  };
  cookingTime: number | null;
  difficulty: number | null;
  description: string | null;
  uploadTime: Date;
}
export interface Review {
  users: {
    username: string;
  };
  uploadTime: Date;
  rating: number;
  comment: string | null;
}
export interface Type {
  name: string;
}
export interface User {
  username: string;
  name: string | null;
  email: string;
  image: string | null;
  telephone: string | null;
  description: string | null;
  uploadTime: Date;
}
axios.defaults.withCredentials = true;
export function request(
  url: string,
  req_type: string,
  body?: any,
): Promise<any> {
  return axios({
    url: url,
    method: req_type,
    data: body, // Correct property for the request body
  })
    .then((res) => {
      return res.data; // This value is passed to the caller
    })
    .catch((e: AxiosError) => {
      console.error(e);
      if (e.status == 401) {
        request("http://localhost:8000/refresh", "POST").then(() => {
          return request(url, req_type);
        });
      }
      throw e; // Ensure the caller can handle the error
    });
}
export function is_logged_in() {
  return request("http://localhost:8000/logged_in", "GET")
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
}
