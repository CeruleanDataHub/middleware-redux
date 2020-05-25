export class Auth0SessionProvider {
    getToken() { 
        return this.token 
    }
    
    setToken(token) { 
        this.token = token
    }
}
