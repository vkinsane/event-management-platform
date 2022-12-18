import React, { Component } from "react";
import axios from "axios";

// Importing Logos
import addEvent from "../assets/images/AddEvent.svg";

// Importing the Components from react-bootstrap
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
var slots = {};
export default class AddEvent extends Component {
  state = {
    dayCount: 0,
    ename: "",
    date: "",
    venue: "",
    duration: "",
    dayslots: "",

    counter: 0,
    message: "",
    alertType: "",
  };

  // Converting Slots into Object
  convertingSlots() {
    const tempSlotObject = slots;
    // const toSendObj = [];
    for (let a = 1; a <= Object.keys(tempSlotObject).length; a++) {
      const dayMaker = "Day" + a;
      Object.keys(tempSlotObject[dayMaker]).map((slot) => {
        tempSlotObject[dayMaker].push(
          `${slot} : ${tempSlotObject[dayMaker][slot]}`
        );
        delete tempSlotObject[dayMaker][slot];
        return 0;
      });
      this.setState({ slots: tempSlotObject });
      console.log(tempSlotObject);
    }
  }

  // Record the Changes in Each Slot
  handleChangeEachSlot = ({ target }) => {
    const { id, name, value } = target;
    slots[id][name] = value;
    console.log(slots);
  };

  // Slot No. Setter
  updateSlotInputBoxes() {
    this.setState({ counter: this.state.counter + 1 });
  }

  // Updating Value in State if Value Changes
  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  // Slot Input Generator
  handleChangeEachDay = ({ target }) => {
    const { name, value } = target;
    slots[name] = [];
    for (let i = 1; i <= value; i++) {
      const slotMaker = "Slot" + i;
      slots[name][slotMaker] = "";
    }
    console.log(slots);
    this.updateSlotInputBoxes();
  };

  // Slot Input Generator
  handleChangeDuration = ({ target }) => {
    const { name, value } = target;

    this.setState({ [name]: value });
    slots = {};

    for (let i = 1; i <= value; i++) {
      const dayMaker = "Day" + i;
      slots[dayMaker] = [];
    }
    console.log(slots);
  };

  // on Submission Add New Event
  submit = (event) => {
    event.preventDefault();

    this.convertingSlots();

    const payLoad = {
      ename: this.state.ename,
      date: this.state.date,
      venue: this.state.venue,
      duration: this.state.duration,
      slots: slots,
    };

    axios({
      url: "https://emp-backend.onrender.com/event/add",
      method: "POST",
      data: payLoad,
    })
      .then(() => {
        console.log("Add event Data has been sent to the server");
        this.setState({
          message: "Event has been added to the server",
          alertType: "success",
        });
      })
      .catch(() => {
        console.log("Internal Server error");
        this.setState({ message: "Couldn't add event", alertType: "danger" });
      });
  };
  componentDidMount = () => {
    console.log("Loaded");
  };
  render() {
    return (
      <Container className="App-header py-5">
        {/* display-the-alert-message-begin */}
        <Alert variant={this.state.alertType}>{this.state.message}</Alert>
        {/* display-the-alert-message-end */}

        {/* add-event-form-begin */}
        <Row>
          <Col sm="3">
            <img
              alt=""
              src={addEvent}
              width="200"
              height="200"
              className="d-inline-block align-top"
            />
          </Col>
          <Col sm="9" className="App-header">
            <h1 className={this.props.mode}>Add Event</h1>
          </Col>
        </Row>
        <Form onSubmit={this.submit}>
          {/* EVENT NAME */}
          <Form.Row as={Row} controlid="formBasicText">
            <Form.Label column sm="2">
              Event Name
            </Form.Label>

            <Col column sm="10" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Ex: ML FEST"
                name="ename"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* EVENT DATE */}
          <Form.Row as={Row} controlid="formBasicText">
            <Form.Label column sm="2">
              Event Date
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <Form.Control
                column
                sm="10"
                type="date"
                placeholder=""
                name="date"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* VENUE */}
          <Form.Row as={Row} controlid="formBasicText">
            <Form.Label column sm="2">
              Venue
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <Form.Control
                column
                sm="10"
                type="text"
                placeholder="Enter Venue"
                name="venue"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Row>

          {/* DURATION */}
          <Form.Row as={Row} controlid="formBasicTest">
            <Form.Label column sm={2}>
              Duration
            </Form.Label>
            <Col column sm="10" className="mb-4">
              <InputGroup column sm={10} className="mb-2">
                <Form.Control
                  type="number"
                  placeholder="Duration "
                  name="duration"
                  onChange={this.handleChangeDuration}
                />
                <InputGroup.Append>
                  <InputGroup.Text>Days</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Form.Row>

          {/* SLOTS */}
          <Form.Row as={Row} controlid="formBasicTest">
            <Form.Label column sm={2}>
              Slots:
            </Form.Label>
            {Object.keys(slots).map((day) => {
              return (
                <Col as={Col} className="mb-4">
                  <Form.Label column sm={2}>
                    {day}
                  </Form.Label>
                  <Form.Control
                    column
                    type="number"
                    placeholder="Enter No of slots in a Day"
                    name={day}
                    onChange={this.handleChangeEachDay}
                  />

                  {Object.keys(slots[day]).map((slot) => {
                    return (
                      <Form.Row as={Row} controlid="formBasicText">
                        <Col as={Col}>
                          <Form.Label column sm={2}>
                            {slot}
                          </Form.Label>
                          <Form.Control
                            column
                            type="time"
                            placeholder="Enter time"
                            name={slot}
                            id={day}
                            onChange={this.handleChangeEachSlot}
                          />
                        </Col>
                      </Form.Row>
                    );
                  })}
                </Col>
              );
            })}
          </Form.Row>

          {/* SUBMIT BUTTON */}
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {/* add-event-form-end */}
      </Container>
    );
  }
}
