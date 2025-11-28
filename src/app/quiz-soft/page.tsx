'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { questions } from '../../lib/placeholder-data.mjs';
import 'react-phone-number-input/style.css';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input';
import { getExampleNumber } from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js/core';
import examples from 'libphonenumber-js/mobile/examples';

// Helper function to push to dataLayer
const pushToDataLayer = (event: string, data: object = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event, ...data });
  }
};

export default function QuizSoftPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [leadData, setLeadData] = useState({ name: '' });
  const [phone, setPhone] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferPage, setShowOfferPage] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  const [country, setCountry] = useState<CountryCode>('BR'); // fallback to BR
  const [placeholder, setPlaceholder] = useState<string>('');
  const [rawCountry, setRawCountry] = useState(''); // Raw country from Vercel

  useEffect(() => {
    const example = getExampleNumber(country, examples);
    if (example) {
      setPlaceholder(example.formatNational());
    } else {
      setPlaceholder('');
    }
  }, [country]);

  useEffect(() => {
    if (showForm) {
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
  }, [showForm]);

  useEffect(() => {
    if (currentQuestionIndex === 0) {
      pushToDataLayer('quiz_question_1');
    }

    if (currentQuestionIndex === 5) {
      pushToDataLayer('quiz_question_6');
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (answerIndex: number) => {
    setUserAnswers([...userAnswers, answerIndex]);
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      const nextQuestionData = questions[nextQuestion];
      if (nextQuestionData.isTestimonial) {
        // Mostra a página de testemunho e avança para a próxima pergunta real depois
        setCurrentQuestionIndex(nextQuestion);
        setTimeout(() => {
          setUserAnswers([...userAnswers, -1]); // Adiciona uma resposta "dummy" para o testemunho
          setCurrentQuestionIndex(nextQuestion + 1);
        }, 5000); // Mostra o testemunho por 5 segundos
      } else {
        setCurrentQuestionIndex(nextQuestion);
      }
    } else {
      setIsQuizComplete(true);
      setShowDiagnosis(true);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !isPossiblePhoneNumber(phone)) {
      alert('Por favor, insira um número de telefone válido.');
      return;
    }

    setIsSubmitting(true);

    // Redireciona para o checkout da Hotmart imediatamente
    window.location.href = 'https://pay.hotmart.com/A102891357R?checkoutMode=10';

    // Envia os dados do lead em segundo plano, sem esperar pela resposta
    fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...leadData, phone, answers: userAnswers }),
    }).catch(error => {
      // Apenas loga o erro no console, pois o usuário já foi redirecionado
      console.error('Falha ao enviar o lead em segundo plano:', error);
    });
  };


  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-[#FFD6FF]/30 text-gray-900">
        <div className="p-6 md:p-8 bg-white/80 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-auto border border-purple-300">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-purple-800 leading-tight">Descubre cuántos centímetros podrías reducir de tu cintura sin dietas extremas.</h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8">Tu diagnóstico empieza ahora. Solo necesitas 2 minutos.</p>
          <div className="w-full flex justify-center mb-6 md:mb-8">
            <Image
              src={"/Imagem-pag-1.png"}
              alt="Imagen de introducción al cuestionario"
              width={500}
              height={288}
              className="rounded-lg shadow-md w-full h-auto max-w-[500px]"
              priority
            />
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 md:px-10 rounded-lg text-xl md:text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-600/30"
          >
            INICIAR TEST
          </button>
        </div>
      </div>
    );
  }

  if (showDiagnosis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-[#FFD6FF]/30 text-gray-900">
        <div className="p-6 md:p-8 bg-white/80 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-auto border border-purple-300">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-800">✨ Tu resultado está listo.</h2>
          <p className="text-lg md:text-xl text-gray-700">Tu cuerpo te está pidiendo una pausa consciente.</p>
          <div className="w-full flex justify-center my-6 md:my-8">
            <Image
              src={"/Imagem-pag-13.png"}
              alt="Imagen del diagnóstico"
              width={500}
              height={288}
              className="rounded-lg shadow-md w-full h-auto max-w-[500px]"
              priority
            />
          </div>
          <div className="text-left max-w-lg mx-auto">
            <p className="text-lg text-gray-700 mb-4">Según tus respuestas, tu cuerpo muestra señales de:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center"><span className="text-red-500 mr-2">●</span> Inflamación interna</li>
              <li className="flex items-center"><span className="text-red-500 mr-2">●</span> Cansancio metabólico</li>
              <li className="flex items-center"><span className="text-red-500 mr-2">●</span> Ritmo hormonal desbalanceado</li>
            </ul>
            <p className="text-lg text-gray-700 mb-6">Esto explica por qué bajar de peso se te ha hecho tan difícil… y por qué no ves cambios aunque hagas “todo bien”.</p>
            <div className="p-4 bg-purple-100/50 border border-purple-300 rounded-lg">
              <p className="font-bold text-purple-700">La buena noticia:</p>
              <p className="text-gray-700">Tu caso responde muy bien a un método simple que ayuda a reducir centímetros de cintura, bajar inflamación y recuperar energía.</p>
            </div>
            <p className="text-lg text-gray-700 mt-6">👉 Para ver tu plan personalizado, necesitamos preparar tu diagnóstico final.</p>
          </div>
          <button
            onClick={() => { setShowDiagnosis(false); setShowForm(true); }}
            className="w-full md:w-auto mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 md:px-10 rounded-lg text-xl md:text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-600/30"
          >
            VER MI DIAGNÓSTICO
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-[#FFD6FF]/30 text-gray-900">
        <div className="w-full max-w-md p-6 md:p-8 bg-white/80 rounded-2xl shadow-2xl border border-purple-300">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-800 mb-6">✨ Tu plan personalizado está casi listo…</h2>
          <form onSubmit={handleLeadSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 sr-only">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                className="p-4 bg-white border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition w-full text-gray-900 placeholder-gray-500"
                placeholder="Tu nombre"
              />
            </div>
            <div className="p-4 bg-white border border-gray-300 rounded-lg text-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition text-gray-900">
              <PhoneInput
                international
                defaultCountry={country}
                value={phone}
                onChange={setPhone}
                required
              />
               <p className="text-xs text-gray-500 mt-1 text-left">
                  Ejemplo: {placeholder || 'Digite seu telefone'}
                </p>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'RECIBIR MI PLAN PERSONALIZADO'}
            </button>
          </form>
        </div>
        <div className="w-full max-w-md text-center mt-8 px-4">
          <h3 className="text-xl font-bold text-purple-800 mb-4">Ingresa tus datos para enviarte:</h3>
          <ul className="text-gray-700 space-y-2 inline-block text-left">
            <li className="flex items-center"><span className="text-purple-600 mr-2">✔</span> Cuántos centímetros podrías reducir</li>
            <li className="flex items-center"><span className="text-purple-600 mr-2">✔</span> Qué está frenando tu descenso de peso</li>
            <li className="flex items-center"><span className="text-purple-600 mr-2">✔</span> Tu ruta inicial para empezar HOY</li>
          </ul>
        </div>
      </div>
    );
  }


  if (showOfferPage) {
    // Mantendo a página de oferta como estava, caso seja reativada, mas com cores adaptadas se necessário.
    // Como ela está desativada pelo fluxo, não é crítico, mas vou adaptar para consistência.
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-[#FFD6FF]/30 text-gray-900">
        <div className="w-full max-w-4xl mx-auto">
          
          <div className="relative rounded-2xl p-px bg-gradient-to-b from-purple-400 to-purple-200 shadow-2xl shadow-purple-500/20 mb-8">
            <div className="bg-white/90 rounded-[15px] p-8 text-center">
                <h2 className="text-4xl font-bold mb-4 text-purple-800">🔥 Tu nuevo comienzo empieza aquí 🔥</h2>
                <p className="text-xl text-gray-700 mb-6">Accede al <span className="font-bold text-purple-700">Método Despertar Natural</span> con una oferta única.</p>
                
                <div className="my-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-2xl text-gray-500 line-through">Precio original: 59,70</p>
                  <p className="text-5xl font-bold text-purple-700 animate-pulse">Hoy por solo: 14,80 dólares</p>
                </div>

                <a 
                  href="https://pay.hotmart.com/A102891357R?checkoutMode=10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-600/30 animate-bounce"
                >
                  SÍ, QUIERO EMPEZAR MI TRANSFORMACIÓN HOY
                </a>
            </div>
          </div>
          {/* ... restante da página de oferta adaptado ... */}
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFD6FF]/30">
            <p className="text-lg text-gray-700">Cargando tu viaje...</p>
        </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (currentQuestion.isTestimonial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-[#FFD6FF]/30 text-gray-900">
        <div className="p-8 bg-white/80 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-4 border border-purple-300">
          <h2 className="text-3xl font-bold mb-6 text-purple-800">{currentQuestion.title}</h2>
          <div className="space-y-8">
            {currentQuestion.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-purple-50/50 p-6 rounded-lg border border-purple-100">
                <p className="text-lg text-gray-700 italic">{testimonial.text}</p>
                <p className="text-right text-purple-700 font-semibold mt-4">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFD6FF]/30 text-gray-900 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="w-full bg-white/50 rounded-full h-2.5 mb-6 shadow-inner">
          <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="bg-white/80 rounded-2xl shadow-2xl overflow-hidden border border-purple-300">
          {currentQuestion.image_url && (
            <div className="w-full flex justify-center items-center overflow-hidden my-4 px-4">
              <Image
                  src={currentQuestion.image_url}
                  alt="Imagen que representa la pregunta del cuestionario"
                  width={500}
                  height={288}
                  className="rounded-lg shadow-sm w-full h-auto max-w-[500px]"
                  priority
              />
            </div>
          )}
          <div className="p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-900 text-center">{currentQuestion.text}</h2>
            {currentQuestion.subtitle && (
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 text-center">{currentQuestion.subtitle}</p>
            )}
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={`${currentQuestionIndex}-${index}`}
                  onClick={() => handleAnswer(index)}
                  className="p-4 md:p-5 bg-white rounded-lg text-lg text-left font-medium hover:bg-purple-100/50 text-gray-800 transition-all duration-300 ease-in-out border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-purple-200 transform hover:scale-105 active:scale-95"
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
