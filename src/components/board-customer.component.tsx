import { Component } from "react";
// import fakeData from "../data/user.json";
import UserService from "../services/user.service";
import { Button, Link, Toolbar, Typography } from "@mui/material";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import EventBus from "../common/EventBus";


type Props = {};

type State = {
  content: object[]
}

export default class BoardCustomer extends Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      content: []
    };
  }

  componentDidMount() {
    UserService.getCustomerBoard().then(
      (response: any) => {
        this.setState({
          ...this.state,
          content: response.data.data
        });
      },
      error => {
        this.setState({
          content:
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

    const columns: GridColDef[] = [
      // { field: 'id', headerName: '#', width: 100 },
      { field: 'account_number', headerName: 'Account No.', width: 180 },
      { field: 'username', headerName: 'Account Name', width: 180 },
      { field: 'account_type', headerName: 'Account Type', width: 180 },
      { field: 'status', headerName: 'Status', width: 130, type: 'boolean' },
      {
        field: 'updated_at', headerName: 'Updated', width: 150,
        renderCell: (data: any) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },
      { field: 'deposit_amount', headerName: 'Deposit', width: 150, type: 'number' },
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        renderCell: (params) => {
          const onClick = (e: { stopPropagation: () => void; }) => {
            e.stopPropagation(); // don't select this row after clicking

            const api: GridApi = params.api;
            const thisRow: Record<string, GridCellValue> = {};

            api
              .getAllColumns()
              .filter((c: any) => c.field !== "__check__" && !!c)
              .forEach(
                (c: any) => (thisRow[c.field] = params.getValue(params.id, c.field))
              );

            return alert(JSON.stringify(thisRow, null, 4));
          };

          return <Button onClick={onClick}>Click</Button>;
        }
      },
    ];

    const rows = this.state.content;

    return (
      <div style={{ height: 400 }}>
        <Toolbar>
          <Typography color="inherit" style={{ flex: 1, textAlign: "center", fontSize: 18 }}>
            Customer List
          </Typography>

          <Link href="/new_customer">New</Link>
        </Toolbar>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        // checkboxSelection
        />
      </div >
    );
  }
}
