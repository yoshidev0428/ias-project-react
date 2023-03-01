import { useSelector } from 'react-redux';
import './App.scss';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './pages/auth';
import MainFrame from './pages/MainFrame';

const App = () => {
  const authValid = useSelector((state) => !state.auth.authPage);

  return authValid ? <Auth /> : <MainFrame />;
};

export default App;
