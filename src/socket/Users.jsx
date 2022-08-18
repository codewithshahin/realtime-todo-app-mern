import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("https://sa-todo-api.herokuapp.com");
const Users = () => {
  useEffect(() => {
    socket.on("users", (data) => {
      console.log("all users", data);
    });
    return () => {
      socket.off();
    };
  }, []);
  return (
    <div>
      <h1>All Users</h1>
    </div>
  );
};

export default Users;
