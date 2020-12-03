import {
  Box,
  ClickAwayListener,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import { BalanceStore } from '../../../../../../redux/store';
import { useBoolean } from '../../../../../../utils/hooks/useBoolean';
import { useInput } from '../../../../../../utils/hooks/useInput';
import { usePrevious } from '../../../../../../utils/hooks/usePrevious';

interface StoreProps {}

interface DispatchProps {}

interface DisplayProps {}

interface GroupProps extends StoreProps, DispatchProps, Partial<DisplayProps> {
  categories: any[];
}

const mapStateToProps = (_: BalanceStore): StoreProps => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => {
  return {};
};

const useStyles = makeStyles<Theme, DisplayProps>((theme) =>
  createStyles({
    root: {},
    group: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
    },
  })
);

interface CategoryProps {
  category: any;
}

const Category: React.FC<CategoryProps> = ({ category }) => {
  const [disabled, disabledActions] = useBoolean(true);
  const [editTitle, editTitleActions] = useInput(category.category_name);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevDisabled = usePrevious(disabled);

  useEffect(() => {
    if (prevDisabled && !disabled) {
      inputRef.current?.select();
    }
  });

  return (
    <ClickAwayListener onClickAway={disabledActions.setTrue}>
      <TextField
        margin="dense"
        variant="outlined"
        value={editTitle}
        inputRef={inputRef}
        disabled={disabled}
        onClick={disabledActions.setFalse}
        onChange={editTitleActions.onChange}
      />
    </ClickAwayListener>
  );
};

const Group: React.FC<GroupProps> = ({ categories }) => {
  const classes = useStyles({});
  return (
    <Paper>
      <Box className={classes.group}>
        <Grid container direction="column" spacing={1}>
          {categories.map((category) => {
            return (
              <Grid item key={category.category_id}>
                <Category category={category} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
