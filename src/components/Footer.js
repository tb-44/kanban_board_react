import React, { Component } from "react";
import { Layout } from "antd";
const { Footer } = Layout;

class Footers extends Component {
  render() {
    return (
      <Footer style={{ textAlign: "right", padding: 18 }}>
        ©2020 Trent Bennett
      </Footer>
    );
  }
}

export default Footers;
