import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { postNoticeRequest } from "../actions/notice";
import { Row, Col, Divider, Input, Button, message } from "antd";
const { TextArea } = Input;

class NoticeUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
    };

    this.onTitleChange = this.onTitleChange.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.handlePost = this.handlePost.bind(this);
  }

  onTitleChange(e) {
    this.setState({ title: e.target.value });
  }

  onContentChange(e) {
    this.setState({ content: e.target.value });
  }

  handlePost() {
    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");

    let classID = pathSplit[2];
    let title = this.state.title;
    let content = this.state.content;

    if (!classID) message.error("Check class information.");
    else {
      if (title === "" || content === "")
        message.error("Please enter title and content.");
      else
        this.props.postNoticeRequest(classID, title, content).then(() => {
          if (this.props.status === "SUCCESS") {
            message.success("Registered.");
            this.props.history.push(`/classroom/${classID}/notice`);
          } else {
            message.error("Registration failed");
          }
        });
    }
  }

  render() {
    return (
      <div style={{ maxWidth: 1024, margin: "auto" }}>
        <Divider style={{ margin: "12px 0" }} />
        <Row>
          <Col span={24}>
            <Input
              className="noticeInput"
              placeholder="Please enter a title"
              value={this.state.title}
              onChange={this.onTitleChange}
              size="large"
            />
          </Col>
        </Row>

        <Divider style={{ margin: "12px 0" }} />

        <div style={{ minHeight: 150 }}>
          <TextArea
            className="noticeInput"
            placeholder="Please enter notice"
            autosize={{ minRows: 5, maxRows: 10 }}
            value={this.state.content}
            onChange={this.onContentChange}
          />
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <Button style={{ margin: "0 0 10px" }} onClick={this.handlePost}>
          Upload
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.notice.post.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postNoticeRequest: (classID, title, content) => {
      return dispatch(postNoticeRequest(classID, title, content));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NoticeUpload)
);
