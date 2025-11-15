'use client';

import { useState, useEffect } from 'react';
import { questions } from '../lib/placeholder-data.mjs';
import 'react-phone-number-input/style.css';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { getExampleNumber } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/core';
import examples from 'libphonenumber-js/mobile/examples';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '' });
  const [phone, setPhone] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state management from user's plan
  const [country, setCountry] = useState<CountryCode>('BR'); // fallback to BR
  const [placeholder, setPlaceholder] = useState<string>('');
  const [rawCountry, setRawCountry] = useState('');

  // 1) Effect to generate placeholder when country changes
  useEffect(() => {
    const example = getExampleNumber(country, examples);
    if (example) {
      setPlaceholder(example.formatNational());
    } else {
      setPlaceholder('');
    }
  }, [country]);

  // 2) Effect to fetch GeoIP, but only when the form is shown
  useEffect(() => {
    if (showLeadForm) {
      fetch('/api/geoip')
        .then((res) => res.json())
        .then((data) => {
          if (data.country) {
            setRawCountry(data.country);
            setCountry(data.country.toUpperCase() as CountryCode);
          }
        })
        .catch(() => {
          // Keep fallback 'BR' on error
        });
    }
  }, [showLeadForm]);

  const handleAnswer = (answerIndex: number) => {
    setUserAnswers([...userAnswers, answerIndex]);
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setIsQuizComplete(true);
      setShowLeadForm(true);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !isPossiblePhoneNumber(phone)) {
      alert('Por favor, insira um número de telefone válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...leadData, phone, answers: userAnswers }),
      });

      if (response.ok) {
        alert('Diagnóstico enviado! Verifique seu telefone para os próximos passos.');
      } else {
        alert('Ocorreu um erro ao enviar seus dados. Tente novamente.');
      }
    } catch (error) {
      console.error('Falha ao enviar o lead:', error);
      alert('Ocorreu um erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showLeadForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans">
        <div className="p-8 bg-gray-800/50 rounded-2xl shadow-2xl text-center w-full max-w-lg mx-4 border border-purple-700">
          <div className="text-white text-xs text-left bg-red-900 p-2 rounded mb-4">
            <p>DEBUG INFO:</p>
            <p>- Raw Country from Vercel: {rawCountry || 'Not found'}</p>
            <p>- Processed Country (Upper): {country}</p>
            <p>- Generated Placeholder: {placeholder || 'EMPTY'}</p>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-yellow-300">Estás a un paso de redescubrirte.</h2>
          <p className="mb-8 text-lg text-gray-300">Deja tu nombre y teléfono para recibir acceso a tu diagnóstico y al <span className="font-bold text-teal-400">Método Despertar Natural</span>.</p>
          <form onSubmit={handleLeadSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Tu nombre"
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
              required
              className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            />
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition">
              <PhoneInput
                international
                defaultCountry={country}
                value={phone}
                onChange={setPhone}
              />
              <p className="text-xs text-gray-400 mt-1 text-left">
                Exemplo: {placeholder || 'Digite seu telefone'}
              </p>
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl disabled:bg-gray-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'QUIERO MI DIAGNÓSTICO'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-lg text-gray-400">Cargando tu viaje...</p>
        </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6 shadow-inner">
          <div className="bg-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-gray-800/50 rounded-2xl shadow-2xl overflow-hidden border border-purple-700">
          {currentQuestion.image_url && (
            <div className="w-full flex justify-center items-center overflow-hidden my-4">
              <img
                  src={currentQuestion.image_url}
                  alt="Imagen que representa la pregunta del cuestionario"
                  width="500"
                  height="288"
                  className="rounded-lg"
              />
            </div>
          )}
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-bold mb-4 text-white text-center">{currentQuestion.text}</h2>
            {currentQuestion.subtitle && (
              <p className="text-lg text-gray-300 mb-8 text-center">{currentQuestion.subtitle}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="bg-gray-800 hover:bg-gray-700 border-2 border-teal-500 text-teal-300 font-semibold py-4 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Jornada Despertar Natural</p>
        </footer>
      </div>
    </div>
  );
}