import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import customersAPI from "../services/customersAPI";
import {toast} from "react-toastify";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params;


    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);


    // Récupération du customer en fonction de l'id
    const fetchCustomer = async id => {
        try {

            //On extrait de data les données souhaitées
            const {firstName, lastName, email, company} = await customersAPI.find(id);

            setCustomer({firstName, lastName, email, company});
        }
        catch(error)
        {
            toast.error("Le client n'a pas pu être chargé!");

            history.replace('/customers');
        }
    };

    //vérifie si mode edition à chaque fois que id change et charge le customer si besoin
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id).then(r => "");
        }
    }, [id]);


    //Gestion des changements des input dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing)
            {
                await customersAPI.update(id, customer);
                toast.success("Le client a bien été modifié!");
            }
            else
            {
                await customersAPI.create(customer);
                toast.success("Le client a bien été créé !");

                history.replace("/customers");
            }

        } catch ({response}) {

            const {violations} = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Il y a des erreurs dans le formulaire !");
            }
        }

    };

    return (
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Edition d'un client</h1>}

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse mail du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;