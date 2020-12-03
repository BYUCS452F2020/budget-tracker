import {
  Box,
  createStyles,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Action, Dispatch } from 'redux';
import { BalanceStore } from '../../../../redux/store';
import ExpensesTable from './ExpensesTable/ExpensesTable';
import IncomesTable from './IncomesTable/IncomesTable';
import Plan from './Plan/Plan';

interface StoreProps {
  user: any | null;
}

interface DispatchProps {}

interface DisplayProps {}

interface BudgetDashProps
  extends StoreProps,
    DispatchProps,
    Partial<DisplayProps> {}

const mapStateToProps = ({ user }: BalanceStore): StoreProps => {
  return {
    user,
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

interface UrlParams {
  tab?: string;
}

const components: { [key: string]: JSX.Element } = {
  plan: <Plan />,
  expenses: <ExpensesTable />,
  income: <IncomesTable />,
};

const BudgetDash: React.FC<BudgetDashProps> = ({ user }) => {
  const componentKeys = Object.keys(components);
  const { tab = componentKeys[0] } = useParams<UrlParams>();

  useStyles({});
  return (
    <Box>
      <Tabs
        value={tab}
        indicatorColor="secondary"
        textColor="secondary"
        centered
      >
        {componentKeys.map((tabValue) => (
          <Tab
            value={tabValue}
            label={tabValue}
            key={tabValue}
            component={Link}
            to={`/dashboard/${user?.id ?? 0}/budget/${tabValue}`}
          />
        ))}
      </Tabs>
      {components[tab] ?? components.plan}
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(BudgetDash);
