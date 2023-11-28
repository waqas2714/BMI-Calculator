import React, { useEffect, useState } from "react";
import HistoryRow from "./components/HistoryRow";
import { toast } from "react-toastify";

const initialState = {
  height: "",
  weight: "",
  bmi: "",
  date: ""
};

const App = () => {
  const [data, setData] = useState(initialState);
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [history, setHistory] = useState([]);

  const { height, weight, bmi } = data;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (height === "" || weight === "") {
      toast.error("Please fill in all fields.");
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum)) {
      toast.error("Please enter valid numerical values for height and weight.");
      return;
    }

    const calcBmi = (weightNum / (heightNum * heightNum)).toFixed(1); // Limit BMI to 1 decimal place
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    setData({
      ...data,
      bmi: calcBmi,
      date: formattedDate,
    });

    let tempHistory = JSON.parse(localStorage.getItem("history")) || [];
    tempHistory = [
      ...tempHistory,
      { ...data, bmi: calcBmi, date: formattedDate },
    ];
    localStorage.setItem("history", JSON.stringify(tempHistory));

    console.log({ ...data, bmi: calcBmi, date: formattedDate });
    setData((prev) => {
      return { ...prev, height: "", weight: "" };
    });

    getHistory();
  };

  const modalSubmit = (e) => {
    e.preventDefault();
    if (name === "") {
      toast.error("Please enter your name.");
      return;
    }

    localStorage.setItem("name", name);
    checkIsLoggedIn();
  };

  const checkIsLoggedIn = () => {
    const checkName = localStorage.getItem("name");
    if (!checkName) {
      setIsLoggedIn(false);
      setHistory([]);
      localStorage.setItem("history", JSON.stringify(history));
    } else {
      setName(checkName);
      setIsLoggedIn(true);
      getHistory();
      console.log(history);
    }
  };

  const getHistory = () => {
    const tempHistory = JSON.parse(localStorage.getItem("history"));
    setHistory(tempHistory);
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, []);

  return (
    <>
      <div className={`back-drop ${isLoggedIn ? "none" : ""}`}></div>
      <div className={`modal ${isLoggedIn ? "none" : ""}`}>
        <label>
          Please provide your username so that we can remember you :{")"}
        </label>
        <form onSubmit={modalSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <button type="submit">Let's Go!</button>
        </form>
      </div>
      <h3 className="name">Hi {name}!</h3>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>Height</label>
            <input
              type="text"
              placeholder="Height in metres"
              name="height"
              value={height}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <label>Weight</label>
            <input
              type="text"
              placeholder="Weight in Kilograms"
              name="weight"
              value={weight}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn-calculate">
            Calculate
          </button>
        </form>
        <h3 className="result-text">Your BMI is {bmi}</h3>
        <h3 style={{ fontSize: "1rem" }}>Your History:</h3>
        <div className="history-container">
          <div className="history-row">
            <div
              className="history-height"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              Height
            </div>
            <div
              className="history-weight"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              Weight
            </div>
            <div
              className="history-bmi"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              BMI
            </div>
            <div
              className="history-date"
              style={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              Date
            </div>
          </div>

          {
            history.length > 0 && 
            history.map((item)=>{
              return <HistoryRow historyBmi={item.bmi} historyDate={item.date} historyHeight={item.height} historyWeight={item.weight} />
            })
          }
        </div>
      </div>
    </>
  );
};

export default App;
