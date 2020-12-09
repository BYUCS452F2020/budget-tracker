import { createStyles, makeStyles, Theme } from '@material-ui/core';
import axios from 'axios';
import MaterialTable from 'material-table';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction, Dispatch } from 'redux';
import {
  BalanceStore,
  setIncomesAction,
  setUserAction,
} from '../../../../../redux/store';
import { tableIcons } from '../../../../../utils/table-icons';

interface StoreProps {
  incomes: any[];
  user: any;
}

interface DispatchProps {
  setIncomes(incomes: any[]): AnyAction;
  setUser(u: any): AnyAction;
}

interface DisplayProps {}

interface IncomesTableProps
  extends StoreProps,
    DispatchProps,
    Partial<DisplayProps> {}

const mapStateToProps = ({ incomes, user }: BalanceStore): StoreProps => {
  return {
    incomes,
    user,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setIncomes: (incomes) => dispatch(setIncomesAction(incomes)),
    setUser: (u) => dispatch(setUserAction(u)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
  })
);

const IncomesTable: React.FC<IncomesTableProps> = ({
  incomes,
  user,
  setIncomes,
  setUser,
}) => {
  useStyles({});
  return (
    <MaterialTable
      title="Income"
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
        onRowAdd: async (i) => {
          const { summary, amount, income_date } = i;

          const res = await axios.post(
            `http://localhost:3001/users/${user.user_id}/incomes`,
            {
              summary,
              amount,
              income_date: new Date(
                income_date - income_date.getTimezoneOffset() * 60000
              ),
            }
          );
          const newIncome = res.data;
          setIncomes([...incomes, newIncome]);
          const ures = await axios.get(
            `http://localhost:3001/users/${
              user?.user_id ?? localStorage.getItem('user-id')
            }`
          );
          setUser(ures.data);
        },
        onRowUpdate: async (i) => {
          const { summary, amount, income_date, income_id } = i;
          const d = new Date(income_date);
          const res = await axios.put(
            `http://localhost:3001/users/${user.user_id}/incomes/${income_id}`,
            {
              income_id,
              summary,
              amount,
              income_date: new Date(
                d.getTime() - d.getTimezoneOffset() * 60000
              ),
            }
          );
          const newIncome = res.data;
          const updatedIncomes = [...incomes];
          const idx = updatedIncomes.findIndex(
            (e) => e.income_id === income_id
          );
          updatedIncomes[idx] = newIncome;
          setIncomes(updatedIncomes);
          const ures = await axios.get(
            `http://localhost:3001/users/${
              user?.user_id ?? localStorage.getItem('user-id')
            }`
          );
          setUser(ures.data);
        },
        onRowDelete: async (i) => {
          const { income_id } = i;
          await axios.delete(
            `http://localhost:3001/users/${user.user_id}/incomes/${income_id}`
          );
          setIncomes(incomes.filter((e) => e.income_id !== income_id));
          const ures = await axios.get(
            `http://localhost:3001/users/${
              user?.user_id ?? localStorage.getItem('user-id')
            }`
          );
          setUser(ures.data);
        },
      }}
      columns={[
        {
          title: 'Date',
          field: 'income_date',
          type: 'date',
          width: '25%',
          customFilterAndSearch: (filter, rowData, columnDef) => {
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
          title: 'Description',
          field: 'summary',
          width: '25%',
        },
      ]}
      data={incomes.sort((i0, i1) => i0.income_date - i1.income_date)}
      options={{}}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(IncomesTable);
