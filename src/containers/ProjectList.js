import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import { getClassInfoRequest } from "../actions/classroom";
import { getProjectRequest } from "../actions/project";
import { Row, Col, Card, Divider } from "antd";

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: [],

      title: "",
      divide: "",
    };

    this.handleKanbanBoardLoad = this.handleKanbanBoardLoad.bind(this);
    this.getClassInfo = this.getClassInfo.bind(this);
    this.getProjectList = this.getProjectList.bind(this);
    this.setProjectList = this.setProjectList.bind(this);
  }

  handleKanbanBoardLoad(projectID) {
    let classID = this.props.getClassInfo.info.classID;
    this.props.history.push(`/classroom/${classID}/kanbanboard/${projectID}`);
  }

  componentDidMount() {
    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");
    this.setState({ classID: pathSplit[2] }, () => {
      this.getClassInfo();
      this.getProjectList();
    });
  }

  getClassInfo() {
    this.props.getClassInfoRequest(this.state.classID).then(() => {
      if (this.props.getClassInfo.status === "SUCCESS") {
        this.setState({
          title: this.props.getClassInfo.info.title,
          divide: this.props.getClassInfo.info.divide,
        });
      }
    });
  }

  getProjectList() {
    let pathname = this.props.history.location.pathname;
    let pathSplit = pathname.split("/");

    this.props.getProjectRequest(pathSplit[2]).then(() => {
      if (this.props.getProject.status === "SUCCESS") {
        console.log("Successful project.");
        if (this.props.projectList.length > 0) {
          this.setProjectList();
        }
      }
    });
  }

  setProjectList() {
    let projectAllList = this.props.projectList;

    if (this.props.projectList.length > 0) {
      let projectList = [];
      let list = [];
      for (let i in projectAllList) {
        if (projectAllList[i].status === "start") {
          let index = projectList
            .map((x) => x.projectID)
            .indexOf(projectAllList[i].projectID);

          if (index < 0) {
            projectList.push({
              projectID: projectAllList[i].projectID,
              title: projectAllList[i].title,
              student: [`${projectAllList[i].name}`],
              updated_date: projectAllList[i].updated_date,
            });
          } else {
            projectList[index].student.push(`${projectAllList[i].name}`);
          }
        }
      }

      for (let i in projectList) {
        let memberList = [];
        for (let j in projectList[i].student) {
          memberList.push(projectList[i].student[j]);
          if (j !== projectList[i].student.length - 1) {
            memberList.push(<Divider type="vertical" />);
          }
        }

        list.push(
          <Col md={12} lg={6} className="project-card">
            <a
              href="/#"
              onClick={() =>
                this.handleKanbanBoardLoad(projectList[i].projectID)
              }
            >
              <Card hoverable title={projectList[i].title}>
                <p>{memberList}</p>
                <br />
                <span>Creation : {projectList[i].projectID}</span>
                <br />
                <span>
                  Recent updates :{" "}
                  <TimeAgo date={projectList[i].updated_date} />
                </span>
              </Card>
            </a>
          </Col>
        );
      }

      this.setState({ project: list });
    } else {
      this.getProjectList();
    }
  }

  render() {
    return (
      <div>
        <br />
        <h3>
          {this.state.title}&#40;{this.state.divide}&#41; / {"Project List"}
        </h3>

        <div style={{ height: "100%", padding: 16, textAlign: "center" }}>
          <Row gutter={16}>{this.state.project}</Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getClassInfo: state.classroom.getClassInfo,
    projectList: state.project.get.project,
    getProject: state.project.get,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getClassInfoRequest: (classID) => {
      return dispatch(getClassInfoRequest(classID));
    },
    getProjectRequest: (classID) => {
      return dispatch(getProjectRequest(classID));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectList)
);
