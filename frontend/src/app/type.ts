export interface User {
    id: number;
    name: string;
    username: string;
    password: string;
    level: string;
}

export interface Product {
    id: number;
    serial: string;
    release: string;
    name: string;
    color: string;
    price: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    remarks: string;
    status: string;
    sales: Sale[];
}

export interface Sale {
    id: number;
    status: string;
    price: number;
    payDate: Date;
    product: Product;
}

export interface Service {
    id: number;
    name: string;
    price: number;
    remarks?: string;
    payDate: Date;
}