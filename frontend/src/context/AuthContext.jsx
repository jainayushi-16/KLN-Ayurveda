"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("Please sign in to continue shopping.");
    const [pendingAction, setPendingAction] = useState(null);
    // Restore session from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("kln_user");
        const savedToken = localStorage.getItem("kln_token");
        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            }
            catch (e) {
                localStorage.removeItem("kln_user");
                localStorage.removeItem("kln_token");
            }
        }
    }, []);
    const openAuthModal = (message, action) => {
        if (message)
            setModalMessage(message);
        if (action)
            setPendingAction(() => action);
        setIsAuthModalOpen(true);
    };
    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem("kln_user", JSON.stringify(userData));
        localStorage.setItem("kln_token", authToken);
        setIsAuthModalOpen(false);
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };
    const register = (userData, authToken) => {
        login(userData, authToken);
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("kln_user");
        localStorage.removeItem("kln_token");
    };
    const executePendingAction = () => {
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };
    return (<AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isAuthModalOpen,
            modalMessage,
            openAuthModal,
            closeAuthModal,
            login,
            register,
            logout,
            pendingAction,
            executePendingAction,
        }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
