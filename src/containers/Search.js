import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Divider } from "antd";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: [],
    };

    this.getProjectList = this.getProjectList.bind(this);
  }

  componentDidMount() {
    this.getProjectList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.project !== this.props.project) {
      this.getProjectList();
    }
  }

  getProjectList() {
    let list = [];
    let project = this.props.project;
    let count = 1;

    /* Create project list */
    for (let i in project) {
      let index = list.map((x) => x.key).indexOf(project[i].projectID);

      if (index < 0) {
        list.push({
          key: project[i].projectID,
          number: count++,
          classID: project[i].classID,
          classTitle: project[i].classTitle + " (" + project[i].divide + ")",
          projectTitle: project[i].projectTitle,
          leader: project[i].name,
          member: [project[i].name],
          period: project[i].period,
          status: project[i].status,
        });
      } else {
        list[index].member.push(<Divider type="vertical" />);
        list[index].member.push(`${project[i].name}`);
      }
    }

    this.setState({ project: list });
  }

  render() {
    const columns = [
      {
        title: "Number",
        dataIndex: "number",
      },
      {
        title: "Class name",
        dataIndex: "classTitle",
      },
      {
        title: "Project name",
        dataIndex: "projectTitle",
      },
      {
        title: "Team Leader",
        dataIndex: "leader",
      },
      {
        title: "Team members",
        dataIndex: "member",
      },
      {
        title: "Semester",
        dataIndex: "period",
      },
      {
        title: "State",
        dataIndex: "status",
      },
    ];

    const rowClick = (record) => {
      return {
        onClick: () => {
          this.props.history.push(`/classroom/${record.classID}/notice`);
        },
      };
    };

    return (
      <div style={{ margin: "auto" }}>
        <br />
        <h3>Project Search</h3>
        <br />
        <div>
          <Table
            columns={columns}
            dataSource={this.state.project}
            size="middle"
            pagination={{ position: "none" }}
            onRow={rowClick}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.search.project,
  };
};

export default withRouter(connect(mapStateToProps)(Search));
