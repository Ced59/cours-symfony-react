import React from 'react';

const CustomersPage = (props) => {
    return (
        <>
            <h1>
                Liste des clients
            </h1>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Factures</th>
                    <th>Montant total</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>18</td>
                    <td><a href="#">Ced Caudron</a></td>
                    <td>c.caudron59@gmail.com</td>
                    <td>Ced Inc</td>
                    <td>4</td>
                    <td>54215,00 €</td>
                    <td>
                        <button className="btn btn-sm btn-danger">Supprimer</button></td>
                </tr>
                </tbody>
            </table>
        </>
    );
};

export default CustomersPage;