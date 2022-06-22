import React, { Component } from "react";
import Papa from "papaparse";
import axios from "axios";

// Importing Logos
import addStudent from "../assets/images/AddStudent.svg";

// Importing the Components from react-bootstrap
import { Container, Col, Form, Row, Alert, Button } from "react-bootstrap";

export default class ImportCsv extends Component {
  state = {
    fname: "",
    email: "",
    event_name: "",
    e_duration: "",
    slots: {},
    persons: [],
    eventsData: [],
    message: "",
    alertType: "",
    csvParsedData: [],
    showAlert: false,
  };

  // Fetch Data as Soon as Component Loads
  componentDidMount() {
    // localStorage.removeItem("parseSuccess");
    axios
      .get(`http://localhost:5000/event/`)
      .then((res) => {
        this.setState({ eventsData: res.data, event_name: res.data[0].ename });
      })
      .catch((errors) => {
        console.error(errors);
      });
  }

  // Set the Data in state variables
  handleChangeEvent = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
    const slots = {};
    this.state.eventsData
      .filter((row) => row.ename === value)
      .map((eventx) =>
        Object.keys(eventx.slots).map((opt) => {
          slots[opt] = [];
          return 0;
        })
      );
    this.setState({ slots: slots });
  };

  // Update the Data in Database
  handleChange = async ({ target }) => {
    // const csvFile = target.files[0];
    Papa.parsePromise = function (file) {
      return new Promise(function (complete, error) {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete,
        });
      });
    };
    var getData = await Papa.parsePromise(target.files[0]).then(function (
      results
    ) {
      return results.data;
    });
    this.setState({
      csvParsedData: getData,
    });

    // this.submitData(this.state.csvParsedData);
  };

  submitData = (e) => {
    e.preventDefault();

    var parsedData = this.state.csvParsedData;
    var ev_name = this.state.event_name;
    var slots = this.state.slots;
    console.log(parsedData);
    if (parsedData.length == 0) {
      this.setState({ message: "Error Occured", alertType: "danger" });
    }
    parsedData.map((student) => {
      if (student.fname != null) {
        student.event_name = ev_name;
        student.slots = slots;
        axios
          .post(`http://localhost:5000/attendance/register`, {
            fname: student.fname,
            email: student.email,
            event_name: student.event_name,
            contact: student.contact,
            e_duration: student.e_duration,
            slots: student.slots,
          })
          .then(() => {
            console.log("Data has been sent to the server");
            this.setState({
              message: "Candidates added for " + this.state.event_name,
              alertType: "success",
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({ message: "Error Occured", alertType: "danger" });
          });
      } else {
        this.setState({ message: "Error Occured", alertType: "danger" });
      }
    });

    this.setState({
      showAlert: true,
    });
  };
  render() {
    return (
      <Container className="App-header py-5">
        {this.state.showAlert && (
          <Alert variant={this.state.alertType}>{this.state.message}</Alert>
        )}
        <h1>Choose event name from the Dropdown</h1>
        <Form.Control
          name="event_name"
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
        <Form onChange={this.handleChange}>
          <input id="fileItem" type="file" />

          <Button variant="primary" type="submit" onClick={this.submitData}>
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}
