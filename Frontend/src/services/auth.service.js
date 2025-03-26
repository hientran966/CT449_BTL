import createApiClient from "./api.service";

class AuthService {
    constructor(baseUrl = "/api/account") {
        this.api = createApiClient(baseUrl);
    }

    async login(TenDangNhap, Password) {
        return (await this.api.post("/login", { TenDangNhap, Password })).data;
    }

    async createAccount(data) {
        return (await this.api.post("/", data)).data;
    }

    async getAccountById(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async updateAccount(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteAccount(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async getAllAccounts() {
        return (await this.api.get("/")).data;
    }

    async logout() {
        return (await this.api.post("/logout")).data;
    }

    async getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
    
}

export default new AuthService();
