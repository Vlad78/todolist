import axios from "axios"

export const instance = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer 2910dedc-7139-42d3-8757-d30d3d4bbbe9",
    "API-KEY": "699ee4e8-5315-4be2-b131-5369858ba62a",
  },
  baseURL: "https://social-network.samuraijs.com/api/1.1",
})
