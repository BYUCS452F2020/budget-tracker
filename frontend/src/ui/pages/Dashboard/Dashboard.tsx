import {
  Box,
  Container,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Action, AnyAction, Dispatch } from 'redux';
import {
  BalanceStore,
  setCategoriesAction,
  setExpensesAction,
  setIncomesAction,
} from '../../../redux/store';
import { usePrevious } from '../../../utils/hooks/usePrevious';
import BudgetDash from './BudgetDash/BudgetDash';
import './dashboard.scss';
import DashboardNav from './Nav/Nav';

// declare module 'material-table' {
//   export interface Column<RowData extends object> {
//     width: string | number | undefined;
//   }
// }

interface StoreProps {
  user: any;
  expenses: any[];
  incomes: any[];
  categories: any[];
}

interface DispatchProps {
  setExpenses(expenses: any[]): AnyAction;
  setIncomes(incomes: any[]): AnyAction;
  setCategories(categories: any[]): AnyAction;
}

interface DisplayProps {}

interface DashboardProps extends StoreProps, DispatchProps, DisplayProps {}

const mapStateToProps = ({
  user,
  expenses,
  incomes,
  categories,
}: BalanceStore): StoreProps => {
  return {
    user,
    expenses,
    incomes,
    categories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setExpenses: (expenses) => dispatch(setExpensesAction(expenses)),
    setIncomes: (incomes) => dispatch(setIncomesAction(incomes)),
    setCategories: (categories) => dispatch(setCategoriesAction(categories)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {
      background: '#f5f7f8',
    },
    componentContainer: {
      width: 1000,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    positive: {
      color: theme.palette.success.main,
    },
    negative: {
      color: theme.palette.error.main,
    },
  })
);

interface UrlParams {
  componentName?: string;
}

const components: { [key: string]: JSX.Element } = {
  budget: <BudgetDash />,
  overview: <Box />,
  trends: <Box />,
  notes: <Box />,
  tips: <Box />,
  people: <Box />,
};

const Dashboard: React.FC<DashboardProps> = ({
  user,
  setExpenses,
  setIncomes,
  setCategories,
}) => {
  const classes = useStyles({});
  const { componentName = 'budget' } = useParams<UrlParams>();
  const component = components[componentName] ?? components.budget;
  const prevUser = usePrevious(user);
  if (!prevUser && user) {
    axios
      .get(`http://localhost:3001/users/${user.user_id}/expenses`)
      .then((res) => setExpenses(res.data));
    axios
      .get(`http://localhost:3001/users/${user.user_id}/incomes`)
      .then((res) => setIncomes(res.data));

    axios
      .get(`http://localhost:3001/users/${user.user_id}/categories`)
      .then((res) => setCategories(res.data));
  }

  const funds = user?.unallocated_funds ?? 0;
  return (
    <Box display="flex" className={classes.root} minHeight="100vh">
      <DashboardNav selectedComponentName={componentName} />
      <Box className={classes.content}>
        <Container className={classes.componentContainer}>
          <Typography variant="h4">
            Money to budget:{' '}
            <span
              className={
                funds > 0 ? classes.positive : funds < 0 ? classes.negative : ''
              }
            >
              ${funds}
            </span>
          </Typography>
          {component}
        </Container>
      </Box>
    </Box>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
