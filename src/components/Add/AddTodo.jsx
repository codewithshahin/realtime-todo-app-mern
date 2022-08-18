import React from "react";
import { useState } from "react";
import axios from "axios";
const AddTodo = ({ isEdit, edited, setEdited, updateTodo }) => {
  const [todo, setTodo] = useState("");
  const addTodo = () => {
    if (!todo.length) return;
    axios
      .post(`${process.env.REACT_APP.API_URL}/todos/new`, {
        name: todo,
      })
      .then((res) => {
        // alert("todo added");
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setTodo("");
      });
  };
  return (
    <div className="container">
      {isEdit ? (
        <div className="row align-items-center">
          <div className="col-lg-10">
            <input
              type="text"
              placeholder="enter todo"
              className="form-control"
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
            />
          </div>
          <div className="col-lg-2">
            <button
              className="btn w-100 btn-primary btn-sm"
              onClick={updateTodo}
            >
              Update
            </button>
          </div>
        </div>
      ) : (
        <div className="row align-items-center">
          <div className="col-lg-10">
            <input
              type="text"
              placeholder="enter todo"
              className="form-control"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
          </div>
          <div className="col-lg-2">
            <button className="btn w-100 btn-primary btn-sm" onClick={addTodo}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTodo;
