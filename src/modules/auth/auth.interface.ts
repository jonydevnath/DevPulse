export interface IUser {
    name: string;
    email: string;
    password: string;
    role?: "contributor" | "maintainer"; // if not submit default is contributor
}

