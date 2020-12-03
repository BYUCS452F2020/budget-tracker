import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { BalanceStore } from '../../../../../redux/store';
import Group from './Group/Group';

interface StoreProps {
  categories: any[];
}

interface DispatchProps {}

interface DisplayProps {}

interface PlanProps extends StoreProps, DispatchProps, Partial<DisplayProps> {}

const mapStateToProps = ({ categories }: BalanceStore): StoreProps => {
  return {
    categories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
  })
);

const Plan: React.FC<PlanProps> = ({ categories }) => {
  useStyles({});
  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Group categories={categories} />
      </Grid>
    </Grid>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
