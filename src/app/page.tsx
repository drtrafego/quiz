'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { questions } from '../lib/placeholder-data.mjs';
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

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);
  const [leadData, setLeadData] = useState({ name: '' });
  const [phone, setPhone] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOfferPage, setShowOfferPage] = useState(false);
  
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
    if (showResultPage) {
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
  }, [showResultPage]);

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
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setIsQuizComplete(true);
      setShowResultPage(true);
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
        setShowResultPage(false);
        setShowOfferPage(true);
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

  if (showResultPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="p-8 bg-gray-800/50 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-4 border border-purple-700">
          
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4 text-yellow-300">✨ ¡Tu cuerpo te está pidiendo una pausa consciente!</h2>
            <p className="text-xl text-gray-300">
              Los síntomas que mencionaste son señales claras de que tu metabolismo necesita descansar para volver a funcionar como antes.
            </p>
            <p className="text-xl text-gray-300 mt-4">
              No se trata de dejar de comer, sino de enseñarle a tu cuerpo a pausar, limpiarse y recuperar su ritmo natural.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-3xl font-bold mb-4 text-yellow-300">Estás a un paso de redescubrirte.</h3>
            <p className="mb-8 text-lg text-gray-300">Deja tu nombre y teléfono para recibir acceso a tu diagnóstico y al <span className="font-bold text-teal-400">Método Despertar Natural</span>.</p>
            <form onSubmit={handleLeadSubmit} className="flex flex-col gap-6 max-w-lg mx-auto">
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
                  Ejemplo: {placeholder || 'Digite seu telefone'}
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
      </div>
    );
  }

  if (showOfferPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="w-full max-w-4xl mx-auto">
          
          <div className="relative rounded-2xl p-px bg-gradient-to-b from-purple-500 to-teal-500 shadow-2xl shadow-purple-500/20 mb-8">
            <div className="bg-gray-800/80 rounded-[15px] p-8 text-center">
                <h2 className="text-4xl font-bold mb-4 text-yellow-300">🔥 Tu nuevo comienzo empieza aquí 🔥</h2>
                <p className="text-xl text-gray-300 mb-6">Accede al <span className="font-bold text-teal-400">Método Despertar Natural</span> con una oferta única.</p>
                
                <div className="my-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-2xl text-gray-400 line-through">Precio original: 59,70</p>
                  <p className="text-5xl font-bold text-teal-400 animate-pulse">Hoy por solo: 14,80 dólares</p>
                </div>

                <a 
                  href="https://pay.hotmart.com/A102891357R?off=onro6ham"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50 animate-bounce"
                >
                  SÍ, QUIERO EMPEZAR MI TRANSFORMACIÓN HOY
                </a>
            </div>
          </div>

          <div className="relative rounded-2xl p-px bg-gradient-to-b from-purple-500 to-teal-500 shadow-xl shadow-teal-500/10 mb-8">
            <div className="bg-gray-800/80 rounded-[15px] p-8">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">💡 ¿Cuánto representa eso en tu vida real?</h3>
                <div className="flex flex-col sm:flex-row justify-around text-center gap-8 sm:gap-0">
                  <div>
                    <p className="text-4xl font-bold text-teal-400">1,23 / mes</p>
                    <p className="text-gray-400">Menos que un café barato.</p>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-teal-400">0,04 / día</p>
                    <p className="text-gray-400">Para recuperar tu cuerpo y energía.</p>
                  </div>
                </div>
            </div>
          </div>

          <div className="relative rounded-2xl p-px bg-gradient-to-b from-red-500 to-orange-500 shadow-xl shadow-red-500/20 mb-8">
            <div className="bg-gray-800/80 rounded-[15px] p-8">
                <h3 className="text-3xl font-bold text-red-400 mb-6 text-center">🌿 El costo de NO cambiar…</h3>
                <p className="text-center text-gray-400 mb-6">Si no tomas acción hoy, estos son los gastos invisibles que tu cuerpo y tu bolsillo pagan todos los meses:</p>
                <ul className="space-y-4 text-lg text-left">
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Ansiedad:</span> Snacks, dulces y “antojos” por nerviosismo: <span className="font-semibold text-white">20–60/mes</span></div></li>
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Inflamación y dolor digestivo:</span> Antiácidos, tés especiales, probióticos, medicamentos: <span className="font-semibold text-white">30–80/mes</span></div></li>
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Cansancio crónico y falta de energía:</span> Vitaminas, café extra, bebidas energéticas: <span className="font-semibold text-white">40–100/mes</span></div></li>
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Consultas médicas por síntomas derivados del estrés metabólico:</span> Gastroenterólogo, endocrinólogo o nutricionista: <span className="font-semibold text-white">80–200 por consulta</span></div></li>
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Exámenes (cuando el cuerpo “da señales”):</span> Ultrasonidos, hormonas, análisis completos: <span className="font-semibold text-white">150–300</span></div></li>
                  <li className="flex items-start"><span className="text-red-500 mr-3">❌</span><div><span className="font-bold">Autoestima baja:</span> Comer por ansiedad, comprar ropa para “disimular”, sentirse mal con el espejo. <span className="font-semibold text-white">No tiene precio… pero te cuesta energía, alegría y vida.</span></div></li>
                </ul>
            </div>
          </div>

          <div className="relative rounded-2xl p-px bg-gradient-to-b from-teal-400 to-green-500 shadow-xl shadow-teal-500/20 mb-8">
            <div className="bg-gray-800/80 rounded-[15px] p-8">
                <h3 className="text-3xl font-bold text-teal-400 mb-6 text-center">🌸 Y lo más importante…</h3>
                <p className="text-center text-gray-300 mb-6">Es una herramienta de transformación diaria que va a enseñarte:</p>
                <ul className="space-y-4 text-lg text-left">
                  <li className="flex items-center"><span className="text-teal-400 mr-3">✨</span> Cómo bajar de peso sin sufrir</li>
                  <li className="flex items-center"><span className="text-teal-400 mr-3">✨</span> Cómo controlar la ansiedad y la inflamación</li>
                  <li className="flex items-center"><span className="text-teal-400 mr-3">✨</span> Cómo volver a sentirte liviana</li>
                  <li className="flex items-center"><span className="text-teal-400 mr-3">✨</span> Cómo conectar con tu cuerpo</li>
                  <li className="flex items-center"><span className="text-teal-400 mr-3">✨</span> Cómo recuperar tu autoestima y seguridad</li>
                </ul>
                 <p className="text-center text-gray-300 mt-6">Todo eso por cuatro centavos al día.</p>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="https://pay.hotmart.com/A102891357R?off=onro6ham"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50 animate-pulse"
            >
              SÍ, QUIERO EMPEZAR MI TRANSFORMACIÓN HOY
            </a>
          </div>

        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Método Despertar Natural</p>
        </footer>
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
              <Image
                  src={currentQuestion.image_url}
                  alt="Imagen que representa la pregunta del cuestionario"
                  width={500}
                  height={288}
                  className="rounded-lg"
                  priority
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
          <p>Método Despertar Natural</p>
        </footer>
      </div>
    </div>
  );
}