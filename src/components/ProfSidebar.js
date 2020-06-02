import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Menu } from "antd";
import Icon from "@ant-design/icons";

class ProfSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classID: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.getClassInfo.classID !== this.state.classID) {
      this.setState({ classID: this.props.getClassInfo.classID });
    }
  }

  render() {
    return (
      <Menu
        className="sideMenu"
        mode="inline"
        defaultSelectedKeys={["4"]}
        style={{ borderRight: 0, background: "none" }}
      >
        <Menu.Item key="1">
          <Link to="/mypage">
            <Icon type="home" />
            <strong>My classroom</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`/classroom/${this.state.classID}/projectList`}>
            <Icon type="bars" />
            <strong>Project List</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to={`/classroom/${this.state.classID}/approve`}>
            <Icon type="usergroup-add" />
            <strong>Project Approval</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to={`/classroom/${this.state.classID}/notice`}>
            <Icon type="notification" />
            <strong>Notice</strong>
          </Link>
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getClassInfo: state.classroom.getClassInfo.info,
  };
};

export default withRouter(connect(mapStateToProps)(ProfSidebar));
