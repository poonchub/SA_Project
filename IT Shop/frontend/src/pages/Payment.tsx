import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import OrderShow from "../components/OrderShow/OrderShow";
import AddressShow from "../components/AddressShow/AddressShow";
import AmountPrice from "../components/AmountPrice/AmountPrice";
import OrderTableList from "../components/OrderTableList/OrderTableList";
import "../stylesheet/page.css";
import "../stylesheet/table.css";
import { GetOrderByID } from "../services/http";

function Payment() {
    const customerID = localStorage.getItem('id');
    const orderId = localStorage.getItem('orderId');

    // Parse customerID and orderId to numbers
    const parsedCustomerID = customerID ? Number(customerID) : null;
    const parsedOrderId = orderId ? Number(orderId) : null;

    console.log("Customer ID:", parsedCustomerID);
    console.log("Order ID:", parsedOrderId);

    return (
        <>
            <div className="mylayout">
                <Header page={"Payment"} />
                
                {parsedOrderId !== null && (
                    <>
                        <OrderShow orderId={parsedOrderId} />
                        <AddressShow orderId={parsedOrderId} />
                    </>
                )}
                
                {/* Ensure orderId is passed only if it is a number */}
                {parsedCustomerID !== null && parsedOrderId !== null && (
                    <AmountPrice customerId={parsedCustomerID} orderId={parsedOrderId} />
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

export default Payment;
