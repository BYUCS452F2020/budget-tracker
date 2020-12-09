import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Axios from 'axios';
import MaterialTable from 'material-table';
import React from 'react';
import { connect } from 'react-redux';
import { Action, AnyAction, Dispatch } from 'redux';
import {
  BalanceStore,
  setCategoriesAction,
  setUserAction,
} from '../../../../../redux/store';
import { tableIcons } from '../../../../../utils/table-icons';

interface StoreProps {
  user: any;
  categories: any[];
}

interface DispatchProps {
  setCategories(categories: any[]): AnyAction;
  setUser(user: any): AnyAction;
}

interface DisplayProps {}

interface PlanProps extends StoreProps, DispatchProps, Partial<DisplayProps> {}

const mapStateToProps = ({ user, categories }: BalanceStore): StoreProps => {
  return {
    user,
    categories,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {
    setCategories: (categories) => dispatch(setCategoriesAction(categories)),
    setUser: (u) => dispatch(setUserAction(u)),
  };
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
  })
);

const Plan: React.FC<PlanProps> = ({
  user,
  categories,
  setCategories,
  setUser,
}) => {
  useStyles({});

  return (
    <MaterialTable
      title="Plan Budget"
      icons={tableIcons}
      components={{}}
      localization={{
        header: {
          actions: '',
        },
      }}
      editable={{
        isEditable: () => true,
        isDeletable: () => false,
        onRowAdd: async (c) => {
          const res = await Axios.post(
            `http://localhost:3001/users/${user?.user_id ?? ''}/categories`,
            {
              category_name: c.category_name,
              amount: c.amount ?? 0,
              monthly_default: null,
            }
          );
          const newCategory = res.data;
          setCategories([...categories, newCategory]);
          const ures = await Axios.get(
            `http://localhost:3001/users/${
              user?.user_id ?? localStorage.getItem('user-id')
            }`
          );
          setUser(ures.data);
        },
        onRowUpdate: async (c) => {
          const res = await Axios.put(
            `http://localhost:3001/users/${user?.user_id ?? ''}/categories/${
              c.category_id
            }`,
            {
              category_id: c.category_id,
              category_name: c.category_name,
              amount: c.amount,
              monthly_default: c.monthly_default,
            }
          );
          const newCategory = res.data;
          const updatedCategories = [...categories];
          const idx = updatedCategories.findIndex(
            (cat) => cat.category_id === c.category_id
          );
          updatedCategories[idx] = newCategory;
          setCategories(updatedCategories);
          const ures = await Axios.get(
            `http://localhost:3001/users/${
              user?.user_id ?? localStorage.getItem('user-id')
            }`
          );
          setUser(ures.data);
        },
      }}
      columns={[
        {
          title: 'Category',
          field: 'category_name',
          type: 'string',
          width: '50%',
          editable: 'always',
        },
        {
          title: 'Amount Remaining',
          field: 'amount',
          type: 'currency',
          width: '50%',
          editable: 'onUpdate',
        },
      ]}
      data={categories}
      options={{}}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Plan);
