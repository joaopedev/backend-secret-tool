import { knex } from "../connectDB";
import { UserModel } from "../models/model";
require("dotenv").config();

export class UserLogin {
  public static loginUser(email: string): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      knex("usuarios")
        .select("*")
        .where("email", email)
        .then((usuarios: string | any[]) => {
          if (usuarios.length > 0) {
            const usuario: UserModel = usuarios[0];
            resolve(usuario);
          } else {
            reject("Nenhum usuário encontrado");
          }
        })
        .catch((erro: any) => {
          reject(erro);
        });
    });
  }

  public static async createUser(email: string): Promise<UserModel> {
    try {
      const existingUser = await knex("usuarios")
        .where({ email: email })
        .first();
  
      if (existingUser) {
        throw new Error("Este email já está em uso");
      } else {
        const user: UserModel = { email, balance: 300 };
        await knex("usuarios").insert(user);
        return user;
      }
    } catch (error) {
      throw error;
    }
  }
}
