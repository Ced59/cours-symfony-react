import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";


//Requête http authentification et stockage token
function authenticate(credentials)
{
    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            //on stocke le token dans le localstorage
            window.localStorage.setItem("authToken", token);

            //on met un header par défaut sur les future requêtes
            setAxiosToken(token);

            return true;
        })
}


// Déconnexion Suppression du token du localStorage et sur Axios
function logout()
{
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

//Permet de voir si on est authentifié ou pas
function isAuthenticated()
{
    const token = window.localStorage.getItem("authToken");

    // voir si token encore valide
    if (token)
    {
        const jwtData = jwtDecode(token);
        return jwtData.exp * 1000 > new Date().getTime();

    }
    return false;
}

//Positionne token sur Axios
function setAxiosToken(token)
{
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}


//Mise en place lors du chargement de l'appli
function setup()
{
    // voir si on a un token
    const token = window.localStorage.getItem("authToken");

    // voir si token encore valide
    if (token)
    {
        const jwtData = jwtDecode(token);
        if (jwtData.exp * 1000 > new Date().getTime())
        {
            // donner token a axios
            setAxiosToken(token);
        }
    }



}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}