import { useState, useEffect, useContext } from "react";
import Header from "../components/Header/Header";
import OrderShow from "../components/OrderShow/OrderShow";
import AddressShow from "../components/AddressShow/AddressShow";
import AmountPriceEdit from '../components/AmountPrice/AmountPriceEdit';
import OrderTableList from "../components/OrderTableList/OrderTableList";
import "../stylesheet/pagePayment.css";
import "../stylesheet/table.css";
import { AppContext } from "../App";

function PaymentEdit() {
    const customerID = localStorage.getItem('id');
    const orderId = localStorage.getItem('orderId');
    const {logoutPopup} = useContext(AppContext)

    // Parse customerID and orderId to numbers
    const parsedCustomerID = customerID ? Number(customerID) : null;
    const parsedOrderId = orderId ? Number(orderId) : null;

    console.log("Customer ID:", parsedCustomerID);
    console.log("Order ID:", parsedOrderId);

    return (
        <>
            <div className="mylayoutP">
                {logoutPopup}
                <Header page={"paymentEdit"} />
                
                {parsedOrderId !== null && (
                    <>
                        <OrderShow orderId={parsedOrderId} />
                        <AddressShow orderId={parsedOrderId} />
                    </>
                )}
                
                {/* Ensure orderId is passed only if it is a number */}
                {parsedCustomerID !== null && parsedOrderId !== null && (
                    <AmountPriceEdit customerId={parsedCustomerID} orderId={parsedOrderId} />
                )}
                
                {/* Conditionally render OrderTableList only if parsedOrderId is not null */}
                {parsedOrderId !== null && (
                    <div>
                        <OrderTableList orderId={parsedOrderId} />
                    </div>
                )}
            </div>
        </>
    );
}

export default PaymentEdit;
