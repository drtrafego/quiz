/**
 * @constant questions
 * @description Um array de objetos que representa os dados do quiz.
 * Cada objeto de pergunta contém o texto da pergunta, um emoji associado e um array de respostas.
 * Cada objeto de resposta contém o texto da resposta e um booleano indicando se é a resposta correta.
 */
export const questions = [
  {
    text: 'O que é jejum intermitente?',
    emoji: '🤔',
    answers: [
      { text: 'Um tipo de dieta onde você só come sobremesas.', is_correct: false },
      { text: 'Um padrão alimentar que alterna entre períodos de jejum e alimentação.', is_correct: true },
      { text: 'Um jejum de 24 horas uma vez por mês.', is_correct: false },
      { text: 'Comer apenas alimentos líquidos.', is_correct: false },
    ],
  },
  {
    text: 'Qual destes é um método popular de jejum intermitente?',
    emoji: ' popular',
    answers: [
      { text: 'O método 16/8.', is_correct: true },
      { text: 'A dieta do sorvete.', is_correct: false },
      { text: 'Comer a cada 2 horas.', is_correct: false },
      { text: 'A dieta da sopa de repolho.', is_correct: false },
    ],
  },
  {
    text: 'Quais são os potenciais benefícios do jejum intermitente?',
    emoji: '💪',
    answers: [
      { text: 'Perda de peso e melhora da sensibilidade à insulina.', is_correct: true },
      { text: 'Ganho de peso rápido.', is_correct: false },
      { text: 'Aumento dos níveis de açúcar no sangue.', is_correct: false },
      { text: 'Redução da energia.', is_correct: false },
    ],
  },
    {
    text: 'Durante o período de jejum no método 16/8, o que é geralmente permitido consumir?',
    emoji: '💧',
    answers: [
      { text: 'Qualquer tipo de comida em pequenas porções.', is_correct: false },
      { text: 'Apenas shakes de proteína.', is_correct: false },
      { text: 'Água, café e chá sem açúcar.', is_correct: true },
      { text: 'Sucos de frutas e refrigerantes diet.', is_correct: false },
    ],
  },
  {
    text: 'O jejum intermitente é recomendado para todos?',
    emoji: '👨‍⚕️',
    answers: [
      { text: 'Sim, é seguro e eficaz para qualquer pessoa.', is_correct: false },
      { text: 'Não, pessoas com certas condições médicas ou grávidas devem evitá-lo.', is_correct: true },
      { text: 'Sim, mas apenas para atletas de alta performance.', is_correct: false },
      { text: 'Apenas para pessoas que querem ganhar massa muscular.', is_correct: false },
    ],
  },
];