import React, {useContext, useState} from "react";
import axios from "axios";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";


const LoginPage = ({history}) => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const {setIsAuthenticated} = useContext(AuthContext);

    const [error, setError] = useState("");


    // Gestion des champs
    const handleChange = e => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;

        setCredentials({...credentials, [name]: value})
    };

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {

            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("Vous êtes connnécté en tant que " + credentials.username  + "!");
            history.replace("/customers");

        } catch (error) {
            setError("Les informations de login/mot de passe sont incorrectes");
            toast.error("Une erreur est survenue");
        }
    };


    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>

                <Field
                    label="Adresse Email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse mail de connexion"
                    type="email"
                    name="username"
                    error={error}
                />

                <Field
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    name="password"
                />

                <div className="form-group">
                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Connexion
                    </button>
                </div>
            </form>

        </>
    );
};


export default LoginPage;