import { useSelector } from 'react-redux';
import './App.scss';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/auth';
import MainFrame from './pages/MainFrame';

const App = () => {
  const isAuthenticated = useSelector((state) => !state.auth.authPage);

  return isAuthenticated ? <MainFrame /> : <Auth />;
};

export default App;
