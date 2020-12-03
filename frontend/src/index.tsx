import { pink } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'typeface-roboto';
import App from './App';
import './index.scss';
import { store } from './redux/store';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#3CA7C8',
      main: '#0091BC',
      dark: '#007DA3',
      contrastText: '#ffffff',
    },
    secondary: pink,
  },
});

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById('root')
);

serviceWorker.unregister();
