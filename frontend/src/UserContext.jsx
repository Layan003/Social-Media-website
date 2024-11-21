import React from "react";
import { useState, useContext, createContext } from "react";
import api from "./api";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null, 
        username: '',
    })

    const updateUser = (newUserData) => {
        setUser(newUserData)
    }

    const fetchUserData = async () => {
        try {
          const res = await api.get("user/");
          if( res.status === 200) {
            const userData = {
              id: res.data.id,
              username: res.data.username,
            };
            updateUser(userData);
          } 
        } catch (error) {
          console.log(error);
        }
      }

    return (
        <UserContext.Provider value={{ user, updateUser, fetchUserData }}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => {
    return useContext(UserContext);
}