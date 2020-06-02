import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import { getProjectRequest, setProjectRequest } from "../actions/project";
import NotFound from "./NotFound";
import ProjectApply from "./ProjectApply";
import KanbanBoard from "./KanbanBoard";
import { Spin } from "antd";

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      component: null,
      classID: "",
    };

    this.handleGetProject = this.handleGetProject.bind(this);
  }

  componentDidMount() {
    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");
    this.setState({ classID: pathSplit[2] }, () => {
      this.handleGetProject();
    });
  }

  handleGetProject() {
    this.props.getProjectRequest(this.state.classID).then(() => {
      this.setState({ loading: false });

      if (this.props.getProject.status === "SUCCESS") {
        if (this.props.currentUser.type === "student") {
          if (this.props.getProject.project.length === 0)
            this.setState({ component: <ProjectApply /> });
          else if (this.props.getProject.project[0].status === "standby") {
            this.setState({
              component: (
                <div style={{ textAlign: "center" }}>
                  <br />
                  <h3>Waiting for approval</h3>
                  <div
                    class="card text-center"
                    style={{ maxWidth: 500, margin: "auto" }}
                  >
                    <div class="card-header">
                      <h5 class="card-title">
                        {this.props.getProject.project[0].title}
                      </h5>
                    </div>
                    <div class="card-body">
                      <p class="card-text">
                        Team Leader : {this.props.getProject.project[0].leader}
                      </p>
                    </div>
                    <div class="card-footer text-muted">
                      Application date :{" "}
                      <TimeAgo
                        date={this.props.getProject.project[0].projectID}
                      />
                    </div>
                  </div>
                </div>
              ),
            });
          } else this.setState({ component: <KanbanBoard /> });
        } else if (this.props.currentUser.type === "professor") {
          this.setState({ component: <KanbanBoard /> });
        } else this.setState({ component: <NotFound /> });
      }
    });
  }

  render() {
    return <Spin spinning={this.state.loading}>{this.state.component}</Spin>;
  }
}

Project.defaultProps = {
  currentUser: {
    type: "student",
  },
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.status.currentUser,
    getProject: state.project.get,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getProjectRequest: (classID) => {
      return dispatch(getProjectRequest(classID));
    },
    setProjectRequest: (project) => {
      return dispatch(setProjectRequest(project));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Project)
);
