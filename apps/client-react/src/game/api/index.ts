import axios from 'axios';

import { TTEMPORARYUserData } from '../classes/Authorization';
import { currentAuth } from '../main';

export const api = axios.create({
  baseURL: "http://localhost:3002/api",
  //   withCredentials: true,
});

export const login = async (uid: string) => {
  const res = await api.post("/users/login", { uid });
  return res.data as TTEMPORARYUserData;
};

export const setLocation = async (data: {
  location: string;
  entry: string;
  x: number;
  y: number;
}) => {
  const res = await api.post("/users/setLocation", {
    uid: currentAuth.user.uid,
    ...data,
  });
  return res.data;
};