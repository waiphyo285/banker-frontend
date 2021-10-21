import { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Button, Toolbar, Typography } from "@mui/material";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";

type Props = {};

type State = {
  content: object[];
}

export default class BoardHistory extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: []
    };
  }

  componentDidMount() {
    UserService.getHistoryBoard().then(
      (response: any) => {
        this.setState({
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
      { field: 'transfer_acc', headerName: 'Transfer Account', width: 200 },
      { field: 'receive_acc', headerName: 'Receive Account', width: 200 },
      { field: 'transfer_type', headerName: 'Transfer Type', width: 150 },
      { field: 'transfer_amount', headerName: 'Amount', width: 150, type: 'number' },
      { field: 'transfer_charge', headerName: 'Charge', width: 150, type: 'number' },
      { field: 'remark', headerName: 'Remark', width: 150 },
      { field: 'transfer_complete', headerName: 'Complete', width: 150, type: 'boolean' },
      {
        field: 'updated_at', headerName: 'Updated', width: 150,
        renderCell: (data: any) => {
          return data.value ? (new Date(data.value)).toLocaleDateString() : '';
        }
      },
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        renderCell: (params: { api: any; getValue: (arg0: any, arg1: any) => any; id: any; }) => {
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
      <div style={{ height: 600 }}>
        <Toolbar>
          <Typography color="inherit" style={{ flex: 1, textAlign: "center", fontSize: 18 }}>
            History List
          </Typography>

          {/* <Link href="/register">New</Link> */}
        </Toolbar>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
        // checkboxSelection
        />
      </div >
    );
  }
}
