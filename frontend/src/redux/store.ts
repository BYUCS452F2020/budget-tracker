import { Color as SnackbarColor } from '@material-ui/lab/Alert';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Reducer,
} from 'redux';
import thunk from 'redux-thunk';

export const setSnackbarAction = (
  snackbar: Partial<SnackbarInfo>
): AnyAction => {
  return {
    type: 'SET_SNACKBAR',
    snackbar,
  };
};

export const setUserAction = (user: any): AnyAction => {
  return {
    type: 'SET_USER',
    user,
  };
};

export const setExpensesAction = (expenses: any[]): AnyAction => {
  return {
    type: 'SET_EXPENSES',
    expenses,
  };
};

export const setIncomesAction = (incomes: any[]): AnyAction => {
  return {
    type: 'SET_INCOMES',
    incomes,
  };
};

export const setCategoriesAction = (categories: any[]): AnyAction => {
  return {
    type: 'SET_CATEGORIES',
    categories,
  };
};

export interface SnackbarInfo {
  open: boolean;
  message: string;
  color: SnackbarColor;
  autoHideDuration: number;
}

export interface BalanceStore {
  readonly snackbar: SnackbarInfo;
  readonly user: any | null;
  readonly categories: any[];
  readonly incomes: any[];
  readonly expenses: any[];
}

export const defaultStore: BalanceStore = {
  snackbar: {
    open: false,
    message: 'My default message',
    color: 'success',
    autoHideDuration: 5000,
  },
  user: null,
  categories: [],
  incomes: [],
  expenses: [],
};

export const user: Reducer<any | null> = (
  state: any | null = defaultStore.user,
  { type, user }: AnyAction
) => {
  switch (type) {
    case 'SET_USER':
      return user ?? state;
    default:
      return state;
  }
};

export const snackbar = (
  state: SnackbarInfo | undefined = defaultStore.snackbar,
  { type, snackbar }: AnyAction
) => {
  switch (type) {
    case 'SET_SNACKBAR':
      return Object.assign({}, state, snackbar);
    default:
      return state;
  }
};

export const expenses = (
  state: any[] = defaultStore.expenses,
  { type, expenses }: AnyAction
) => {
  switch (type) {
    case 'SET_EXPENSES':
      return expenses;
    default:
      return state;
  }
};

export const incomes = (
  state: any[] = defaultStore.incomes,
  { type, incomes }: AnyAction
) => {
  switch (type) {
    case 'SET_INCOMES':
      return incomes;
    default:
      return state;
  }
};

export const categories = (
  state: any[] = defaultStore.categories,
  { type, categories }: AnyAction
) => {
  switch (type) {
    case 'SET_CATEGORIES':
      return categories;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  user,
  snackbar,
  expenses,
  incomes,
  categories,
});

export const store = createStore(
  rootReducer,
  defaultStore,
  compose(applyMiddleware(thunk))
);
