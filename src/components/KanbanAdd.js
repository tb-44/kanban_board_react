import React, { Component } from "react";
import { withRouter } from "react-router-dom";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { postKanbanRequest } from "../actions/kanban";
import {
  Modal,
  Button,
  message,
  Divider,
  Input,
  //Icon,
  Select,
  DatePicker,
} from "antd";
const { TextArea } = Input;
//const confirm = Modal.confirm;
const Option = Select.Option;

class KanbanAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      importance: "",
      end_date: "",
      modalVisible: false,
      loading: false,
    };

    this.selectChange = this.selectChange.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.showCancel = this.showCancel.bind(this);
    this.handleModalCancel = this.handleModalCancel.bind(this);
  }

  selectChange(value) {
    this.setState({ importance: value });
  }

  dateChange(date, dateString) {
    this.setState({ end_date: date });
  }

  handleChange(e) {
    let nextState = {};
    nextState[e.target.id] = e.target.value;
    this.setState(nextState);
  }

  showConfirm() {
    if (
      this.state.title === "" ||
      this.state.content === "" ||
      this.state.importance === "" ||
      this.state.end_date === ""
    )
      message.error("Error.");
    else this.setState({ modalVisible: true });
  }
  // modal close
  showCancel() {
    this.setState({
      title: "",
      content: "",
      importance: "",
      end_date: "",
    });
    this.props.handleCancel();
    this.props.getKanbanList();
  }

  // modal OK
  handleAdd() {
    this.setState({ loading: true });

    let projectID = this.props.project[0].projectID;
    let title = this.state.title;
    let content = this.state.content;
    let importance = this.state.importance;
    let end_date = this.state.end_date;

    this.props
      .postKanbanRequest(projectID, title, content, importance, end_date)
      .then(() => {
        this.setState({
          modalVisible: false,
          loading: false,
        });

        if (this.props.kanban.status === "SUCCESS") {
          message.success("Success.");
          this.showCancel();
        }
      });
  }

  // modal cancel
  handleModalCancel() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          className="kanban-upload"
          visible={this.props.data.status}
          title="title here"
          width="700px"
          onCancel={this.showCancel}
          footer={[
            <Button key="add" type="primary" onClick={this.showConfirm}>
              Upload
            </Button>,
            <Button key="back" type="danger" onClick={this.showCancel}>
              Close
            </Button>,
          ]}
        >
          <Input
            id="title"
            className="title kanban-input"
            placeholder="Input here"
            value={this.state.title}
            onChange={this.handleChange}
          />
          <Divider style={{ margin: "12px 0" }} />
          <div style={{ minHeight: 150 }}>
            <TextArea
              id="content"
              className="content kanban-input"
              placeholder="Text Here"
              autosize={{ minRows: 5, maxRows: 10 }}
              value={this.state.content}
              onChange={this.handleChange}
            />
          </div>
          <Divider style={{ margin: "12px 0" }} />
          <Select
            className=""
            placeholder="Select Here"
            onChange={this.selectChange}
            style={{ width: 200 }}
          >
            <Option value="1">Very Low</Option>
            <Option value="2">Low</Option>
            <Option value="3">Normal</Option>
            <Option value="4">High</Option>
            <Option value="5">Very High</Option>
          </Select>
          <DatePicker onChange={this.dateChange} style={{ width: 200 }} />
        </Modal>

        <Modal
          visible={this.state.modalVisible}
          width="520px"
          onOk={this.handleAdd}
          confirmLoading={this.state.loading}
          onCancel={this.handleModalCancel}
        >
          <h5>Modal Placeholder</h5>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project.get.project,
    kanban: state.kanban.post,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    postKanbanRequest: (projectID, title, content, importance, end_date) => {
      return dispatch(
        postKanbanRequest(projectID, title, content, importance, end_date)
      );
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchProps)(KanbanAdd)
);
