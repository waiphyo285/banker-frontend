import { Component } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import userService from "../services/user.service";
import EventBus from "../common/EventBus";

type Props = {};

type State = {
  all_account: object[];
  transfer_acc: object[];
  receive_acc: object[];
  initial_value: any;
  successful: boolean,
  message: string
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleOnChangeTran = this.handleOnChangeTran.bind(this);
    this.handleOnChangeRec = this.handleOnChangeRec.bind(this);
    this.handleOnChangeAmt = this.handleOnChangeAmt.bind(this);
    this.handleOnChangeType = this.handleOnChangeType.bind(this);
    this.handleOnChangeRmk = this.handleOnChangeRmk.bind(this);

    this.state = {
      all_account: [],
      transfer_acc: [],
      receive_acc: [],
      initial_value:
      {
        transfer_acc_id: "",
        receive_acc_id: "",
        transfer_amount: 0,
        transfer_type: "fast",
        remark: ""
      },
      successful: false,
      message: "",
    };
  }

  validationSchema() {
    return Yup.object().shape({
      remark: Yup.string()
        .test(
          "len",
          "Remark must be between 10 and 255 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 3 &&
            val.toString().length <= 20
        )
        .required("This field is required!"),
      transfer_amount: Yup.string()
        .test(
          "len",
          "Amount must be between 1 and 12 digits.",
          (val: any) =>
            val &&
            val.toString().length >= 1 &&
            val.toString().length <= 12
        )
        .required("This field is required!"),
    });
  }

  handleOnChangeTran(ev: any) {
    this.setState({
      ...this.state,
      initial_value: {
        ...this.state.initial_value,
        transfer_acc_id: ev.target.value,
      },
      receive_acc: this.state.all_account.filter((rec_acc: any) => rec_acc.account_id !== ev.target.value)
    })
  }

  handleOnChangeRec(ev: any) {
    this.setState({
      ...this.state,
      initial_value: {
        ...this.state.initial_value,
        receive_acc_id: ev.target.value,
      },
      transfer_acc: this.state.all_account.filter((rec_acc: any) => rec_acc.account_id !== ev.target.value)
    })
  }

  handleOnChangeAmt(ev: any) {
    this.setState({
      ...this.state,
      initial_value: {
        ...this.state.initial_value,
        transfer_amount: ev.target.value,
      },
    })
  }

  handleOnChangeType(ev: any) {
    this.setState({
      ...this.state,
      initial_value: {
        ...this.state.initial_value,
        transfer_type: ev.target.value,
      },
    })
  }

  handleOnChangeRmk(ev: any) {
    this.setState({
      ...this.state,
      initial_value: {
        ...this.state.initial_value,
        remark: ev.target.value,
      },
    })
  }

  handleRegister(formValue: { transfer_acc_id: string; receive_acc_id: string, transfer_amount: number, transfer_type: string, remark: string }) {
    // const { transfer_acc_id, receive_acc_id, transfer_amount, transfer_type, remark } = formValue;

    this.setState({
      message: "",
      successful: false
    });

    userService.postTransferMoney(this.state.initial_value).then(
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

  componentDidMount() {
    userService.getCustomerBoard().then(
      (response: any) => {
        this.setState({
          ...this.state,
          all_account: response.data.data,
          transfer_acc: response.data.data,
          receive_acc: response.data.data
        });

        console.log(this.state.all_account);
      },
      error => {
        this.setState({
          all_account:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    const { successful, message } = this.state;

    return (
      <div className="col-md-12">
        <div className="">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={this.state.initial_value}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <h4 style={{ textAlign: "center" }}>Transfer Money</h4>

                  <div className="form-group">
                    <label htmlFor="transfer_acc_id"> From Account </label>
                    <Field as="select" name="transfer_acc_id" type="text" className="form-control" value={this.state.initial_value.transfer_acc_id} onChange={this.handleOnChangeTran}>
                      <option value="Choose one"> Choose one </option>
                      {
                        this.state.transfer_acc.map((account: any, idx: number) =>
                          <option key={idx} value={account.account_id}> {account.account_number} </option>
                        )
                      }
                    </Field>
                    <ErrorMessage
                      name="transfer_acc_id"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="receive_acc_id"> To Account </label>
                    <Field as="select" name="receive_acc_id" type="text" className="form-control" value={this.state.initial_value.receive_acc_id} onChange={this.handleOnChangeRec}>
                      <option value="Choose one"> Choose one </option>
                      {
                        this.state.receive_acc.map((account: any, idx: number) =>
                          <option key={idx} value={account.account_id}> {account.account_number} </option>
                        )
                      }
                    </Field>
                    <ErrorMessage
                      name="receive_acc_id"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="transfer_amount"> Amount </label>
                    <Field
                      name="transfer_amount"
                      type="number"
                      min="1"
                      max="1000"
                      className="form-control"
                      onKeyUp={this.handleOnChangeAmt}
                    />
                    <ErrorMessage
                      name="transfer_amount"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="transfer_type"> Transfer Type </label>
                    <Field as="select" name="transfer_type" type="text" className="form-control" onChange={this.handleOnChangeType}>
                      <option value="fast">Fast Transfer</option>
                      <option value="normal">Normal Transfer</option>
                    </Field>
                    <ErrorMessage
                      name="transfer_type"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="remark"> Remark </label>
                    <Field name="remark" type="text" className="form-control" onKeyUp={this.handleOnChangeRmk} />
                    <ErrorMessage
                      name="remark"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
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
      </div >
    );
  }
}
