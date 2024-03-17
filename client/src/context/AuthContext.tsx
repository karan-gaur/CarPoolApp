import React, { createContext, useEffect, useReducer } from "react";

export interface AuthContextProps {
  user: null | { id: number; name: string }; // Adjust the user type accordingly
  token: string;
  isAuthenticated: boolean;
  dispatch: React.Dispatch<AuthAction>;
}

export type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: any; token: string } } // Adjust the payload type accordingly
  | { type: "LOGOUT" };

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const initialState: AuthContextProps = {
  user: null,
  token: "",
  isAuthenticated: false,
  dispatch: () => {}, // Provide a default dispatch function
};

const authReducer = (state: AuthContextProps, action: AuthAction): AuthContextProps => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: "",
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

