import {
  Box,
  Button,
  Container,
  createStyles,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Action, AnyAction, Dispatch } from 'redux';
import {
  BalanceStore,
  setSnackbarAction,
  setUserAction,
  SnackbarInfo,
} from '../../redux/store';
import { useBoolean } from '../../utils/hooks/useBoolean';
import { useInput } from '../../utils/hooks/useInput';

interface DisplayProps {}

interface StoreProps {
  user: any | null;
}
interface DispatchProps {
  setUser(user: any): AnyAction;
  setSnackbar(snackbar: Partial<SnackbarInfo>): AnyAction;
}

interface LoginPageProps extends DisplayProps, StoreProps, DispatchProps {}

const mapStateToProps = ({ user }: BalanceStore): StoreProps => {
  return {
    user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setUser: (user) => dispatch(setUserAction(user)),
    setSnackbar: (snackbar) => dispatch(setSnackbarAction(snackbar)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
    textCenter: {
      textAlign: 'center',
    },
    formContainer: {
      width: '400px',
    },
    form: {
      margin: 'auto',
    },
  })
);

const LoginPage: React.FC<LoginPageProps> = ({ setUser, setSnackbar }) => {
  const [email, emailActions] = useInput();
  const [password, passwordActions] = useInput();

  const [passVisible, passVisibleActions] = useBoolean(false);

  const [wasBlurredByField, setWasBlurredByField] = useState({
    email: false,
    password: false,
  });

  const classes = useStyles({});
  const history = useHistory();

  const onFieldBlur = (field: keyof typeof wasBlurredByField) => {
    const newFieldBlurred = { ...wasBlurredByField };
    newFieldBlurred[field] = true;
    setWasBlurredByField(newFieldBlurred);
  };

  const onClickLogin = useCallback(async () => {
    try {
      const res = await axios.post('http://localhost:3001/users/login', {
        email: email,
        passwd: password,
      });
      const user = res.data;
      setSnackbar({
        open: true,
        message: 'Login Successful',
        color: 'success',
      });
      setUser(user);
      localStorage.setItem('user-id', user.user_id);
      user &&
        history.replace(
          localStorage.getItem('login-redirect') ?? `/dashboard/${user.user_id}`
        );
    } catch (e) {
      const error: AxiosError = e;
      const message =
        error.response?.data?.message ?? 'Something went wrong, try again';
      setSnackbar({
        message,
        open: true,
        color: 'error',
      });
    }
  }, [email, password, history, setSnackbar, setUser]);

  return (
    <Box
      className={classes.root}
      display="flex"
      alignItems="center"
      minHeight="100vh"
    >
      <Container className={classes.formContainer}>
        <Grid
          className={classes.RegisterForm}
          container
          justify="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography className={classes.textCenter} variant="h3">
              Sign In
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Email"
              value={email}
              onChange={emailActions.onChange}
              onBlur={() => onFieldBlur('email')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Password"
              type={passVisible ? 'text' : 'password'}
              value={password}
              onChange={passwordActions.onChange}
              onBlur={() => onFieldBlur('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={passVisibleActions.toggle}
                    >
                      {passVisible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              color="primary"
              size="large"
              variant="contained"
              onClick={onClickLogin}
            >
              Sign In
            </Button>
          </Grid>
          <Grid item>
            First time?{' '}
            <Link color="secondary" component={RouterLink} to="/register">
              Create New Account
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
