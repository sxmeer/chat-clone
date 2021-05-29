import { Route, Switch } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" component={Layout} />
      </Switch>
    </div>
  );
}

export default App;
