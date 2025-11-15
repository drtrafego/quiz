import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // No futuro, isso pode ser salvo em um banco de dados ou enviado para um CRM.
    console.log('Lead recebido:', body);

    return NextResponse.json({ message: 'Lead recebido com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar o lead:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}