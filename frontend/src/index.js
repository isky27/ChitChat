import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ChatProvider from './components/Context/ChatProvider';
import InterceptorApi from './config/intercepter';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

InterceptorApi()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <ToastContainer
      data-testid="toast-container"
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <BrowserRouter>
      <Provider store={store}>
        <ChatProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </ChatProvider>
      </Provider>
    </BrowserRouter>
  </>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

