import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Menu } from "antd";
import Icon from "@ant-design/icons";

class StdSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classID: "1",
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
        defaultSelectedKeys={["3"]}
        style={{ borderRight: 0, background: "none" }}
      >
        <Menu.Item key="1">
          <Link to="/mypage">
            <Icon type="home" />
            <strong>Classroom</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to={`/classroom/${this.state.classID}/kanbanboard`}>
            <Icon type="layout" />
            <strong>Kanban Board</strong>
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
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

export default withRouter(connect(mapStateToProps)(StdSidebar));
