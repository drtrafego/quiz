import { sql } from '@vercel/postgres';
import { questions } from './src/lib/placeholder-data.mjs';

/**
 * @function seed
 * @description Popula o banco de dados com as perguntas e respostas do quiz.
 * - Deleta as tabelas 'answers' e 'questions' se elas já existirem.
 * - Cria as tabelas 'questions' e 'answers'.
 * - Insere os dados das perguntas e respostas a partir do arquivo placeholder-data.mjs.
 */
async function seed() {
  // Deleta a tabela 'answers' se ela existir
  await sql`DROP TABLE IF EXISTS answers;`;
  // Deleta a tabela 'questions' se ela existir
  await sql`DROP TABLE IF EXISTS questions;`;

  // Cria a tabela 'questions'
  await sql`
    CREATE TABLE questions (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      emoji TEXT
    );
  `;

  // Cria a tabela 'answers' com uma chave estrangeira para a tabela 'questions'
  await sql`
    CREATE TABLE answers (
      id SERIAL PRIMARY KEY,
      question_id INTEGER REFERENCES questions(id),
      text TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL
    );
  `;

  // Insere as perguntas no banco de dados e depois insere as respostas correspondentes
  for (const question of questions) {
    const { rows: insertedQuestions } = await sql`
      INSERT INTO questions (text, emoji) 
      VALUES (${question.text}, ${question.emoji})
      RETURNING id;
    `;
    const questionId = insertedQuestions[0].id;

    for (const answer of question.answers) {
      await sql`
        INSERT INTO answers (question_id, text, is_correct)
        VALUES (${questionId}, ${answer.text}, ${answer.is_correct});
      `;
    }
  }

  console.log('Database seeded successfully!');
}

// Executa a função seed e trata possíveis erros
seed().catch((err) => {
  console.error('An error occurred while seeding the database:', err);
});