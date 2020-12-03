import { createStyles, makeStyles, Theme } from '@material-ui/core';
import axios from 'axios';
import MaterialTable from 'material-table';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction, Dispatch } from 'redux';
import { BalanceStore, setExpensesAction } from '../../../../../redux/store';
import { tableIcons } from '../../../../../utils/table-icons';

interface StoreProps {
  categories: any[];
  user: any;
  expenses: any[];
}

interface DispatchProps {
  setExpenses(expenses: any[]): AnyAction;
}

interface DisplayProps {}

interface ExpensesTableProps
  extends StoreProps,
    DispatchProps,
    Partial<DisplayProps> {}

const mapStateToProps = ({
  categories,
  expenses,
  user,
}: BalanceStore): StoreProps => {
  return {
    categories,
    expenses,
    user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setExpenses: (expenses) => dispatch(setExpensesAction(expenses)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
    editCell: {
      '& div': {
        width: 100,
      },
    },
  })
);

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  user,
  expenses,
  categories,
  setExpenses,
}) => {
  useStyles({});

  return (
    <MaterialTable
      title="Expenses"
      icons={tableIcons}
      components={{}}
      localization={{
        header: {
          actions: '',
        },
      }}
      editable={{
        isEditable: () => true,
        isDeletable: () => true,
        onRowAdd: async (e) => {
          const { category_id, summary, amount, expense_date } = e;
          const res = await axios.post(
            `http://localhost:3001/users/${user.user_id}/categories/${category_id}/expenses`,
            {
              category_id,
              summary,
              amount,
              expense_date: new Date(
                expense_date - expense_date.getTimezoneOffset() * 60000
              ),
            }
          );
          const newExpense = res.data;
          setExpenses([...expenses, newExpense]);
        },
        onRowUpdate: async (e) => {
          const { expense_id, category_id, summary, amount, expense_date } = e;
          const res = await axios.put(
            `http://localhost:3001/users/${user.user_id}/categories/${category_id}/expenses/${expense_id}`,
            {
              expense_id,
              category_id,
              summary,
              amount,
              expense_date: new Date(
                expense_date - expense_date.getTimezoneOffset() * 60000
              ),
            }
          );
          const newExpense = res.data;
          const updatedExpenses = [...expenses];
          const idx = updatedExpenses.findIndex(
            (e) => e.expense_id === expense_id
          );
          updatedExpenses[idx] = newExpense;
          setExpenses(updatedExpenses);
        },
        onRowDelete: async ({ expense_id, category_id }) => {
          await axios.delete(
            `http://localhost:3001/users/${user.user_id}/categories/${category_id}/expenses/${expense_id}`
          );
          setExpenses(expenses.filter((e) => e.expense_id !== expense_id));
        },
      }}
      columns={[
        {
          title: 'Date',
          field: 'expense_date',
          type: 'date',
          width: '25%',
          customFilterAndSearch: (filter, rowData) => {
            return moment(rowData.transaction_date)
              .format('M/D/YYYY')
              .includes(filter);
          },
        },
        {
          title: 'Amount',
          field: 'amount',
          type: 'currency',
          width: '25%',
          align: 'left',
        },
        {
          title: 'Category',
          field: 'category_id',
          lookup: categories.reduce((acc, cur) => {
            acc[cur.category_id] = cur.category_name;
            return acc;
          }, {}),
          width: '25%',
        },
        {
          title: 'Description',
          field: 'summary',
          width: '25%',
        },
      ]}
      data={expenses.sort(
        (e0, e1) =>
          new Date(e0.expense_date).getTime() -
          new Date(e1.expense_date).getTime()
      )}
      options={{}}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
