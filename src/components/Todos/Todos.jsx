import "./Todos.css";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AddTodo from "../Add/AddTodo";
import { io } from "socket.io-client";
import moment from "moment";
const socket = io(process.env.REACT_APP.API_URL);
const Todos = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [todos, setTodos] = useState([]);
  const [edited, setEdited] = useState("");
  const [id, setId] = useState("");

  //update
  const updateTodo = () => {
    axios
      .put(`${process.env.REACT_APP.API_URL}/todos/${id}`, {
        name: edited,
      })
      .then((res) => {})
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setId("");
        setEdited("");
        setIsEdit(false);
      });
  };

  //marked as done
  const handleDone = (id) => {
    axios
      .put(`${process.env.REACT_APP.API_URL}/todos/${id}`, {
        done: true,
      })
      .then((res) => {})
      .catch((err) => {
        alert(err.message);
      });
  };

  //marked as undone
  const handleClear = (id) => {
    axios
      .put(`${process.env.REACT_APP.API_URL}/todos/${id}`, {
        done: false,
      })
      .then((res) => {})
      .catch((err) => {
        alert(err.message);
      });
  };

  //delete
  const deleteTodo = (id) => {
    axios
      .delete(`${process.env.REACT_APP.API_URL}/todos/${id}`)
      .then((res) => {
        // setTodos(todos.filter((i) => i._id != id));
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  useEffect(() => {
    socket.on("newtodo", (data) => {
      setTodos((prev) => [...prev, data]);
    });
    //update in state
    socket.on("todoupdated", (data) => {
      const { _id, updatedFields } = data;
      setTodos((prev) => {
        const oldTodos = [...prev];
        return oldTodos.map((todo) => {
          if (todo._id == _id) {
            return { ...todo, ...updatedFields };
          } else {
            return { ...todo };
          }
        });
      });
    });

    socket.on("totodeleted", (id) => {
      setTodos((prev) => {
        const oldtodos = [...prev];
        return oldtodos.filter((i) => i._id != id);
      });
    });
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP.API_URL}/todos`)
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        alert(err.message);
        setTodos([]);
      });
  }, []);

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="card  mx-auto">
            <div className="card-header">
              <h3 className="h-5 text-center">Realtime Todo APP</h3>
              <AddTodo
                isEdit={isEdit}
                edited={edited}
                setEdited={setEdited}
                updateTodo={updateTodo}
              />
            </div>
            <div className="card-body">
              <p className="p-0 m-0">All Todos</p>
              <ul className="list-group">
                {todos.length < 0 ? (
                  <p>No todo found!</p>
                ) : (
                  todos.map((todo) => (
                    <li
                      className={`list-group-item ${
                        todo.done ? "active mb-2" : ""
                      }`}
                      key={todo._id}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-1">{todo.name}</div>
                        <div className="flex-1">
                          <p
                            className="p-0 m-0"
                            title={new Date(todo.createdAt).toLocaleString()}
                          >
                            added: {moment(todo.createdAt).fromNow()}
                          </p>
                          <p
                            className="p-0 m-0"
                            title={new Date(todo.updatedAt).toLocaleString()}
                          >
                            updated: {moment(todo.updatedAt).fromNow()}
                          </p>
                        </div>
                        <div className="flex-1 d-flex justify-content-end">
                          {todo.done ? (
                            <button
                              onClick={() => handleClear(todo._id)}
                              className="btn btn-success btn-sm"
                            >
                              Clear
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDone(todo._id)}
                              className="btn btn-warning btn-sm"
                            >
                              Mark
                            </button>
                          )}
                          <button
                            onClick={(id) => deleteTodo(id)}
                            className="btn btn-danger btn-sm mx-1"
                          >
                            &times;
                          </button>
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setId(todo._id);
                              setEdited(todo.name);
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            &#9998;
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todos;
