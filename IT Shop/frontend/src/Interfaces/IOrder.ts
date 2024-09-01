export interface OrderInterface {
    ID?:        number;
    OrderDate?: string;
    TotalPrice: number;
    Status?:     string;

    CustomerID?:    number;
    AddressID?:     number;
}