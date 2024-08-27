export interface OrderInterface {
    ID?:        number;
    OrderDate?: string;
    TotalPrice: number;
    Satus?:     string;

    CustomerID?:    number;
    AddressID?:     number;
}