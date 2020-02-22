import React, {useContext, useState} from 'react';
import ReactDOM from "react-dom";

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter, Switch, Route, withRouter, Redirect} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";
import AuthContext from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';


// localhost:8000/#/customers
// localhost:8000/#/invoices

require("../css/app.css");

AuthAPI.setup();




const App = () => {

    const NavbarWithRouter = withRouter(Navbar);

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

    const contextValue = {
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated
    };

    return (
        <AuthContext.Provider value={contextValue}>

            <HashRouter>

                <NavbarWithRouter/>

                <main className="container pt-5">

                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/register" component={RegisterPage}/>

                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                        <PrivateRoute path="/invoices/:id" component={InvoicePage}/>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>



                        <Route path="/" component={HomePage}/>
                    </Switch>

                </main>

            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);