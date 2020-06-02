import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TimeAgo from "react-timeago";
import { getClassInfoRequest } from "../actions/classroom";
import { getClassStudentRequest } from "../actions/classroom";
import {
  getKanbanListRequest,
  getKanbanRequest,
  putKanbanStatusRequest,
} from "../actions/kanban";
import { getFeedbackRequest } from "../actions/feedback";
import KanbanInfo from "../components/KanbanInfo";
import KanbanAdd from "../components/KanbanAdd";
import { Row, Col, Button, message, Spin } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import {
//   DraggableStyle,
//   DroppableProvided,
//   DroppableStateSnapshot,
//   DraggableProvided,
//   DraggableStateSnapshot,
//   DropResult,
// } from "react-beautiful-dnd";

// function to help with reordering the result
const reorder = (startIndex, endIndex, list, list2) => {
  if (!list2) {
    /* When moving on the same line */
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  } else {
    /* When moving on another line */
    const result = Array.from(list);
    const result2 = Array.from(list2);
    const [removed] = result.splice(startIndex, 1);
    result2.splice(endIndex, 0, removed);
    return [result, result2];
  }
};

// using inline style helpers to make the app look better
const grid = 8;

// Item -> Kanban
// const getItemStyle = (
//   draggableStyle: ?DraggableStyle,
//   isDragging: boolean
// ): Object => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: "none",
//   padding: grid * 2,

//   background: isDragging ? "lightgreen" : "white",
//   ...draggableStyle,

//   margin:
//     draggableStyle && draggableStyle.margin
//       ? draggableStyle.margin
//       : `${grid}px`,
//   //boxShadow: 'lightgrey 0px 1px 2px'

//   border: "2px solid lightgrey",
// });

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "rgba(207,216,220,.2)",
  padding: `${grid}px 0`,
  minHeight: 700,
  width: "100%",
  float: "left",
});

class KanbanBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      divide: "",
      classID: "",
      projectTitle: "",
      loading: false,
      students: "",
      todo: [],
      doing: [],
      feedback: [],
      finish: [],

      kanbanInfo: {
        id: "",
        title: "",
        content: "",
        updated_date: "",
        end_date: "",
        importance: "",
        filename: "",
        score: 0,
        kstatus: "",
        feedback: null,
        status: false,
      },
      kanbanAddInfo: {
        status: false,
      },
    };

    this.setInitialize = this.setInitialize.bind(this);
    this.handleKanbanAddClick = this.handleKanbanAddClick.bind(this);
    this.handleKanbanClick = this.handleKanbanClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.setItems = this.setItems.bind(this);
    this.getClassInfo = this.getClassInfo.bind(this);
    this.getKanbanList = this.getKanbanList.bind(this);
    this.importance = this.importance.bind(this);
  }

  componentDidMount() {
    let pathname = this.props.history.location.pathname;
    let pathSplit = pathname.split("/");

    if (this.props.currentUser.type === "professor") {
      for (let i in this.props.project.project) {
        if (this.props.project.project[i].projectID === pathSplit[4]) {
          this.setState({ projectTitle: this.props.project.project[i].title });
          break;
        }
      }
    } else if (this.props.currentUser.type === "student") {
      this.setState({ projectTitle: this.props.project.project[0].title });
    }

    this.setState({ classID: pathSplit[2] }, () => {
      this.getClassInfo();
      this.getKanbanList();
      this.getProjectStudent();
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

  setInitialize() {
    this.setState({
      todo: [],
      doing: [],
      feedback: [],
      finish: [],
    });
  }

  getProjectStudent() {
    let projectID;
    let pathname = this.props.history.location.pathname;
    let pathSplit = pathname.split("/");

    if (this.props.currentUser.type === "professor") {
      projectID = pathSplit[4];
    } else if (this.props.currentUser.type === "student") {
      projectID = this.props.project.project[0].projectID;
    }

    let classID = this.state.classID;

    this.props.getClassStudentRequest(classID).then(() => {
      if (this.props.getStudents.status === "SUCCESS") {
        console.log("Get student list");
        let studentList = this.props.getStudents.student;
        let students = "";

        for (let i in studentList) {
          if (studentList[i].projectID === projectID) {
            if (students === "") students = studentList[i].name;
            else students += ", " + studentList[i].name;
          }
        }
        this.setState({ students: students });
      }
    });
  }

  getKanbanList() {
    let project;
    let pathname = this.props.history.location.pathname;
    let pathSplit = pathname.split("/");

    if (this.props.currentUser.type === "professor") {
      project = pathSplit[4];
    } else if (this.props.currentUser.type === "student") {
      project = this.props.project.project[0].projectID;
    }

    this.setInitialize();

    if (project) {
      this.setState({ loading: true });
      this.props.getKanbanListRequest(project).then(() => {
        this.setState({ loading: false });
        if (this.props.kanban.status === "SUCCESS") {
          message.success("Kanban call success.");
          this.setItems(this.props.kanban.kanbanList);
        }
      });
    }
  }

  setItems(kanbanList) {
    let todo = [];
    let doing = [];
    let feedback = [];
    let finish = [];

    kanbanList.forEach((e) => {
      switch (e.status) {
        case "TODO":
          todo.push({
            id: e.created_date,
            title: e.title,
            date: e.updated_date,
            importance: e.importance,
            end_date: e.end_date,
          });
          break;
        case "DOING":
          doing.push({
            id: e.created_date,
            title: e.title,
            date: e.updated_date,
            importance: e.importance,
            end_date: e.end_date,
          });
          break;
        case "FEEDBACK":
          feedback.push({
            id: e.created_date,
            title: e.title,
            date: e.updated_date,
            importance: e.importance,
            end_date: e.end_date,
          });
          break;
        case "FINISH":
          finish.push({
            id: e.created_date,
            title: e.title,
            date: e.updated_date,
            importance: e.importance,
            end_date: e.end_date,
          });
          break;
        default:
          break;
      }
      this.setState({ todo, doing, feedback, finish });
    });
  }

  // Pop-up when clicking the Add Kanban button (+)
  handleKanbanAddClick() {
    this.setState({
      kanbanAddInfo: { status: true },
    });
  }

  // When clicking Kanban, call Kanban
  handleKanbanClick(e) {
    let kanbanID = e.currentTarget.id;
    if (kanbanID) {
      this.setState({ loading: true });
      // Call Kanban
      this.props.getKanbanRequest(kanbanID).then(() => {
        if (this.props.kanbanInfo.status === "SUCCESS") {
          this.setState({ loading: false });

          // Loading Kanban comments
          this.props.getFeedbackRequest(kanbanID).then(() => {
            if (this.props.getFeedback.status === "SUCCESS") {
              this.setState({
                kanbanInfo: {
                  id: this.props.kanbanInfo.kanban[0].created_date,
                  title: this.props.kanbanInfo.kanban[0].title,
                  content: this.props.kanbanInfo.kanban[0].content,
                  updated_date: this.props.kanbanInfo.kanban[0].updated_date,
                  end_date: this.props.kanbanInfo.kanban[0].end_date,
                  importance: this.props.kanbanInfo.kanban[0].importance,
                  filename: this.props.kanbanInfo.kanban[0].filename,
                  score: this.props.kanbanInfo.kanban[0].score,
                  kstatus: this.props.kanbanInfo.kanban[0].status,
                  feedback: this.props.getFeedback.feedback,
                  status: true,
                },
              });
            }
          });
        } else {
          message.error("Error while calling comments");
        }
      });
    }
  }

  // Close Kanban Information Popup
  handleCancel() {
    this.setState({
      kanbanInfo: {
        id: "",
        title: "",
        content: "",
        importance: "",
        end_date: "",
        feedback: null,
        status: false,
      },
      kanbanAddInfo: {
        status: false,
      },
    });
  }

  /*  When dropped after dragging */
  onDragEnd = (result) => {
    try {
      console.log(
        result.draggableId +
          ": " +
          result.source.droppableId +
          "->" +
          result.destination.droppableId
      );
    } catch (e) {}

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      let todo, doing, feedback;

      switch (result.source.droppableId) {
        case "droppable-1":
          todo = reorder(
            result.source.index,
            result.destination.index,
            this.state.todo
          );
          this.setState({
            todo,
          });
          break;
        case "droppable-2":
          doing = reorder(
            result.source.index,
            result.destination.index,
            this.state.doing
          );
          this.setState({
            doing,
          });
          break;
        case "droppable-3":
          feedback = reorder(
            result.source.index,
            result.destination.index,
            this.state.feedback
          );
          this.setState({
            feedback,
          });
          break;
        default:
          break;
      }
      return;
    }

    if (!window.confirm("Would you like to change the status?")) {
      return;
    }

    let change = [];
    if (
      result.source.droppableId === "droppable-1" &&
      result.destination.droppableId === "droppable-2"
    ) {
      this.props
        .putKanbanStatusRequest(this.state.classID, result.draggableId, "DOING")
        .then(() => {
          if (this.props.putStatus.status === "SUCCESS") {
            message.success("Changed state.");
            change = reorder(
              result.source.index,
              result.destination.index,
              this.state.todo,
              this.state.doing
            );
            this.setState({
              todo: change[0],
              doing: change[1],
            });
          }
        });
    }

    if (
      result.source.droppableId === "droppable-2" &&
      result.destination.droppableId === "droppable-3"
    ) {
      this.props
        .putKanbanStatusRequest(
          this.state.classID,
          result.draggableId,
          "FEEDBACK"
        )
        .then(() => {
          if (this.props.putStatus.status === "SUCCESS") {
            message.success("Changed state.");
            change = reorder(
              result.source.index,
              result.destination.index,
              this.state.doing,
              this.state.feedback
            );
            this.setState({
              doing: change[0],
              feedback: change[1],
            });
          }
        });
    }

    // 2nd Lane -> 1st Lane
    if (
      result.source.droppableId === "droppable-2" &&
      result.destination.droppableId === "droppable-1"
    ) {
      this.props
        .putKanbanStatusRequest(this.state.classID, result.draggableId, "TODO")
        .then(() => {
          if (this.props.putStatus.status === "SUCCESS") {
            message.success("Changed state.");
            change = reorder(
              result.source.index,
              result.destination.index,
              this.state.doing,
              this.state.todo
            );
            this.setState({
              doing: change[0],
              todo: change[1],
            });
          }
        });
    }
  };

  importance(index) {
    switch (index) {
      case 1:
        return (
          <span class="badge badge-success" style={{ float: "right" }}>
            VERY LOW
          </span>
        );
      case 2:
        return (
          <span class="badge badge-primary" style={{ float: "right" }}>
            LOW
          </span>
        );
      case 3:
        return (
          <span class="badge badge-secondary" style={{ float: "right" }}>
            NORMAL
          </span>
        );
      case 4:
        return (
          <span class="badge badge-warning" style={{ float: "right" }}>
            HIGH
          </span>
        );
      case 5:
        return (
          <span class="badge badge-danger" style={{ float: "right" }}>
            VERY HIGH
          </span>
        );
      default:
        return <span class="badge badge-light">UNKNOWN</span>;
    }
  }

  render() {
    return (
      <div>
        <br />
        <h3>
          {this.state.title}&#40;{this.state.divide}&#41; /{" "}
          {this.state.projectTitle}
          <h5>MEMBER - {this.state.students}</h5>
        </h3>
        <br />

        <Row gutter={16} style={{ whiteSpace: "nowrap", overflowX: "auto" }}>
          <Spin spinning={this.state.loading}>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Col
                className="swimlane"
                style={{ padding: "0 8px", float: "left" }}
              >
                <Droppable droppableId="droppable-1">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.DroppableProvided}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <div style={{ height: 30, padding: "0 12px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <h5>Todo {this.state.todo.length}</h5>
                          {this.props.currentUser.type === "student" ? (
                            <Button
                              type="primary"
                              shape="circle"
                              size="middle"
                              icon="plus"
                              onClick={this.handleKanbanAddClick}
                            />
                          ) : null}
                        </div>
                      </div>
                      {this.state.todo.map((item) => (
                        <Draggable key={item.id} draggableId={item.id}>
                          {(provided, snapshot) => (
                            <div id={item.id} onClick={this.handleKanbanClick}>
                              <div
                                className="kanban-card"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.dragHandleProps}
                              >
                                <h5>{item.title}</h5>
                                {this.importance(item.importance)}
                                <br />
                                <h6 style={{ textAlign: "right" }}>
                                  D-day <TimeAgo date={item.end_date} />
                                </h6>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col className="swimlane" style={{ padding: "0 8px" }}>
                <Droppable droppableId="droppable-2">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <div style={{ height: 30, padding: "0 12px" }}>
                        <h5>Proceeding {this.state.doing.length}</h5>
                      </div>
                      {this.state.doing.map((item) => (
                        <Draggable key={item.id} draggableId={item.id}>
                          {(provided, snapshot) => (
                            <div id={item.id} onClick={this.handleKanbanClick}>
                              <div
                                className="kanban-card"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                              >
                                <h5>{item.title}</h5>
                                {this.importance(item.importance)}
                                <br />
                                <h6 style={{ textAlign: "right" }}>
                                  D-day <TimeAgo date={item.end_date} />
                                </h6>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col className="swimlane" style={{ padding: "0 8px" }}>
                <Droppable droppableId="droppable-3">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <div style={{ height: 30, padding: "0 12px" }}>
                        <h5>Feedback {this.state.feedback.length}</h5>
                      </div>
                      {this.state.feedback.map((item) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          isDragDisabled="false"
                        >
                          {(provided, snapshot) => (
                            <div id={item.id} onClick={this.handleKanbanClick}>
                              <div
                                className="kanban-card"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                              >
                                <h5>{item.title}</h5>
                                {this.importance(item.importance)}
                                <br />
                                <h6 style={{ textAlign: "right" }}>
                                  D-day <TimeAgo date={item.end_date} />
                                </h6>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </Col>
              <Col className="swimlane" style={{ padding: "0 8px" }}>
                <Droppable droppableId="droppable-4" isDropDisabled="false">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <div style={{ height: 30, padding: "0 12px" }}>
                        <h5>Complete {this.state.finish.length}</h5>
                      </div>
                      {this.state.finish.map((item) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          isDragDisabled="false"
                        >
                          {(provided, snapshot) => (
                            <div id={item.id} onClick={this.handleKanbanClick}>
                              <div
                                className="kanban-card"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                              >
                                <h5>{item.title}</h5>
                                <br />
                                <h6 style={{ textAlign: "right" }}>
                                  <TimeAgo date={item.date} /> Submitted
                                </h6>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </Droppable>
              </Col>
            </DragDropContext>
          </Spin>

          <KanbanInfo
            data={this.state.kanbanInfo}
            handleCancel={this.handleCancel}
            getKanbanList={this.getKanbanList}
          />
          <KanbanAdd
            data={this.state.kanbanAddInfo}
            handleCancel={this.handleCancel}
            getKanbanList={this.getKanbanList}
          />
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.status.currentUser,
    project: state.project.get,
    kanban: state.kanban.getList,
    kanbanInfo: state.kanban.get,
    putStatus: state.kanban.putStatus,
    getClassInfo: state.classroom.getClassInfo,
    getStudents: state.classroom.classStudent,
    getFeedback: state.feedback.get,
  };
};

const mapDispatchProps = (dispatch) => {
  return {
    getClassInfoRequest: (classID) => {
      return dispatch(getClassInfoRequest(classID));
    },
    getKanbanListRequest: (projectID) => {
      return dispatch(getKanbanListRequest(projectID));
    },
    getKanbanRequest: (kanbanID) => {
      return dispatch(getKanbanRequest(kanbanID));
    },
    putKanbanStatusRequest: (classID, kanbanID, status) => {
      return dispatch(putKanbanStatusRequest(classID, kanbanID, status));
    },
    getClassStudentRequest: (classID) => {
      return dispatch(getClassStudentRequest(classID));
    },
    getFeedbackRequest: (kanbanID) => {
      return dispatch(getFeedbackRequest(kanbanID));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchProps)(KanbanBoard)
);
