import React from 'react';
import CreateCustomerForm from './components/CreateCustomerForm';
import CheckoutForm from './components/CheckoutForm';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.css';

const stripePromise = loadStripe('pk_test_51HH2x4Gev2lIfPl9rFRMoDJnwl7t0EsQ4OFlUhEfGWm5eAZvvPO7Wey5TXu4n9Gj995RkoFakgoKFxpZxN8AAqP600LUryGwZP');

const App = () => (
  <Elements stripe={stripePromise}>
    <div className="App">
      <Router>
        <Switch>
          <Route path="/checkout">
            <CheckoutForm />
          </Route>
          <Route path="/">
            <CreateCustomerForm />
          </Route>
        </Switch>
      </Router>
    </div>
  </Elements >
);


export default App;
