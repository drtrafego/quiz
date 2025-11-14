import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, answers } = body;

    // Validação simples dos dados recebidos
    if (!name || !email || !answers) {
      return NextResponse.json({ error: 'Faltam dados no formulário.' }, { status: 400 });
    }

    // Por enquanto, apenas logamos os dados no console.
    // Em um cenário real, aqui você salvaria os dados em um banco de dados.
    console.log('Lead Recebido:', { name, email, answers });

    return NextResponse.json({ message: 'Lead recebido com sucesso!' }, { status: 201 });
  } catch (error) {
    console.error('Erro ao processar o lead:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}