import { StorageKeys } from "../Enums/enum";

export class LocalStorageTokenService {
    setToken(token: string): void {
        localStorage.setItem(StorageKeys.TOKEN, token);
    }

    // Retrieve token from localStorage
    getToken(): string | null {
        return localStorage.getItem(StorageKeys.TOKEN);
    }

    // Remove token from localStorage
    removeToken(): void {
        localStorage.removeItem(StorageKeys.TOKEN);
    }
}
