import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { BalanceStore } from '../../redux/store';

interface StoreProps {}

interface DispatchProps {}

interface DisplayProps {}

interface TemplateProps
  extends StoreProps,
    DispatchProps,
    Partial<DisplayProps> {}

const mapStateToProps = (_: BalanceStore): StoreProps => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
  })
);

const Template: React.FC<TemplateProps> = (props) => {
  useStyles({});
  return <div />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Template);
