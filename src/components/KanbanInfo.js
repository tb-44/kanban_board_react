import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { post } from "axios";
import { putKanbanInfoRequest, deleteKanbanRequest } from "../actions/kanban";
import KanbanFeedback from "./KanbanFeedback";
import { Modal, Button, Row, Col, Divider, Input, message, Spin } from "antd";
import Icon from "@ant-design/icons";
const { TextArea } = Input;

class KanbanInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spin_loading: false,
      isChange: false,
      uploading: false,
      title_value: "",
      content_value: "",
      feedback_value: "",
      loading: false,
      updateModalVisible: false,
      deleteModalVisible: false,
      feedbackModalVisible: false,
      uploadFile: null,
    };

    this.isDownload = this.isDownload.bind(this);
    this.isUpdating = this.isUpdating.bind(this);
    this.isFeedback = this.isFeedback.bind(this);
    this.confirmUpdate = this.confirmUpdate.bind(this);
    this.setInitialize = this.setInitialize.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.importance = this.importance.bind(this);
  }

  // Display when there is an attachment
  isDownload() {
    let kanbanID = this.props.data.id;
    if (this.props.data.filename) {
      return (
        <form
          method="get"
          action={`/api/classroom/kanban/download/${kanbanID}`}
        >
          <label
            htmlFor="dwfile"
            className="btn btn-outline-secondary btn-sm"
            style={{ maxWidth: "200px", overflow: "hidden" }}
            title={this.props.data.filename}
          >
            <Icon type="download" /> {this.props.data.filename}
          </label>
          <input
            type="submit"
            id="dwfile"
            name="dwfile"
            style={{ display: "none" }}
          />
        </form>
      );
    }
  }

  isFeedback() {
    if (this.props.data.feedback) {
      let feedback = [];
      this.props.data.feedback.forEach((e) => {
        feedback.push(
          <div className="form-row">
            <div className="col-10">
              <p>{e.content}</p>
            </div>
            <div className="col-2">
              <p>{e.date}</p>
            </div>
          </div>
        );
      });
      return feedback;
    }
  }

  // Display during data modification
  isUpdating() {
    if (this.state.isChange) {
      return (
        <div className="ant-modal-header" style={{ padding: 0 }}>
          <p>
            <strong>Loading...</strong>
          </p>
        </div>
      );
    }
  }

  // Data modification button
  confirmUpdate() {
    if (this.state.isChange) {
      return <Button onClick={this.handleUpdate}>Update</Button>;
    }
  }

  setInitialize() {
    this.setState({
      title_value: "",
      content_value: "",
      feedback_value: "",
      isChange: false,
      uploadFile: null,
    });
  }

  handleChange(e) {
    this.setState({ isChange: true });
    let nextState = {};
    nextState[e.target.id] = e.target.value;
    this.setState(nextState);
  }

  handleCancel() {
    this.setState({
      updateModalVisible: false,
      deleteModalVisible: false,
      feedbackModalVisible: false,
    });

    this.setInitialize();
    this.props.handleCancel();
    this.props.getKanbanList();
  }

  handleUpdate() {
    this.setState({ updateModalVisible: true });
  }

  handleDelete() {
    this.setState({ deleteModalVisible: true });
  }

  handleFeedback() {
    this.setState({ feedbackModalVisible: true });
  }

  onUpdate() {
    this.setState({ uploading: true });

    let kanbanID = this.props.data.id;
    let title =
      this.state.title_value === ""
        ? this.props.data.title
        : this.state.title_value;
    let content =
      this.state.content_value === ""
        ? this.props.data.content
        : this.state.content_value;
    this.props.putKanbanInfoRequest(kanbanID, title, content, null).then(() => {
      this.setState({ uploading: false });
      if (this.props.put.status === "SUCCESS") {
        message.success("Successful.");
        this.handleCancel();
      }
    });
  }

  onDelete() {
    this.setState({ loading: true, spin_loading: false });

    let kanbanID = this.props.data.id;

    this.props.deleteKanbanRequest(kanbanID).then(() => {
      this.setState({ spin_loading: false, loading: false });
      if (this.props.delete.status === "SUCCESS") {
        message.info("Successfully deleted.");
        this.handleCancel();
      }
    });
  }

  handleModalCancel() {
    this.setState({
      updateModalVisible: false,
      deleteModalVisible: false,
      feedbackModalVisible: false,
    });
  }

  onFileChange(e) {
    this.setState({ uploadFile: e.target.files[0] });
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.onFileUpload(this.state.uploadFile)
      .then((res) => {
        this.handleCancel();
        message.success("Success Upload");
      })
      .catch((err) => {
        message.error("Failed Upload");
      });
  }

  onFileUpload(file) {
    const url = "/api/classroom/kanban/upload";
    const formData = new FormData();
    formData.append("kanbanID", this.props.data.id);
    formData.append("filename", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return post(url, formData, config);
  }

  importance(index) {
    switch (index) {
      case 1:
        return (
          <h5>
            <span class="badge badge-success">Priority - VERY LOW</span>
          </h5>
        );
      case 2:
        return (
          <h5>
            <span class="badge badge-primary">Priority - LOW</span>
          </h5>
        );
      case 3:
        return (
          <h5>
            <span class="badge badge-secondary">Priority - NORMAL</span>
          </h5>
        );
      case 4:
        return (
          <h5>
            <span class="badge badge-warning">Priority- HIGH</span>
          </h5>
        );
      case 5:
        return (
          <h5>
            <span class="badge badge-danger">Priority - VERY HIGH</span>
          </h5>
        );
      default:
        return (
          <h5>
            <span class="badge badge-light">UNKNOWN</span>
          </h5>
        );
    }
  }

  render() {
    let deleteButton = <Button onClick={this.handleDelete}>Delete</Button>;

    let feedbackButton =
      this.props.data.kstatus === "FEEDBACK" ? (
        <button className="btn btn-secondary" onClick={this.handleFeedback}>
          Feedback
        </button>
      ) : null;

    let showScore = this.props.data.score ? (
      <h5>
        <span class="badge badge-success" style={{ width: 70 }}>
          {this.props.data.score}
        </span>
      </h5>
    ) : null;

    return (
      <React.Fragment>
        <Modal
          visible={this.props.data.status}
          width="800px"
          onCancel={this.handleCancel}
          footer={
            this.props.data.kstatus !== "FINISH"
              ? this.props.currentUser.type === "student"
                ? [deleteButton, this.confirmUpdate()]
                : [feedbackButton]
              : null
          }
        >
          {this.props.currentUser.type === "student" ? this.isUpdating() : null}{" "}
          <Row gutter={16}>
            <Col md={16} className="left-col">
              <Input
                id="title_value"
                value={this.state.title_value || this.props.data.title}
                onChange={
                  this.props.currentUser.type === "student"
                    ? this.handleChange
                    : null
                }
                placeholder={this.props.data.title}
              />

              <TextArea
                id="content_value"
                value={this.state.content_value || this.props.data.content}
                onChange={
                  this.props.currentUser.type === "student"
                    ? this.handleChange
                    : null
                }
                placeholder={this.props.data.content}
                autosize={{ minRows: 5, maxRows: 12 }}
              />

              <hr />
              <h6>
                <strong>Feedback</strong>
              </h6>
              <br />
              {this.isFeedback()}
            </Col>

            <Col md={8} className="right-col">
              <h5>
                <strong>
                  State
                  <Divider type="vertical" />
                  {this.props.data.kstatus}
                </strong>
              </h5>
              {this.props.currentUser.type === "student" ? (
                <div>
                  {this.props.data.kstatus !== "FINISH" ? (
                    <form onSubmit={this.onFormSubmit}>
                      <br />
                      <label
                        htmlFor="filename"
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <Icon type="upload" /> Click to Upload
                      </label>
                      <input
                        type="file"
                        id="filename"
                        name="filename"
                        onChange={this.onFileChange}
                        style={{ display: "none" }}
                      />
                      <br />
                      {this.state.uploadFile ? (
                        <React.Fragment>
                          {this.state.uploadFile.name}
                          <br />
                          <label
                            htmlFor="upload"
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Upload
                          </label>
                          <input
                            type="submit"
                            id="upload"
                            value="Upload"
                            style={{ display: "none" }}
                          />
                        </React.Fragment>
                      ) : (
                        "Please select a file."
                      )}
                      <br />
                    </form>
                  ) : null}
                </div>
              ) : null}
              <br />
              {this.isDownload()}
              <br />
              <br />
              <br />
              <br />
              {showScore}
              {this.importance(this.props.data.importance)} <br />
              <p>Date created: {this.props.data.id}</p>
              <p>Date updated: {this.props.data.updated_date}</p>
              <p>Deadline: {this.props.data.end_date}</p>
            </Col>
          </Row>
        </Modal>

        <Spin spinning={this.state.spin_loading}>
          <Modal
            visible={this.state.updateModalVisible}
            width="480px"
            onOk={this.onUpdate}
            confirmLoading={this.state.loading}
            onCancel={this.handleModalCancel}
          >
            <h5>Would you like to edit the Kanban?</h5>
          </Modal>
          <Modal
            visible={this.state.deleteModalVisible}
            width="480px"
            onOk={this.onDelete}
            confirmLoading={this.state.loading}
            onCancel={this.handleModalCancel}
          >
            <h5>Are you sure you want to delete the Kanban?</h5>
          </Modal>
        </Spin>

        <KanbanFeedback
          kanbanID={this.props.data.id}
          visible={this.state.feedbackModalVisible}
          onCancel={this.handleModalCancel}
          handleCancel={this.handleCancel}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.status.currentUser,
    project: state.project.get.project,
    get: state.kanban.get,
    put: state.kanban.put,
    delete: state.kanban.delete,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    putKanbanInfoRequest: (kanbanID, title, content, contribute) => {
      return dispatch(
        putKanbanInfoRequest(kanbanID, title, content, contribute)
      );
    },
    deleteKanbanRequest: (kanbanID) => {
      return dispatch(deleteKanbanRequest(kanbanID));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchProps)(KanbanInfo)
);
