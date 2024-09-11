import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import DischargeSummary from "./Screens/IPD/Discharge/DischargeSummary/DischargeSummary";

function App() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    CheckLog();
    getShift();
  }, []);

  const LoginCheck = useSelector((state) => state.toggle);
  const url = useSelector((state) => state.url);

  const CheckLog = async () => {
    setOpen(true);
    try {
      const response = await axios.get(`${url}/product`, {
        withCredentials: true,
      });
      console.log("response of product api", response);
      dispatch(setLoginToggle(true));
      dispatch(setResponse(response.data.data));
      setOpen(false);
    } catch (error) {
      console.log("error of product api", error);
      dispatch(setLoginToggle(false));
      setOpen(false);
    }
  };
  const getShift = async () => {
    try {
      const response = await axios.get(`${url}/shift`, {
        withCredentials: true,
      });
      dispatch(setShift(response.data.data));
      console.log("response of getData", response);
    } catch (error) {
      console.log("Error of getShift", error);
    }
  };
  return (
  <div>
    <DischargeSummary/>
  </div>
  );
}

export default App;
