import type { Knex } from "knex";
import { onUpdateTrigger } from "../src/utils/onUpdateTrigger";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("usuarios", function (table) {
      table.renameColumn("dateRequestValue", "date_request_value");
      table.timestamp("data_login");
      table.integer("ganhos_diarios").defaultTo(0);
    })
    .then(() => {
      knex.raw(onUpdateTrigger("usuarios"));
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("usuarios", function (table) {
    table.renameColumn("dateRequestValue", "date_request_value");
    table.timestamp("data_login");
    table.integer("ganhos_diarios").defaultTo(0);
  });
}
