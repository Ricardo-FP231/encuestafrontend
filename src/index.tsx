import ReactDOM from 'react-dom/client';
import './index.scss';
import 'react-confirm-alert/src/react-confirm-alert.css'
import App from './App';
import axios from "axios"

axios.defaults.headers.common['Accept-Language'] = 'es'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <App/>
);
