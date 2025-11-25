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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="p-8 bg-gray-800/50 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-4 border border-purple-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-300">Descubre cuántos centímetros podrías reducir de tu cintura sin dietas extremas.</h1>
          <p className="text-xl text-gray-300 mb-8">Tu diagnóstico empieza ahora. Solo necesitas 2 minutos.</p>
          <Image
            src={"/Imagem-pag-1.png"}
            alt="Imagen de introducción al cuestionario"
            width={500}
            height={288}
            className="rounded-lg mb-8 mx-auto"
            priority
          />
          <button
            onClick={() => setShowIntro(false)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            INICIAR TEST
          </button>
        </div>
      </div>
    );
  }

  if (showDiagnosis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="p-8 bg-gray-800/50 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-4 border border-purple-700">
          <h2 className="text-4xl font-bold mb-4 text-yellow-300">✨ Tu resultado está listo.</h2>
          <p className="text-xl text-gray-300">Tu cuerpo te está pidiendo una pausa consciente.</p>
          <Image
            src={"/Imagem-pag-13.png"}
            alt="Imagen del diagnóstico"
            width={500}
            height={288}
            className="rounded-lg my-8 mx-auto"
            priority
          />
          <div className="text-left max-w-lg mx-auto">
            <p className="text-lg text-gray-300 mb-4">Según tus respuestas, tu cuerpo muestra señales de:</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center"><span className="text-red-400 mr-2">●</span> Inflamación interna</li>
              <li className="flex items-center"><span className="text-red-400 mr-2">●</span> Cansancio metabólico</li>
              <li className="flex items-center"><span className="text-red-400 mr-2">●</span> Ritmo hormonal desbalanceado</li>
            </ul>
            <p className="text-lg text-gray-300 mb-6">Esto explica por qué bajar de peso se te ha hecho tan difícil… y por qué no ves cambios aunque hagas “todo bien”.</p>
            <div className="p-4 bg-green-900/50 border border-green-400 rounded-lg">
              <p className="font-bold text-green-300">La buena noticia:</p>
              <p className="text-gray-300">Tu caso responde muy bien a un método simple que ayuda a reducir centímetros de cintura, bajar inflamación y recuperar energía.</p>
            </div>
            <p className="text-lg text-gray-300 mt-6">👉 Para ver tu plan personalizado, necesitamos preparar tu diagnóstico final.</p>
          </div>
          <button
            onClick={() => { setShowDiagnosis(false); setShowForm(true); }}
            className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-lg text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            VER MI DIAGNÓSTICO
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="w-full max-w-md p-8 bg-gray-800/50 rounded-2xl shadow-2xl border border-purple-700">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">✨ Tu plan personalizado está casi listo…</h2>
          <form onSubmit={handleLeadSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 sr-only">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition w-full"
                placeholder="Tu nombre"
              />
            </div>
            <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition">
              <PhoneInput
                international
                defaultCountry={country}
                value={phone}
                onChange={setPhone}
                required
              />
               <p className="text-xs text-gray-400 mt-1 text-left">
                  Ejemplo: {placeholder || 'Digite seu telefone'}
                </p>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-transform transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'RECIBIR MI PLAN PERSONALIZADO'}
            </button>
          </form>
        </div>
        <div className="w-full max-w-md text-center mt-8">
          <h3 className="text-xl font-bold text-yellow-300 mb-4">Ingresa tus datos para enviarte:</h3>
          <ul className="text-gray-300 space-y-2 inline-block text-left">
            <li className="flex items-center"><span className="text-green-400 mr-2">✔</span> Cuántos centímetros podrías reducir</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✔</span> Qué está frenando tu descenso de peso</li>
            <li className="flex items-center"><span className="text-green-400 mr-2">✔</span> Tu ruta inicial para empezar HOY</li>
          </ul>
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
                  href="https://pay.hotmart.com/A102891357R?checkoutMode=10"
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
              href="https://pay.hotmart.com/A102891357R?checkoutMode=10"
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

  if (currentQuestion.isTestimonial) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 font-sans bg-gray-900 text-white">
        <div className="p-8 bg-gray-800/50 rounded-2xl shadow-2xl text-center w-full max-w-2xl mx-4 border border-purple-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-300">{currentQuestion.title}</h2>
          <div className="space-y-8">
            {currentQuestion.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <p className="text-lg text-gray-300 italic">{testimonial.text}</p>
                <p className="text-right text-teal-400 font-semibold mt-4">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4" style={{ zoom: 0.8 }}>
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
                  className="p-5 bg-gray-700/50 rounded-lg text-lg text-left font-medium hover:bg-purple-600 transition-all duration-300 ease-in-out border-2 border-transparent hover:border-purple-400 shadow-md hover:shadow-purple-500/50 transform hover:scale-105"
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
