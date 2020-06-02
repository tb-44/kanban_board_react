import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getClassInfoRequest } from "../actions/classroom";
import { getClassStudentRequest } from "../actions/classroom";
import { postProjectRequest } from "../actions/project";
import { Form, Input, Button, Select, message } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class ProjectApply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      children: [],
      selected: [],
      projectTitle: "",
      title: "",
      divide: "",
      classID: "",
    };

    this.handleProjectApply = this.handleProjectApply.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.titleChange = this.titleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      title: this.props.getClassInfo.info.title,
      divide: this.props.getClassInfo.info.divide,
    });

    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");

    this.setState({ classID: pathSplit[2] }, () => {
      this.props.getClassStudentRequest(this.state.classID).then(() => {
        if (this.props.classStudent.status === "SUCCESS") {
          let student = this.props.classStudent.student;
          let children = [];
          student.forEach((e) => {
            if (e.projectID == null)
              children.push(
                <Option key={e.studentID}>
                  {e.name}({e.studentID})
                </Option>
              );
          });
          this.setState({ children: children });
        }
      });
    });
  }

  handleProjectApply() {
    this.props
      .postProjectRequest(
        this.state.classID,
        this.state.projectTitle,
        this.state.selected
      )
      .then(() => {
        if (this.props.post.status === "SUCCESS") {
          message.success("Project application completed");
          this.props.history.push(`/classroom/${this.state.classID}`);
        }
      });
  }

  handleChange(value) {
    this.setState({ selected: value });
  }

  titleChange(e) {
    let nextState = {};
    nextState[e.target.id] = e.target.value;
    this.setState(nextState);
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    return (
      <div>
        <br />
        <h3>
          {this.state.title}&#40;{this.state.divide}&#41; / Project Application
        </h3>

        <div style={{ height: "100%", padding: 16 }}>
          <Form>
            <FormItem label="Title" {...formItemLayout}>
              <Input
                id="projectTitle"
                placeholder="Project name"
                onChange={this.titleChange}
                value={this.state.projectTitle}
              />
            </FormItem>

            <FormItem label="Members" {...formItemLayout}>
              <Select
                mode="multiple"
                placeholder="Team member selection"
                style={{ width: "100%" }}
                onChange={this.handleChange}
              >
                {this.state.children}
              </Select>
            </FormItem>

            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this.handleProjectApply}>
                Apply
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getClassInfo: state.classroom.getClassInfo,
    classStudent: state.classroom.classStudent,
    post: state.project.post,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    getClassInfoRequest: (classID) => {
      return dispatch(getClassInfoRequest(classID));
    },
    getClassStudentRequest: (classID) => {
      return dispatch(getClassStudentRequest(classID));
    },
    postProjectRequest: (classID, projectTitle, student) => {
      return dispatch(postProjectRequest(classID, projectTitle, student));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchProps)(ProjectApply)
);
