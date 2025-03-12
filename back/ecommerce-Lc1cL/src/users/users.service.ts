import { Injectable } from "@nestjs/common";
import { UserRepository } from "./users.repository";
import { User } from "../entities/users.entity";

@Injectable()
export class UsersService {
    constructor(private usersRepository: UserRepository){}

    async deleteUserById(id : string) {
        return await this.usersRepository.deleteById(id);
    }

    async updateUser(id : string, user: any){
        return await this.usersRepository.updateUser(id, user)
    }
    
    async getUsers(page : number, limit : number) {
        return await this.usersRepository.getUsers(page, limit);
    }

    async getUserById(id : string){
        return await this.usersRepository.getById(id);
    }

    async createUser(user: User){
        return await this.usersRepository.createUser(user);
    }
}