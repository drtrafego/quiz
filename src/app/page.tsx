"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";

/**
 * @interface Answer
 * @description Define a estrutura de um objeto de resposta.
 */
interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}

/**
 * @interface Question
 * @description Define a estrutura de um objeto de pergunta, incluindo um array de respostas.
 */
interface Question {
  id: number;
  text: string;
  emoji: string;
  answers: Answer[];
}

/**
 * @component Home
 * @description Componente principal que renderiza a página do quiz.
 * Gerencia o estado do quiz, busca as perguntas da API e lida com a interação do usuário.
 */
export default function Home() {
  // Estado para armazenar as perguntas do quiz
  const [questions, setQuestions] = useState<Question[]>([]);
  // Estado para rastrear o índice da pergunta atual
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Estado para armazenar a resposta selecionada pelo usuário
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  // Estado para a pontuação do usuário
  const [score, setScore] = useState(0);
  // Estado para controlar se o quiz foi finalizado
  const [quizFinished, setQuizFinished] = useState(false);

  /**
   * @function useEffect
   * @description Hook que busca as perguntas do quiz da API quando o componente é montado.
   */
  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  /**
   * @function handleAnswerSelect
   * @description Callback para lidar com a seleção de uma resposta pelo usuário.
   * @param {Answer} answer - O objeto da resposta selecionada.
   */
  const handleAnswerSelect = useCallback((answer: Answer) => {
    setSelectedAnswer(answer);
  }, []);

  /**
   * @function handleNextQuestion
   * @description Callback para processar a resposta e avançar para a próxima pergunta ou finalizar o quiz.
   */
  const handleNextQuestion = useCallback(() => {
    if (selectedAnswer) {
      // Incrementa a pontuação se a resposta estiver correta
      if (selectedAnswer.is_correct) {
        setScore((prev) => prev + 1);
      }

      const nextQuestionIndex = currentQuestionIndex + 1;
      // Verifica se ainda há perguntas restantes
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedAnswer(null); // Reseta a resposta selecionada
      } else {
        // Finaliza o quiz se não houver mais perguntas
        setQuizFinished(true);
      }
    }
  }, [currentQuestionIndex, questions.length, selectedAnswer]);

  /**
   * @function restartQuiz
   * @description Callback para reiniciar o quiz, resetando todos os estados.
   */
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }, []);

  // Renderiza a tela de finalização do quiz
  if (quizFinished) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Quiz Finalizado!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg mb-4">Sua pontuação final é: {score} de {questions.length}</p>
            <Button onClick={restartQuiz}>Reiniciar Quiz</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Renderiza uma mensagem de carregamento enquanto as perguntas são buscadas
  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Carregando quiz...</p>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Renderiza a pergunta atual e as opções de resposta
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Quiz sobre Jejum Intermitente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-lg">{currentQuestion.emoji} {currentQuestion.text}</p>
          </div>
          <div className="flex flex-col space-y-2">
            {currentQuestion.answers.map((answer) => (
              <Button
                key={answer.id}
                variant={selectedAnswer?.id === answer.id ? "default" : "outline"}
                onClick={() => handleAnswerSelect(answer)}
              >
                {answer.text}
              </Button>
            ))}
          </div>
          <Button className="w-full mt-4" onClick={handleNextQuestion} disabled={!selectedAnswer}>
            Responder
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}