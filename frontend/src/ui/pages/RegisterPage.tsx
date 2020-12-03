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
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Action, AnyAction, Dispatch } from 'redux';
import { setUserAction } from '../../redux/store';
import { useBoolean } from '../../utils/hooks/useBoolean';
import { useInput } from '../../utils/hooks/useInput';

interface DisplayProps {}

interface StoreProps {}

interface DispatchProps {
  setUser(user: any): AnyAction;
}

interface RegisterPageProps extends DisplayProps, StoreProps, DispatchProps {}

const mapStateToProps = (): StoreProps => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setUser: (user) => dispatch(setUserAction(user)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
    title: {
      textAlign: 'center',
    },
    formContainer: {
      width: '520px',
    },
    form: {
      margin: 'auto',
    },
  })
);

const RegisterPage: React.FC<RegisterPageProps> = ({ setUser }) => {
  const [first, firstActions] = useInput();
  const [last, lastActions] = useInput();
  const [email, emailActions] = useInput();
  const [password1, password1Actions] = useInput();
  const [password2, password2Actions] = useInput();

  const [passVisible, passVisibleActions] = useBoolean(false);

  const [wasBlurredByField, setWasBlurredByField] = useState({
    first: false,
    last: false,
    email: false,
    password1: false,
    password2: false,
  });

  const firstValid = true;
  const lastValid = true;
  const emailValid = true;

  const password1Valid = true;
  const password2Valid = true;
  const passwordsMatch = password1 === password2;

  const disableRegister =
    !firstValid ||
    !lastValid ||
    !emailValid ||
    !password1Valid ||
    !password2Valid ||
    !passwordsMatch;

  const onFieldBlur = (field: keyof typeof wasBlurredByField) => {
    const newFieldBlurred = { ...wasBlurredByField };
    newFieldBlurred[field] = true;
    setWasBlurredByField(newFieldBlurred);
  };

  const classes = useStyles({});
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
            <Typography className={classes.title} variant="h3">
              Create My Account
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="First Name"
              value={first}
              onChange={firstActions.onChange}
              onBlur={() => onFieldBlur('first')}
              error={wasBlurredByField.first && !firstValid}
              helperText={
                wasBlurredByField.first && !firstValid
                  ? 'Please enter a valid name'
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Last Name"
              value={last}
              onChange={lastActions.onChange}
              onBlur={() => onFieldBlur('last')}
              error={wasBlurredByField.last && !lastValid}
              helperText={
                wasBlurredByField.last && !lastValid
                  ? 'Please enter a valid name'
                  : undefined
              }
            />
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
              error={wasBlurredByField.email && !emailValid}
              helperText={
                wasBlurredByField.email && !emailValid
                  ? 'Please enter a valid email'
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Password"
              type={passVisible ? 'text' : 'password'}
              value={password1}
              onChange={password1Actions.onChange}
              onBlur={() => onFieldBlur('password1')}
              error={wasBlurredByField.password1 && !password1Valid}
              helperText={
                wasBlurredByField.password1 && !password1Valid
                  ? `Must be at least 8 characters`
                  : undefined
              }
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              variant="outlined"
              label="Confirm Password"
              type={passVisible ? 'text' : 'password'}
              value={password2}
              onChange={password2Actions.onChange}
              onBlur={() => onFieldBlur('password2')}
              error={
                wasBlurredByField.password2 &&
                (!password2Valid || !passwordsMatch)
              }
              helperText={
                wasBlurredByField.password2
                  ? !password2Valid
                    ? `Must be at least 8 characters`
                    : !passwordsMatch
                    ? "Passwords don't match"
                    : undefined
                  : undefined
              }
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
              disabled={disableRegister}
            >
              Create My Account
            </Button>
          </Grid>
          <Grid item>
            Already have an account?{' '}
            <Link color="secondary" component={RouterLink} to="/login">
              Sign in
            </Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
