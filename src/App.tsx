import { Component } from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// import UserService from "./services/user.service";
import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardCustomer from "./components/board-customer.component";
import BoardHistory from "./components/board-history.component";
import NewCustomer from "./components/customer.component";
import Notification from "./components/notification.component";
import socketIOClient from "socket.io-client";

import EventBus from "./common/EventBus";
import { Badge } from "@mui/material";

type Props = {};

type State = {
  showCustomerBoard: boolean,
  showUserBoard: boolean,
  currentUser: IUser | undefined,
  content: object[]
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showCustomerBoard: false,
      showUserBoard: false,
      currentUser: undefined,
      content: []
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        ...this.state,
        currentUser: user,
        showCustomerBoard: user.roles.includes("MODERATOR"),
        showUserBoard: user.roles.includes("ADMIN"),
      });
    }

    const socket = socketIOClient("http://localhost:7070");
    socket.on("FromAPI", data => {
      this.setState({ ...this.state, content: data.data });
    });

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showCustomerBoard: false,
      showUserBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showCustomerBoard, showUserBoard } = this.state;
    const notificationLength = this.state.content.length || 0;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          {currentUser && (
            <Link to={"/"} className="navbar-brand">
              Banker
            </Link>
          )}

          <div className="navbar-nav mr-auto">
            {currentUser && (
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>
            )}

            {showUserBoard && (
              <li className="nav-item">
                <Link to={"/user"} className="nav-link">
                  User
                </Link>
              </li>
            )}

            {showCustomerBoard && (
              <li className="nav-item">
                <Link to={"/customer"} className="nav-link">
                  Customer
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/history"} className="nav-link">
                  History
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/notification"} className="nav-link">
                  Notification <Badge variant='standard' >{notificationLength}</Badge>
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Log Out
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Log In
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav >

        <div className="container mt-3">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            {!currentUser ? (
              <Redirect to={{
                pathname: '/login'
              }} />
            ) : (
              <>
                <Route exact path={["/", "/home"]} component={Home} />
                <Route exact path="/profile" component={Profile} />
                <Route path="/user" component={BoardUser} />
                <Route path="/history" component={BoardHistory} />
                <Route path="/customer" component={BoardCustomer} />
                <Route path="/new_customer" component={NewCustomer} />
                <Route path="/notification" component={Notification} />
              </>
            )}
            {/* <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/user" component={BoardUser} />
            <Route exact path="/history" component={BoardHistory} />
            <Route exact path="/customer" component={BoardCustomer} />
            <Route exact path="/new_customer" component={NewCustomer} />
            <Route exact path="/notification" component={Notification} /> */}
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div >
    );
  }
}

export default App;
