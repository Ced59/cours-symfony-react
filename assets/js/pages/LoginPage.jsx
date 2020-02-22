import React, {useContext, useState} from "react";
import axios from "axios";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";


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
            history.replace("/customers");

        }catch(error)
        {
            setError("Les informations de login/mot de passe sont incorrectes");
        }
    };


    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">
                        Adresse mail
                    </label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="Adresse Email de connexion"
                        name="username"
                        id="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Mot de passe"
                        name="password"
                        className="form-control"
                        id="password"/>
                </div>
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