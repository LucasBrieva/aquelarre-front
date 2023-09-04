import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenCookieKey = 'authToken';
    private idCookieKey = 'userId';

    setInformationAccess(token: string, _id: string) {
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + 7 * 60 * 60 * 1000); // 7 horas en milisegundos

        document.cookie = `${this.tokenCookieKey}=${token}; expires=${expirationTime.toUTCString()}; path=/;`;

        document.cookie = `${this.idCookieKey}=${_id}; expires=${expirationTime.toUTCString()}; path=/;`;
    }

    getToken() {
        debugger;
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(cookie => cookie.startsWith(`${this.tokenCookieKey}=`));
        return tokenCookie ? tokenCookie.split('=')[1] : '';
    }

    clearDataAccess() {
        // Clear cookies by setting their expiration to a past date
        document.cookie = `${this.tokenCookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${this.idCookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    getUserId() {
        const cookies = document.cookie.split('; ');
        const idCookie = cookies.find(cookie => cookie.startsWith(`${this.idCookieKey}=`));
        return idCookie ? idCookie.split('=')[1] : '';
    }
}
