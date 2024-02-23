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

  public static async sacarSaldo(
    email: string,
    valorSaque: number
  ): Promise<boolean> {
    try {
      const user = await knex("usuarios")
        .select("*")
        .where("email", email)
        .first();

      if (user) {
        if (user.balance >= valorSaque) {
          const novoSaldo = user.balance - valorSaque;

          await knex("usuarios")
            .where("email", email)
            .update({ balance: novoSaldo });

          return true;
        } else {
          console.error("Saldo insuficiente para o saque.");
          return false;
        }
      } else {
        console.error("Usuário não encontrado.");
        return false;
      }
    } catch (error) {
      console.error("Erro ao realizar o saque:", error);
      return false;
    }
  }

  public static async addBonusByEmail(
    email: string,
    bonusAmount: number,
    ganhos_diarios: number,
    date_login: Date
  ): Promise<boolean> {
    try {
      const user = await knex("usuarios")
        .select("*")
        .where("email", email)
        .first();

      if (user) {
        const newBalance = user.balance + bonusAmount;
        const dailygains = user.ganhos_diarios + ganhos_diarios;
        await knex("usuarios").where("id", user.id).update({
          balance: newBalance,
          ganhos_diarios: dailygains,
          data_login: date_login,
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao adicionar bônus:", error);
      return false;
    }
  }

  public static async clearUserData(email: string): Promise<boolean> {
    try {
      const user = await knex("usuarios")
        .select("*")
        .where("email", email)
        .first();

      if (user) {
        await knex("usuarios")
          .where("id", user.id)
          .update({ ganhos_diarios: 0, data_login: null });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erro ao limpar dados do usuário:", error);
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
