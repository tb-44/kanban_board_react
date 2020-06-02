import React, { Component } from "react";
import { Link } from "react-router-dom";

class Status extends Component {
  render() {
    return (
      <div>
        <h3>
          {"Subject name"} / {"Project Stats"}
        </h3>

        <div
          style={{
            height: "100%",
            padding: 24,
            background: "#fff",
            textAlign: "center",
          }}
        >
          Status
          <p>
            <Link to="/mypage">mypage</Link>
          </p>
          <p>
            <Link to="/classroom/student">mypage/std</Link>
          </p>
          <p>
            <Link to="/classroom/professor">mypage/prof</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Status;
