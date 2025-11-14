'use client';

import React from 'react';

// Helper component for list items in the "cost of not changing" section
const CostItem = ({ title, description, cost }: { title: string; description: string; cost: string }) => (
  <div className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg">
    <span className="text-2xl text-red-500">❌</span>
    <div>
      <h4 className="font-bold text-white">{title}</h4>
      <p className="text-gray-400 text-sm">{description}</p>
      <p className="font-semibold text-red-400 mt-1">{cost}</p>
    </div>
  </div>
);

// Helper component for benefits in the "most important" section
const BenefitItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-center space-x-3">
        <span className="text-2xl text-yellow-400">✨</span>
        <span className="text-gray-200">{children}</span>
    </li>
);

const ResultsPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-3xl">

        {/* SEÇÃO DE OFERTA */}
        <section className="text-center bg-gradient-to-br from-purple-900/50 to-teal-900/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-purple-700">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-300 mb-4 animate-pulse">
            🎯 Tu nuevo comienzo empieza aquí
          </h2>
          <div className="my-6">
            <p className="text-xl sm:text-2xl text-gray-400 line-through">Precio original: USD 59,70</p>
            <p className="text-lg text-gray-200 mt-2 mb-1">💖 Hoy por solo:</p>
            <p className="text-6xl sm:text-7xl font-bold text-white my-2">USD 14,70</p>
          </div>
        </section>

        {/* ¿Cuánto representa eso en tu vida real? */}
        <section className="my-10 sm:my-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-teal-300 mb-6">💡 ¿Cuánto representa eso en tu vida real?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h4 className="font-bold text-xl text-white">👉 Por MES (1 año): <span className="text-yellow-400">USD 1,22 / mes</span></h4>
                    <ul className="list-disc list-inside text-gray-400 mt-3 space-y-1">
                        <li>Menos que un café barato.</li>
                        <li>Menos que un chocolate que compras por ansiedad.</li>
                        <li>Menos que una botella de agua premium.</li>
                    </ul>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h4 className="font-bold text-xl text-white">👉 Por DÍA (1 año): <span className="text-yellow-400">USD 0,04 / día</span></h4>
                    <p className="text-gray-300 mt-3">
                        Sí: <span className="font-bold">cuatro centavos por día</span> para recuperar tu cuerpo, tu energía y tu autoestima.
                    </p>
                </div>
            </div>
        </section>

        {/* El costo de NO cambiar… */}
        <section className="my-10 sm:my-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-red-400 mb-6 text-center">🌿 El costo de NO cambiar…</h3>
          <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Si no tomas acción hoy, estos son los gastos invisibles que tu cuerpo y tu bolsillo pagan todos los meses:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CostItem title="Ansiedad" description="Snacks, dulces y “antojos” por nerviosismo" cost="USD 20–60/mes" />
            <CostItem title="Inflamación y dolor digestivo" description="Antiácidos, tés especiales, probióticos, medicamentos" cost="USD 30–80/mes" />
            <CostItem title="Cansancio crónico y falta de energía" description="Vitaminas, café extra, bebidas energéticas" cost="USD 40–100/mes" />
            <CostItem title="Consultas médicas" description="Gastroenterólogo, endocrinólogo o nutricionista" cost="USD 80–200 por consulta" />
            <CostItem title="Exámenes" description="Ultrasonidos, hormonas, análisis completos" cost="USD 150–300" />
            <div className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg sm:col-span-2">
                <span className="text-2xl text-red-500">❌</span>
                <div>
                    <h4 className="font-bold text-white">Autoestima baja</h4>
                    <p className="text-gray-400 text-sm">Comer por ansiedad, comprar ropa para “disimular”, sentirse mal con el espejo.</p>
                    <p className="font-semibold text-red-400 mt-1">No tiene precio… pero te cuesta energía, alegría y vida.</p>
                </div>
            </div>
          </div>
        </section>

        {/* Ahora compara… */}
        <section className="my-10 sm:my-12 text-center bg-gray-800 p-6 sm:p-8 rounded-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-teal-300 mb-6">✨ Ahora compara…</h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10">
                <div className="text-center">
                    <p className="text-lg text-gray-300">Tu inversión hoy:</p>
                    <p className="text-3xl font-bold text-yellow-400">USD 14,70 una vez</p>
                </div>
                <div className="text-4xl text-gray-500 hidden md:block">VS</div>
                <div className="text-center">
                    <p className="text-lg text-gray-300">Costo de seguir como estás:</p>
                    <p className="text-3xl font-bold text-red-400">USD 120–600 al mes</p>
                    <p className="text-gray-400">+ desgaste emocional</p>
                </div>
            </div>
        </section>

        {/* Y lo más importante… */}
        <section className="my-10 sm:my-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-purple-400 mb-6 text-center">🌸 Y lo más importante…</h3>
            <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg text-center">
                <p className="text-lg text-gray-300 mb-6">Este producto no es un PDF. <br/> Es una <span className="font-bold text-white">herramienta de transformación diaria</span> que va a enseñarte:</p>
                <ul className="space-y-4 text-lg inline-block text-left max-w-md mx-auto">
                    <BenefitItem>Cómo <span className="font-bold">bajar de peso</span> sin sufrir</BenefitItem>
                    <BenefitItem>Cómo <span className="font-bold">controlar la ansiedad</span> y la inflamación</BenefitItem>
                    <BenefitItem>Cómo volver a <span className="font-bold">sentirte liviana</span></BenefitItem>
                    <BenefitItem>Cómo <span className="font-bold">conectar con tu cuerpo</span></BenefitItem>
                    <BenefitItem>Cómo <span className="font-bold">recuperar tu autoestima</span> y seguridad</BenefitItem>
                </ul>
                <p className="mt-6 text-xl text-yellow-400 font-bold">Todo eso por cuatro centavos al día.</p>
            </div>
        </section>

        {/* BOTÓN PRINCIPAL (CTA) */}
        <section className="my-10 sm:my-12">
            <a
              href="https://pay.hotmart.com/A102891357R?off=onro6ham" // Assuming this is the correct link
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-center py-5 px-6 rounded-xl text-xl sm:text-2xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/50"
            >
              👉 SÍ, QUIERO EMPEZAR MI TRANSFORMACIÓN HOY POR USD 14,70
            </a>
        </section>

        <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Jornada Despertar Natural</p>
        </footer>
      </div>
    </div>
  );
};

export default ResultsPage;