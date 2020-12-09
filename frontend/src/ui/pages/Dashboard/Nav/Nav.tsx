import {
  Box,
  Button,
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import {
  AccountBalance,
  AccountBalanceWallet,
  EmojiObjects,
  Note,
  People,
  PieChart,
  TrendingUp,
} from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Action, Dispatch } from 'redux';
import { BalanceStore } from '../../../../redux/store';

interface StoreProps {
  user: any;
}

interface DispatchProps {}

interface DisplayProps {
  width: number;
}

interface DashboardNavProps
  extends StoreProps,
    DispatchProps,
    Partial<DisplayProps> {
  selectedComponentName: string;
}

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
    logo: {
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    logoIcon: {
      marginRight: theme.spacing(1),
    },
    drawer: {
      width: (props) => props.width,
      flexShrink: 0,
      position: 'relative',
    },
    logoutButton: {
      bottom: 20,
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    drawerPaper: {
      width: (props) => props.width,
    },
  })
);

const DashboardNav: React.FC<DashboardNavProps> = ({
  user,
  selectedComponentName,
  width = 240,
}) => {
  const classes = useStyles({ width });
  const history = useHistory();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <Box className={classes.logo} display="flex">
        <AccountBalance
          className={classes.logoIcon}
          color="primary"
          style={{ fontSize: 40 }}
        />
        <Typography color="primary" variant="h4">
          Balance
        </Typography>
      </Box>
      <Divider />
      <List>
        {[
          {
            label: 'Budget',
            componentName: 'budget',
            Icon: AccountBalanceWallet,
          },
          {
            label: 'Overview',
            componentName: 'overview',
            Icon: PieChart,
          },
          {
            label: 'Trends',
            componentName: 'trends',
            Icon: TrendingUp,
          },
          {
            label: 'Notes',
            componentName: 'notes',
            Icon: Note,
          },
          {
            label: 'Tips',
            componentName: 'tips',
            Icon: EmojiObjects,
          },
          {
            label: 'People',
            componentName: 'people',
            Icon: People,
          },
        ].map(({ label, componentName, Icon }, index) => (
          <ListItem
            button
            key={label}
            selected={selectedComponentName === componentName}
            component={RouterLink}
            to={`/dashboard/${user?.user_id ?? 0}/${componentName}`}
          >
            <ListItemIcon>
              {
                <Icon
                  color={
                    selectedComponentName === componentName
                      ? 'primary'
                      : 'inherit'
                  }
                />
              }
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
      <Button
        color="secondary"
        className={classes.logoutButton}
        onClick={() => {
          history.push('/login');
        }}
      >
        Logout
      </Button>
    </Drawer>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNav);
