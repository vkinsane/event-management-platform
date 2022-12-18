import React, { Component } from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import {
  Alert,
  Container,
  Row,
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Nav,
  InputGroup,
} from "react-bootstrap";

import g from "../assets/images/g.svg";
import email_default from "../assets/images/req_for_adduser/email_default.jpg";
import password_default from "../assets/images/req_for_adduser/password_default.jpg";
import email_formatcorrect from "../assets/images/req_for_adduser/email_formatcorrect.jpg";
import email_formatwrong from "../assets/images/req_for_adduser/email_formatwrong.jpg";
import password_formatcorrect from "../assets/images/req_for_adduser/password_formatcorrect.jpg";
import password_formatwrong from "../assets/images/req_for_adduser/password_formatwrong.jpg";
// const port = process.env.REACT_APP_SERVER_PORT;

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    emailIcon: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Email</Tooltip>}
      >
        <span className="d-inline-block">
          <img alt="pic" src={email_default} height="50px" />
        </span>
      </OverlayTrigger>
    ),
    passwordIcon: (
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip id="tooltip-disabled">Enter Password</Tooltip>}
      >
        <span className="d-inline-block">
          <img alt="pic" src={password_default} height="50px" />
        </span>
      </OverlayTrigger>
    ),
    // loginSuccess
    emailFormatMatched: true,
    passwordFormatMatched: true,
    flag: false,
    alertType: "",
    message: "",
    newUserAdded: JSON.parse(localStorage.getItem("newUserAdded")),
    loadComponent: "",
  };
  // https://www.sitepoint.com/delay-sleep-pause-wait/ <= refered for timings
  timer() {
    setTimeout(() => {
      this.setState({ newUserAdded: false, alertType: "", message: "" });
      localStorage.removeItem("newUserAdded");
    }, 7000);
  }
  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });

    if (name === "email") {
      this.setState({
        emailIcon: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {value.match(
                  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
                ) != null
                  ? "Valid Format ✔"
                  : "Please enter email correct format"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img
                alt="pic"
                src={
                  value.match(
                    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
                  ) != null
                    ? email_formatcorrect
                    : email_formatwrong
                }
                height="50px"
              />
            </span>
          </OverlayTrigger>
        ),
        emailFormatMatched: !(
          value.match(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
          ) != null
        ),
      });
    }
    if (name === "password") {
      this.setState({
        passwordIcon: (
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {value !== ""
                  ? "Valid password Format ✔"
                  : "Password Cannot be empty"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <img
                alt="pic"
                src={
                  value !== "" ? password_formatcorrect : password_formatwrong
                }
                height="50px"
              />
            </span>
          </OverlayTrigger>
        ),
        passwordFormatMatched: !(value !== ""),
      });
    }
  };

  submit = (event) => {
    event.preventDefault();
    const payLoads = {
      email: this.state.email,
      password: this.state.password,
    };
    axios({
      url: `https://emp-backend.onrender.com/users/login`,
      method: "POST",
      data: payLoads,
    })
      .then((res) => {
        this.setState({ message: "Login success", alertType: "success" });
        // this.state.flag = true;
        this.setState({ flag: true });
        localStorage.setItem("login", JSON.stringify(this.state.flag));
        localStorage.setItem(
          "auth-token",
          JSON.stringify({ ...res.headers, "auth-token": res.data })
        );
        console.log({ ...res.headers, "auth-token": res.data });
        window.location.reload(false);
      })
      .catch((res) => {
        this.setState({
          message: "Invalid Email or Password",
          alertType: "danger",
          flag: false,
        });

        console.log(payLoads, res.data, "Internal Server error");
      });
    this.setState({ newUserAdded: false });
    localStorage.removeItem("newUserAdded");
  };

  responseGoogleSucess = (response) => {
    const payLoad = {
      email: response.profileObj.email,
      googleId: response.profileObj.googleId,
    };
    localStorage.setItem("userGoogleImgUrl", response.profileObj.imageUrl);
    // console.log(response.profileObj.email);
    axios({
      url: `https://emp-backend.onrender.com/users/google/login`,
      method: "POST",
      data: payLoad,
    })
      .then((res) => {
        this.setState({ message: "Login success", alertType: "success" });
        this.setState({ flag: true });
        localStorage.setItem("login", JSON.stringify(this.state.flag));
        localStorage.setItem(
          "auth-token",
          JSON.stringify({ ...res.headers, "auth-token": res.data })
        );
        console.log({ ...res.headers, "auth-token": res.data });
        window.location.reload(false);
      })
      .catch((res) => {
        this.setState({
          message: "Invalid Email or Password",
          alertType: "danger",
          flag: false,
        });
        console.log(payLoad, res, "Internal Server error");
      });
  };

  responseGoogleFailure = (response) => {
    console.log("Failed");
  };
  // componentDidMount = () => {
  //   console.log("Loaded");
  // };
  render() {
    return (
      <Container className="logreg-forms App-header py-5">
        {this.props && (
          <Alert variant={this.props.alertType}>{this.props.message}</Alert>
        )}
        {this.state.flag && (
          <Alert variant={this.props.alertType}>{this.props.message}</Alert>
        )}
        {<Alert variant={this.state.alertType}>{this.state.message}</Alert>}
        {!this.timer() && this.state.newUserAdded && (
          <React.Fragment>
            <Alert variant="info">
              Your account is activated please login to continue
            </Alert>
          </React.Fragment>
        )}

        <Form className="form-signin" onSubmit={this.submit}>
          <Nav fill variant="pills" activeKey="1" defaultActiveKey="/home">
            <Nav.Item>
              <Nav.Link eventKey="1">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                id="registerBtn"
                eventKey="2"
                // onClick={localStorage.setItem("loadComponent", "register")}
                href="/register"
              >
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form.Row as={Row} controlid="formBasicText">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Ex: sundarp@gmail.com"
                name="email"
                onChange={this.handleChange}
              />
              <InputGroup.Append>{this.state.emailIcon}</InputGroup.Append>
            </InputGroup>
          </Form.Row>
          <Form.Row as={Row} controlid="formBasicText">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type="password"
                placeholder="************"
                name="password"
                onChange={this.handleChange}
              />
              <InputGroup.Append>{this.state.passwordIcon}</InputGroup.Append>
            </InputGroup>
          </Form.Row>
          {/* ********************* login button ******************* */}
          {/* <Button variant="primary" type="submit">
            Login
          </Button> */}

          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="tooltip-disabled">
                {this.state.emailFormatMatched ||
                this.state.passwordFormatMatched
                  ? "Please enter valid inputs !"
                  : "Good to Go"}
              </Tooltip>
            }
          >
            <span className="d-inline-block">
              <Button
                variant="primary"
                type="submit"
                disabled={
                  this.state.emailFormatMatched ||
                  this.state.passwordFormatMatched
                }
                style={
                  this.state.passwordFormatMatched ||
                  this.state.emailFormatMatched
                    ? { pointerEvents: "none" }
                    : { pointerEvents: "" }
                }
              >
                Login
              </Button>
            </span>
          </OverlayTrigger>
          <GoogleLogin
            clientId="660818687419-boef8bbr0ck75c0n1h10f4plh5maocm3.apps.googleusercontent.com"
            onSuccess={this.responseGoogleSucess}
            onFailure={this.responseGoogleFailure}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <Button
                id="g"
                className="my-2"
                variant="light"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                block
              >
                <img
                  alt="pic"
                  src={g}
                  width="20"
                  height="20"
                  className="d-inline-block align-top"
                />{" "}
                &nbsp;Sign-in with Google
              </Button>
            )}
          ></GoogleLogin>
        </Form>
      </Container>
    );
  }
}
