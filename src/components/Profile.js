import React, { Component } from "react";
import { withRouter } from "react-router-dom";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutRequest } from "../actions/auth";
import { getMessageRequest, putReadMessageRequest } from "../actions/message";
import { Menu, Dropdown, Button, Tag, Badge, Icon, message } from "antd";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: [],
      messageLength: 0,
    };

    this.handleMessageClick = this.handleMessageClick.bind(this);
    this.messageType = this.messageType.bind(this);
    this.getMessageFunc = this.getMessageFunc.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.getMessageFunc();
  }

  handleMessageClick(data) {
    switch (data.type) {
      case "PA":
        this.props.history.push(`/classroom/${data.classID}/approve`);
        break;
      case "FB":
        this.props.history.push(
          `/classroom/${data.classID}/kanbanboard/${data.projectID}`
        );
        break;
      case "PAS":
        if (data.isCheck)
          this.props.history.push(`/classroom/${data.classID}/notice`);
        else
          this.props.putReadMessageRequest(data.receive_date).then(() => {
            this.props.history.push(`/classroom/${data.classID}/notice`);
          });
        break;
      case "TODO":
        if (data.isCheck)
          this.props.history.push(`/classroom/${data.classID}/kanbanboard`);
        else
          this.props.putReadMessageRequest(data.receive_date).then(() => {
            this.props.history.push(`/classroom/${data.classID}/kanbanboard`);
          });
        break;
      case "FINISH":
        if (data.isCheck)
          this.props.history.push(`/classroom/${data.classID}/kanbanboard`);
        else
          this.props.putReadMessageRequest(data.receive_date).then(() => {
            this.props.history.push(`/classroom/${data.classID}/kanbanboard`);
          });
        break;
      case "NTC":
        if (data.isCheck)
          this.props.history.push(`/classroom/${data.classID}/notice`);
        else
          this.props.putReadMessageRequest(data.receive_date).then(() => {
            this.props.history.push(`/classroom/${data.classID}/notice`);
          });
        break;
      default:
        break;
    }
  }

  messageType(type) {
    switch (type) {
      case "PA":
        return "Project request.";
      case "FB":
        return "Feedback request.";
      case "PAS":
        return "Project approved.";
      case "TODO":
        return "Feedback complete.";
      case "FINISH":
        return "Feedback finished.";
      case "NTC":
        return "Notice registered.";
      default:
        return "Unknown notification.";
    }
  }

  getMessageFunc() {
    this.props.getMessageRequest().then(() => {
      if (this.props.getMessage.status === "SUCCESS") {
        let message = [];
        let getMessage = this.props.getMessage.message.reverse();

        for (let i in getMessage) {
          if (!getMessage[i].isCheck) {
            let data = {
              receive_date: getMessage[i].receive_date,
              classTitle: getMessage[i].classTitle,
              projectTitle: getMessage[i].projectTitle,
              message: this.messageType(getMessage[i].type),
              type: getMessage[i].type,
              classID: getMessage[i].classID,
              projectID: getMessage[i].projectID,
              kanbanID: getMessage[i].kanbanID,
              isCheck: getMessage[i].isCheck,
            };
            message.push(
              <Menu.Item className="new">
                <a href="/#" onClick={() => this.handleMessageClick(data)}>
                  <h6>
                    {data.classTitle} / {data.projectTitle}
                  </h6>
                  <h6>{data.message}</h6>
                  <h6>{data.receive_date}</h6>
                </a>
              </Menu.Item>
            );
            message.push(<Menu.Divider />);
          }
        }

        if (message.length === 0) this.setState({ messageLength: 0 });
        else this.setState({ messageLength: 1 });

        for (let i in getMessage) {
          if (getMessage[i].isCheck) {
            let data = {
              receive_date: getMessage[i].receive_date,
              classTitle: getMessage[i].classTitle,
              projectTitle: getMessage[i].projectTitle,
              message: this.messageType(getMessage[i].type),
              type: getMessage[i].type,
              classID: getMessage[i].classID,
              projectID: getMessage[i].projectID,
              kanbanID: getMessage[i].kanbanID,
              isCheck: getMessage[i].isCheck,
            };
            message.push(
              <Menu.Item className="old">
                <a href="/#" onClick={() => this.handleMessageClick(data)}>
                  <h6>
                    {data.classTitle} / {data.projectTitle}
                  </h6>
                  <h6>{data.message}</h6>
                  <h6>{data.receive_date}</h6>
                </a>
              </Menu.Item>
            );
            message.push(<Menu.Divider />);
          }
        }
        console.log("message here");
        this.setState({ message });
      }
    });
  }

  handleLogout() {
    this.props.logoutRequest().then(() => {
      let loginData = {
        isLogin: false,
        userid: "",
      };
      document.cookie = "key=" + btoa(JSON.stringify(loginData));
      message.success("message success.");
      this.props.history.push("/login");
    });
  }

  render() {
    const menu = (
      <Menu style={{ overflow: "auto", width: 300, maxHeight: 500 }}>
        {this.state.message}
      </Menu>
    );

    return (
      <div
        className="profile"
        style={{ padding: "0 0 25px", textAlign: "center" }}
      >
        <h6>
          <Tag>{this.props.currentUser.type}</Tag>
          <strong style={{ color: "#072561" }}>
            {this.props.currentUser.name} 님{" "}
          </strong>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onClick={this.getMessageFunc}
          >
            <Badge count={this.state.messageLength} dot>
              <a href="/#" style={{ color: "#072561" }}>
                <Icon type="mail" />
              </a>
            </Badge>
          </Dropdown>
        </h6>
        <br />
        <Button
          className="logout-btn"
          icon="logout"
          onClick={this.handleLogout}
        >
          Logout
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.status.currentUser,
    logout: state.auth.status.isLogin,
    getMessage: state.message.get,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: () => {
      return dispatch(logoutRequest());
    },
    getMessageRequest: () => {
      return dispatch(getMessageRequest());
    },
    putReadMessageRequest: (messageID) => {
      return dispatch(putReadMessageRequest(messageID));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
