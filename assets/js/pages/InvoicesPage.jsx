import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import moment from "moment";

import InvoicesAPI from "../services/invoicesAPI";
import AuthContext from "../contexts/AuthContext";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};


const InvoicesPage = (props) => {


    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);



    // Récupération invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Erreur lors du chargement des factures !");
        }
    };

    //Charger les invoices au chargement du composant
    useEffect(() => {
            fetchInvoices().then(r => "");
        }, []
    );

    // Gestion du changement de page
    const handleChangePage = (page) => setCurrentPage(page);


    // Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //Gestion suppression
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
            toast.success("Suppression de la facture n°" + id + " réussie!");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            setInvoices(originalInvoices);
        }
    };


    const itemsPerPage = 20;

    // Filtrage des Invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes((search.toLowerCase()))
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);


    //Gestion Format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');


    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
            </div>


            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"
                       placeholder="Rechercher..."/>
            </div>

            <table className="table table-hover table-striped">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Montant</th>
                    <th>Statut</th>

                    <th></th>
                </tr>
                </thead>
                {!loading &&  <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <Link to={"/customers/" + invoice.customer.id}>
                                {invoice.customer.firstName} {invoice.customer.lastName}
                            </Link>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                        <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                            {STATUS_LABELS[invoice.status]}
                        </span>
                        </td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">
                                Modifier
                            </Link>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(invoice.id)}
                            >
                                Suppprimer
                            </button>
                        </td>
                    </tr>
                )}

                </tbody>}
            </table>

            {loading && <TableLoader/>}

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChanged={handleChangePage}
                length={filteredInvoices.length}
            />
        </>
    );
};

export default InvoicesPage;