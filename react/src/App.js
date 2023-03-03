import { useSelector } from 'react-redux';
import Auth from './pages/auth';
import MainFrame from './pages/MainFrame';
import '@/styles/App.scss';
import '@/styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const isAuthenticated = useSelector((state) => !state.auth.authPage);

  return isAuthenticated ? <MainFrame /> : <Auth />;
};

export default App;
