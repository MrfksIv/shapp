import { User } from "../../firebase";
export declare module auth {
    class Auth {
        private authStateChangedHandler;
        currentUser: User;
        onAuthStateChanged(handler: (user: User) => void): void;
        signOut(): Promise<any>;
        signInWithEmailAndPassword(email: string, password: string): Promise<any>;
        createUserWithEmailAndPassword(email: string, password: string): Promise<any>;
        signInAnonymously(): Promise<any>;
        fetchProvidersForEmail(email: string): Promise<any>;
    }
}
