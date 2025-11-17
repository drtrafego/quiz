import { pgTable, serial, text, json, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name'),
  phone: text('phone'),
  answers: json('answers'),
  createdAt: timestamp('created_at').defaultNow(),
});