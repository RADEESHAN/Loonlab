export interface User {
  _id: string;
  username: string;
  email: string;
  favorites: number[];
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;  login: (credentials: LoginCredentials) => Promise<User>;
  register: (credentials: RegisterCredentials) => Promise<User>;
  logout: () => void;
  clearError: () => void;
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
}
