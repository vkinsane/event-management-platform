import React, { Component } from "react";
import Papa from "papaparse";
import axios from "axios";

// Importing Logos
import addStudent from "../assets/images/AddStudent.svg";
import csvFile from "../assets/files/sample_file.csv";
// Importing the Components from react-bootstrap
import { Container, Col, Form, Row, Alert } from "react-bootstrap";

export default class ImportCsv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      email: "",
      eventsData: [],
      eventName: "",
      eventDuration: "",
      slots: {},
      fileUploaded: false,
      fileData: [],
    };
  }

  // Fetch Data as Soon as Component Loads
  componentDidMount() {
    axios
      .get(`https://emp-backend.onrender.com/event/`)
      .then((res) => {
        this.setState({
          eventsData: res.data,
          eventName: res.data[0].ename,
          slots: res.data[0].slots,
          eventDuration: res.data[0].duration,
        });

        console.log(this.state);
      })
      .catch((errors) => {
        console.error(errors);
      });
  }

  // Set the Data in state variables
  handleChangeEvent = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    this.state.eventsData
      .filter((row) => row.ename === value)
      .map((eachEvent) => {
        this.setState({
          eventName: eachEvent.ename,
          slots: eachEvent.slots,
          eventDuration: eachEvent.duration,
        });

        return 0;
      });
    // console.log(this.state);
  };

  // Update the Data in Database
  sendDataToServer = (e) => {
    e.preventDefault();
    var fetchedData = this.state.fileData;
    console.log(fetchedData);
    fetchedData.map((student) => {
      console.log(student);
      student.eventName = this.state.eventName;
      student.slots = this.state.slots;
      axios
        .post(`https://emp-backend.onrender.com/attendance/register`, {
          fname: student.fname,
          email: student.email,
          contact: student.contact,
          event_name: student.eventName,
          slots: student.slots,
        })
        .then(() => {
          // console.log("Data has been sent to the server");
          alert(
            "Student " +
              student.fname +
              " registration done for event " +
              student.eventName
          );
        })
        .catch((error) => {
          // console.log(error);
          alert("There was some error" + error);
        });
      return 0;
    });
  };

  handleChangeFile = ({ target }) => {
    const file = target.files[0];
    this.setState({ message: "Processing", alertType: "warning" });
    const updateFileUploaded = (fetchedData) => {
      fetchedData.pop(); //removing the last empty entry row
      console.log("file received");
      console.log(fetchedData);
      this.setState({ fileData: fetchedData });
      this.setState({ fileUploaded: true });
    };

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function (fetchedData) {
        updateFileUploaded(fetchedData.data);
      },
    });
  };

  render() {
    return (
      <Container className="App-header py-5">
        {this.state.parseSuccess && (
          <Alert variant="success">Data has been sent to server</Alert>
        )}
        <h1>Choose event name from the Dropdown</h1>
        <Form.Control
          name="eventName"
          id="event-input"
          placeholder="Event Name"
          as="select"
          onChange={this.handleChangeEvent}
          custom
        >
          <option value="#" disabled>
            --Select--
          </option>
          {this.state.eventsData.map((opt) => (
            <option key={opt._id} value={opt.ename}>
              {opt.ename}
            </option>
          ))}
        </Form.Control>
        <Row>
          <Col sm="3">
            <img
              alt=""
              src={addStudent}
              width="200"
              height="200"
              className="d-inline-block align-top"
            />
          </Col>
          <Col sm="9" className="App-header">
            <h1 className={this.props.mode}>Add Students for Event</h1>
          </Col>
        </Row>
        <Form onChange={this.handleChangeFile}>
          <input id="fileItem" type="file" accept=".csv" />{" "}
          <a href={csvFile} download>
            Download Sample CSV File
          </a>{" "}
          {this.state.fileUploaded && (
            <button onClick={this.sendDataToServer.bind(this)}>Submit</button>
          )}
          {/* <button onClick={this.increaseCount.bind(this)}>
            count {this.state.count}
          </button> */}
        </Form>
      </Container>
    );
  }
}
