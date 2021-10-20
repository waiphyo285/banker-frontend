import { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  currentUser: IUser & { accessToken: string }
}
export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { accessToken: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
          <div className="jumbotron">
            <header>
              <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
              />
              <h3 style={{ textAlign: 'center' }}>
                <strong>{currentUser.username}</strong>
              </h3>
            </header>
            {/* <p>
              <strong>Token:</strong>{" "}
              {currentUser.accessToken.substring(0, 20)} ...{" "}
              {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
            </p> */}
            <div className="card card-container">
              <p>
                <strong>Username:</strong>{" "}
                {currentUser.username}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {('' + !!currentUser.status).toUpperCase()}
              </p>

              <p>
                <strong>Authorities:</strong>{" "}
                {currentUser.roles}
              </p>
            </div>
          </div> : null}
      </div>
    );
  }
}
