import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getStatusRequest } from "./actions/auth";
import Main from "./containers/Main";
import Login from "./containers/Login";
import Mypage from "./containers/Mypage";
import Classroom from "./containers/Classroom";
import Search from "./containers/Search";
import NotFound from "./containers/NotFound";
import Footer from "./components/Footer";
import { Layout } from "antd";
const { Content } = Layout;

class App extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getStatusRequest().then(() => {
      if (!this.props.status.valid) {
        let loginData = {
          isLogin: false,
          userid: "",
        };
        document.cookie = "key=" + btoa(JSON.stringify(loginData));
      }
      if (!this.props.status.isLogin) {
        this.props.history.push("/login");
      }
    });
  }

  render() {
    return (
      <Layout style={{ height: "100%", background: "none" }}>
        <Content>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/login" component={Login} />
            <Route path="/mypage" component={Mypage} />
            <Route path="/classroom/*" component={Classroom} />
            <Route path="/search" component={Search} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.auth.status,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
