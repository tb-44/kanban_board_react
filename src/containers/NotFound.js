import React, { Component } from "react";
import { Layout } from "antd";
const { Content } = Layout;

class NotFound extends Component {
  render() {
    return (
      <Layout>
        <Layout style={{ padding: "64px 0 16px" }}>
          <Content
            style={{
              minHeight: 576,
              margin: "24px 16px 0",
              overflow: "initial",
            }}
          >
            <div
              style={{
                height: "100%",
                padding: 24,
                background: "#fff",
                textAlign: "center",
              }}
            >
              <h1>Error 404 - Page NotFound!!</h1>
              <p>Please check the page address again.</p>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default NotFound;
