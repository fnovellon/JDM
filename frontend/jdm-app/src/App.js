import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class App extends Component {
  render() {
    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Typography variant="h6" color="inherit">
                    JeuxDeMots
                </Typography>
            </Toolbar>
        </AppBar>
    );
  }
}

export default App;
