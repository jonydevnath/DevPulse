export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer"; // If not submit default will be contributor
}
