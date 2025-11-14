import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

/**
 * @function GET
 * @description Rota de API para buscar as perguntas e respostas do quiz no banco de dados.
 * @returns {Promise<NextResponse>} Uma Promise que resolve com as perguntas e respostas em formato JSON.
 */
export async function GET() {
  try {
    // Busca todas as perguntas da tabela 'questions'
    const { rows: questions } = await sql`SELECT * FROM questions;`;

    // Busca todas as respostas da tabela 'answers'
    const { rows: answers } = await sql`SELECT * FROM answers;`;

    // Mapeia as respostas para suas respectivas perguntas
    const questionsWithAnswers = questions.map((question) => ({
      ...question,
      answers: answers.filter((answer) => answer.question_id === question.id),
    }));

    // Retorna as perguntas com as respostas aninhadas
    return NextResponse.json(questionsWithAnswers);
  } catch (error) {
    // Loga o erro no console
    console.error(error);
    // Retorna uma resposta de erro com status 500
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}