import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import userService from "../services/user.service";

type Props = {};

type State = {
    username: string,
    password: string,
    successful: boolean,
    message: string
};

export default class Register extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            username: "",
            password: "",
            successful: false,
            message: ""
        };
    }

    validationSchema() {
        return Yup.object().shape({
            username: Yup.string()
                .test(
                    "len",
                    "The username must be between 3 and 20 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 3 &&
                        val.toString().length <= 20
                )
                .required("This field is required!"),
            password: Yup.string()
                .test(
                    "len",
                    "The password must be between 6 and 40 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 6 &&
                        val.toString().length <= 40
                )
                .required("This field is required!"),
        });
    }

    handleRegister(formValue: { username: string; password: string, account_type: string }) {
        const { username, password, account_type } = formValue;

        this.setState({
            message: "",
            successful: false
        });

        userService.postNewCustomer(
            username,
            password,
            account_type
        ).then(
            response => {
                this.setState({
                    message: response.data.message,
                    successful: true
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const { successful, message } = this.state;

        const initialValues = {
            username: "",
            password: "",
            account_type: ""
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleRegister}
                    >
                        <Form>
                            {!successful && (
                                <div>
                                    <h4 style={{ textAlign: "center" }}>Create  Account</h4>
                                    <div className="form-group">
                                        <label htmlFor="username"> Username </label>
                                        <Field name="username" type="text" className="form-control" />
                                        <ErrorMessage
                                            name="username"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password"> Password </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="account_type"> Account Type </label>
                                        <Field component="select" name="account_type" type="text" className="form-control">
                                            <option value="current">Current Account</option>
                                            <option value="savings">Savings Account</option>
                                            <option value="recurring_deposit">Recurring Deposit Account</option>
                                            <option value="fixed_deposit">Fixed Deposit Account</option>
                                        </Field>
                                        <ErrorMessage
                                            name="account_type"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary btn-block">Create Account</button>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            successful ? "alert alert-success" : "alert alert-danger"
                                        }
                                        role="alert"
                                    >
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}