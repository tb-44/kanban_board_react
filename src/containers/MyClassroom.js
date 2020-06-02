import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getClassListRequest, getClassInfoRequest } from "../actions/classroom";
import { Select, Table } from "antd";
const Option = Select.Option;

let menuData = [];
let menuChlidren = [];
let classList = [];

class MyClassroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      period: "Term select",
      classData: classList,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.getClassListRequest().then(() => {
      this.setState({ loading: false });

      if (this.props.getStatus === "SUCCESS") {
        menuData = [];
        menuChlidren = [];
        for (let i in this.props.getClasses) {
          if (menuData.indexOf(this.props.getClasses[i].period) === -1) {
            menuData.push(this.props.getClasses[i].period);
          }
        }
        menuData.sort();
        menuData.reverse();

        for (let i in menuData) {
          menuChlidren.push(<Option value={menuData[i]}>{menuData[i]}</Option>);
        }

        this.setState({ period: menuData[0] }, () => {
          this.handleChange(this.state.period);
        });
      }
    });
  }

  handleChange(value) {
    classList = [];
    this.setState({ loading: true });
    this.setState({ period: value }, () => {
      for (let i in this.props.getClasses) {
        if (this.props.getClasses[i].period === this.state.period)
          classList.push({
            key: this.props.getClasses[i].classID,
            number: classList.length + 1,
            title: this.props.getClasses[i].title,
            divide: this.props.getClasses[i].divide,
            professor: this.props.getClasses[i].name,
          });
      }
      this.setState({ classData: classList, loading: false });
    });
  }

  render() {
    const columns =
      this.props.currentUser.type === "professor"
        ? [
            {
              title: "Number",
              dataIndex: "number",
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Divide",
              dataIndex: "divide",
            },
          ]
        : [
            {
              title: "Number",
              dataIndex: "number",
            },
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Divide",
              dataIndex: "divide",
            },
            {
              title: "Professor",
              dataIndex: "professor",
            },
          ];

    const rowClick = (record) => {
      return {
        onClick: () => {
          this.props.getClassInfoRequest(record.key).then(() => {
            if (this.props.getClassInfo.status === "SUCCESS") {
              this.props.history.push(`/classroom/${record.key}`);
            }
          });
        },
      };
    };

    return (
      <React.Fragment>
        <br />
        <h3>My Classroom</h3>

        <div style={{ padding: 16, border: "none" }}>
          <Select
            defaultValue={this.state.period}
            style={{ width: 120, marginBottom: 10 }}
            onChange={this.handleChange}
          >
            {menuChlidren}
          </Select>

          <Table
            columns={columns}
            dataSource={this.state.classData}
            size="middle"
            pagination={{ position: "none" }}
            onRow={rowClick}
            loading={this.state.loading}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.status.currentUser,
    getClasses: state.classroom.getClasses.classroom,
    getStatus: state.classroom.getClasses.status,
    getClassInfo: state.classroom.getClassInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getClassListRequest: () => {
      return dispatch(getClassListRequest());
    },
    getClassInfoRequest: (classID) => {
      return dispatch(getClassInfoRequest(classID));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyClassroom)
);
