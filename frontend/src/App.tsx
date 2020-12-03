import { createStyles, makeStyles, Theme } from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Action, AnyAction, Dispatch } from 'redux';
import { BalanceStore, setUserAction, SnackbarInfo } from './redux/store';
import Alert from './ui/components/Alert';
import Dashboard from './ui/pages/Dashboard/Dashboard';
import LoginPage from './ui/pages/LoginPage';
import RegisterPage from './ui/pages/RegisterPage';
import { useMount } from './utils/hooks/useMount';

interface StoreProps {
  snackbar: SnackbarInfo;
}

interface DispatchProps {
  setUser(user: any): AnyAction;
}

interface DisplayProps {}

interface AppProps extends StoreProps, DispatchProps, DisplayProps {}

const mapStateToProps = ({ snackbar }: BalanceStore): StoreProps => {
  return {
    snackbar,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setUser: (user) => dispatch(setUserAction(user)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
  })
);

const App: React.FC<AppProps> = ({ setUser }) => {
  useStyles({});
  useMount(async () => {
    const userIdStr = localStorage.getItem('user-id');
    if (userIdStr) {
      const res = await axios.get(`http://localhost:3001/users/${userIdStr}`);
      const user = res.data;
      setUser(user);
    }
  });

  return (
    <React.Fragment>
      <Alert />
      <BrowserRouter>
        <Switch>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/dashboard/:userId/budget/:tab">
            <Dashboard />
          </Route>
          <Route path="/dashboard/:userId/:componentName?">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
