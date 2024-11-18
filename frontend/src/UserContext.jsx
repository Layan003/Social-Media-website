import React from "react";
import { useState, useContext, createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null, 
        username: '',
    })

    const updateUser = (newUserData) => {
        setUser(newUserData)
    }

    return (
        <UserContext.Provider value={{ user, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => {
    return useContext(UserContext);
}