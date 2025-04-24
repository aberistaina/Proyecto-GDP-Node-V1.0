import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux"
import store from "./store/store.js"
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <SnackbarProvider
                maxSnack={4}
                autoHideDuration={3000}>
            <App />
        </SnackbarProvider>
    </Provider>
  </StrictMode>
)
