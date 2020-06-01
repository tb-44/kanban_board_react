import React from "react";
import { withRouter } from "react-router-dom";
//import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { postFeedbackRequest } from "../actions/feedback";
import { Modal, message, Input } from "antd";
const { TextArea } = Input;
//const confirm = Modal.confirm;

class KanbanFeedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      feedback_content: "",
      point: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.handleFinish = this.handleFinish.bind(this);
  }

  handleChange(e) {
    let nextState = {};
    nextState[e.target.id] = e.target.value;
    this.setState(nextState);
  }

  handleCancel() {
    this.setState({ feedback_content: "", point: null });
    this.props.onCancel();
  }

  handleRedo() {
    let kanbanID = this.props.kanbanID;

    this.props
      .postFeedbackRequest(kanbanID, this.state.feedback_content, "TODO", null)
      .then(() => {
        if (this.props.postFeedback.status === "SUCCESS") {
          message.info("Feedback registered");
          this.handleCancel();
          this.props.handleCancel();
        }
      });
  }

  handleFinish() {
    let kanbanID = this.props.kanbanID;

    this.props
      .postFeedbackRequest(
        kanbanID,
        this.state.feedback_content,
        "FINISH",
        this.state.point
      )
      .then(() => {
        if (this.props.postFeedback.status === "SUCCESS") {
          message.info("Feedback register complete");
          this.handleCancel();
          this.props.handleCancel();
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <Modal
          className="feedback-upload"
          visible={this.props.visible}
          title="Feedback Registration"
          width="480px"
          onCancel={this.handleCancel}
          footer={[
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={this.handleRedo}
            >
              &lt; Redo
            </button>,
            <button
              className="btn btn-outline-success btn-sm"
              onClick={this.handleFinish}
            >
              Complete &gt;
            </button>,
          ]}
        >
          <TextArea
            id="feedback_content"
            value={this.state.feedback_content}
            onChange={this.handleChange}
            placeholder={"Feedback content."}
            autosize={{ minRows: 5, maxRows: 7 }}
          />

          <select
            class="custom-select"
            id="point"
            style={{ border: 0, boxShadow: "none" }}
            onChange={this.handleChange}
          >
            <option selected="" value={null}>
              Score
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    postFeedback: state.feedback.post,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    postFeedbackRequest: (kanbanID, content, status, point) => {
      return dispatch(postFeedbackRequest(kanbanID, content, status, point));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchProps)(KanbanFeedback)
);
