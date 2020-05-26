import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { Layout } from "antd";
const { Content } = Layout;

class App extends Component {
  render() {
    return (
      <Layout style={{ height: "100%", background: "none" }}>
        <Content>
          <Switch></Switch>
        </Content>
      </Layout>
    );
  }
}

export default App;
