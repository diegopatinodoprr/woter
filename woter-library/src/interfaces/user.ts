export interface IUser {
  id: string;
  email: string;
  name?: string;
  favoriteCities?: string[];
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
