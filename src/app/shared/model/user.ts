export interface UserInfo{
    address?: string;
    address_lat?: number;
    address_lon?: number;
    contactNo?: string;
    dateCreated?: string
    email: string;
    firstName?: string;
    lastName?: string;  
    profilePhoto?: string;
    userId?:string;

    password? :string;
}


export interface Creds {
    email?: string;
    password?: string;
}