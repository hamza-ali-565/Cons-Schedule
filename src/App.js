import React, { useEffect, useState } from "react";
import { useDispatch,} from "react-redux";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Home from "./Screens/ConsSchedule/Home";
import Consultant from "./Screens/Setups/Consultant/Consultant";

function App() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);



  

  return (
  <div>
    <Consultant/>
  </div>
  );
}

export default App;
