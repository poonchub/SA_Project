export interface PaymentInterface {
    ID?:            number;
    PaymentDate?:	string;
	PaymentMethod?:	string
	Amount?:		number;
	// Slip?:          

    CustomerID?:    number;
    OrderID?:       number;
}