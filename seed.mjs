import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { createPool } from '@vercel/postgres';
import { questions } from './src/lib/placeholder-data.mjs';

const pool = createPool({
    connectionString: process.env.DATABASE_URL,
});

/**
 * @function seed
 * @description Popula o banco de dados com as perguntas e respostas do quiz.
 * - Deleta as tabelas 'answers' e 'questions' se elas já existirem.
 * - Cria as tabelas 'questions' e 'answers'.
 * - Insere os dados das perguntas e respostas a partir do arquivo placeholder-data.mjs.
 */
async function seed() {
  // Deleta a tabela 'answers' se ela existir
  await pool.sql`DROP TABLE IF EXISTS answers;`;
  // Deleta a tabela 'questions' se ela existir
  await pool.sql`DROP TABLE IF EXISTS questions;`;

  // Cria a tabela 'questions'
  await pool.sql`
    CREATE TABLE questions (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      emoji TEXT
    );
  `;

  // Cria a tabela 'answers' com uma chave estrangeira para a tabela 'questions'
  await pool.sql`
    CREATE TABLE answers (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES questions(id),
      text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL
    );
  `;

  // Insere as perguntas no banco de dados e depois insere as respostas correspondentes
  for (const question of questions) {
    const { rows: insertedQuestions } = await pool.sql`
      INSERT INTO questions (text, emoji) 
      VALUES (${question.text}, ${question.emoji})
      RETURNING id;
    `;
    const questionId = insertedQuestions[0].id;

    for (const answer of question.answers) {
      await pool.sql`
        INSERT INTO answers (question_id, text, is_correct)
        VALUES (${questionId}, ${answer.text}, ${answer.is_correct});
      `;
    }
  }
}

// Executa a função seed e trata possíveis erros
async function runSeed() {
  try {
    await seed();
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('An error occurred while seeding the database:', err);
  } finally {
    await pool.end();
    console.log('Database pool has been closed.');
  }
}

runSeed();