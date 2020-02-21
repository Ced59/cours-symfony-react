import React, { useState } from 'react';
import ReactDOM from "react-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter , Switch, Route, withRouter} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';


// localhost:8000/#/customers
// localhost:8000/#/invoices

require("../css/app.css");

AuthAPI.setup();


const App = () => {

    const NavbarWithRouter = withRouter(Navbar);

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    return (
    <HashRouter>

        <NavbarWithRouter isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated}/>

        <main className="container pt-5">

            <Switch>
                <Route path="/login" render={(props) => <LoginPage onLogin={setIsAuthenticated} {...props}/>} />
                <Route path="/customers" component={CustomersPage} />
                <Route path="/invoices" component={InvoicesPage} />
                <Route path="/" component={HomePage} />
            </Switch>

        </main>

    </HashRouter>);
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);