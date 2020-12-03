import {
  createStyles,
  IconButton,
  makeStyles,
  Snackbar,
  Theme,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Alert as MaterialAlert } from '@material-ui/lab';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction, Dispatch } from 'redux';
import {
  BalanceStore,
  setSnackbarAction,
  SnackbarInfo,
} from '../../redux/store';

interface StoreProps {
  snackbar: SnackbarInfo;
}

interface DispatchProps {
  setSnackbar(snackbar: Partial<SnackbarInfo>): AnyAction;
}

interface DisplayProps {}

interface AlertProps extends StoreProps, DispatchProps, DisplayProps {}

const mapStateToProps = ({ snackbar }: BalanceStore): StoreProps => {
  return {
    snackbar,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setSnackbar: (snackbar) => dispatch(setSnackbarAction(snackbar)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
    materialAlert: {
      alignItems: 'center',
    },
  })
);

const Alert: React.FC<AlertProps> = ({
  snackbar: { open, message, color, autoHideDuration },
  setSnackbar,
}) => {
  const classes = useStyles({});
  return (
    <Snackbar
      className={classes.root}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={() => setSnackbar({ open: false })}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MaterialAlert
        className={classes.materialAlert}
        variant="filled"
        severity={color}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbar({ open: false })}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      >
        {message}
      </MaterialAlert>
    </Snackbar>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
