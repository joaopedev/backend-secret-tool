import { UserModel } from "../models/model";
import { knex } from "../connectDB";

export class Usuario {
  public static async getUsers(id?: string | undefined): Promise<UserModel[]> {
    let sql = knex("usuarios").select("*").orderBy("id");
    if (id) sql.where("id", id);
    return sql;
  }

  public static async getUserById(id: string): Promise<UserModel | null> {
    const user = await knex("usuarios").select("*").where("id", id).first();
    return user || null;
  }

  public static async addBonusByEmail(
    email: string,
    bonusAmount: number
  ): Promise<boolean> {
    try {
      const user = await knex("usuarios")
        .select("*")
        .where("email", email)
        .first();

      if (user) {
        const newBalance = user.balance + bonusAmount;

        await knex("usuarios")
          .where("id", user.id)
          .update({ balance: newBalance });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao adicionar bônus:", error);
      return false;
    }
  }

  public static async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await knex("usuarios")
      .select("*")
      .where("email", email)
      .first();
    return user || null;
  }

  public static async deleteUser(id_usuario: string): Promise<boolean> {
    const user = await knex("usuarios")
      .select("usuarios")
      .where("id", id_usuario)
      .delete();

    return user > 0;
  }
}
