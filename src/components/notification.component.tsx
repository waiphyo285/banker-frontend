import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { Button, CardContent, Toolbar } from "@mui/material";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import { isTryStatement } from 'typescript';

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

        const content = this.state.content;

        return (
            <>
                <Toolbar>
                    <Typography color="inherit" style={{ flex: 1, textAlign: "center", fontSize: 18 }}>
                        Notification
                    </Typography>

                    {/* <Link href="/register">New</Link> */}
                </Toolbar>
                <List sx={{ width: '100%', maxHeight: 600, overflowY: 'auto', bgcolor: 'background.paper' }}>
                    {content.map((item: any, idx: any) =>
                        <div key={idx}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt="Travis Howard" src="/static/images/avatar/1.jpg" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.transfer_type.toUpperCase() + " Transfer  "}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                to {item.receive_acc}
                                            </Typography>
                                            {" — " + item.transfer_amount + "MMK was transferred from " + item.transfer_acc}
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </div>
                    )}
                </List>
            </>
        );
    }
}


