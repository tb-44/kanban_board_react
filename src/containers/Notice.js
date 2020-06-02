import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getClassInfoRequest } from "../actions/classroom";
import NoticeList from "../components/NoticeList";
import Notices from "../components/Notices";
import NoticeUpload from "../components/NoticeUpload";

class Notice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      divide: "",
      classID: "",
    };

    this.getClassInfo = this.getClassInfo.bind(this);
  }

  componentDidMount() {
    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");

    this.setState({ classID: pathSplit[2] }, () => {
      this.getClassInfo();
    });
  }

  componentDidUpdate(prevProps) {
    const pathname = this.props.history.location.pathname;
    const pathSplit = pathname.split("/");

    if (this.state.classID !== "" && pathSplit[2] !== this.state.classID) {
      console.log("Change");
      this.setState({ classID: pathSplit[2] }, () => {
        this.getClassInfo();
      });
    }
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

  render() {
    return (
      <div>
        <br />
        <h3>
          {this.state.title}&#40;{this.state.divide}&#41; / Notice
        </h3>

        <div style={{ height: "100%", padding: 16 }}>
          <Switch>
            <Route exact path="/classroom/:id" component={NoticeList} />
            <Route exact path="/classroom/:id/notice" component={NoticeList} />
            <Route
              path="/classroom/:id/notice/upload"
              component={NoticeUpload}
            />
            <Route path="/classroom/:id/notice/:number" component={Notices} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    getClassInfo: state.classroom.getClassInfo,
    getProject: state.project.get,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getClassInfoRequest: (classID) => {
      return dispatch(getClassInfoRequest(classID));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Notice));
