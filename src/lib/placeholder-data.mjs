export const questions = [
  // Página 2
  {
    text: '¿Te pasa que tu cuerpo ya no baja de peso aunque intentes de todo?',
    subtitle: 'Miles de mujeres sienten exactamente lo mismo. No estás fallada… tu cuerpo está pidiendo ayuda.',
    image_url: '',
    answers: [
      { text: 'Sí, totalmente' },
      { text: 'A veces' },
      { text: 'No, pero quiero prevenir' },
    ],
  },
  // Página 3
  {
    text: '¿Cuánto tiempo más vas a pelear con tu cuerpo sin resultados reales?',
    subtitle: 'Miles de mujeres sienten exactamente lo mismo. No estás fallada… tu cuerpo está pidiendo ayuda.',
    image_url: '/Imagem-pag-3.png',
    answers: [
      { text: 'Conté calorías, me privé… y sigo inflamada.' },
      { text: '“Como sano”, pero la balanza ni se entera.' },
      { text: 'Llego a la tarde y como lo que sea por ansiedad.' },
      { text: 'Estoy harta. Quiero algo que por fin funcione.' },
    ],
  },
  // Página 4
  {
    text: '¿Cómo te sientes la mayor parte de los días?',
    subtitle: 'Estas señales indican que tu cuerpo está apagando el metabolismo para “sobrevivir”.',
    image_url: '',
    answers: [
      { text: 'Hinchada e inflamada' },
      { text: 'Cansada sin motivo' },
      { text: 'Con ansiedad por comer' },
      { text: 'Todo junto…' },
    ],
  },
  // Página 5
  {
    text: '¿Sabías que tu cuerpo podría estar en modo ‘supervivencia’ y por eso no bajas ni un gramo?',
    subtitle: 'No es tu culpa. Tu cuerpo no quema grasa cuando está sobrecargado.',
    image_url: '/Imagem-pag-5.png',
    answers: [
      { text: 'Sí, me siento inflamada y agotada todo el tiempo.' },
      { text: 'Puede ser… hago todo bien y no veo resultados.' },
      { text: 'No lo sabía, pero tiene sentido.' },
      { text: 'No, seguro el problema soy yo o mi metabolismo lento.' },
    ],
  },
  // Página 6 - TESTIMONIOS
  {
    isTestimonial: true,
    title: 'Historias reales de mujeres como tú 👇',
    testimonials: [
      {
        text: '“Tenía la barriga inflamada todo el día. Con las pausas correctas, bajé 3 cm de cintura en semanas y volví a usar mi ropa favorita.”',
        author: 'Laura, 39 años',
        image_url: '',
      },
      {
        text: '“No entendía por qué no bajaba. Mi cuerpo estaba agotado. Aprendí a darle descanso… y mi energía volvió.”',
        author: 'Mariela, 43 años',
        image_url: '',
      },
    ],
    // This question will be skipped in the main logic, so answers are irrelevant
    text: '',
    answers: [{ text: 'Continuar' }],
  },
  // Página 7
  {
    text: '¿Tu ropa favorita ya no te queda igual que antes?',
    subtitle: 'Las mujeres que hoy están desinflamadas empezaron exactamente donde tú estás ahora.',
    image_url: '/Imagem-pag-7.png',
    answers: [
      { text: 'Ya no me entra' },
      { text: 'Me queda muy ajustada' },
      { text: 'Me queda, pero no como antes' },
      { text: 'Me queda bien' },
    ],
  },
  // Página 8
  {
    text: '¿Cuál es tu objetivo principal ahora?',
    subtitle: 'Tu diagnóstico se está preparando…',
    image_url: '',
    answers: [
      { text: 'Reducir barriga y cintura' },
      { text: 'Recuperar mi energía' },
      { text: 'Mejorar mi autoestima' },
      { text: 'Todo lo anterior' },
    ],
  },
  // Página 9
  {
    text: '¿Y si el problema no fuera la comida… sino que nunca le das descanso a tu cuerpo?',
    subtitle: 'Tu cuerpo no necesita control, necesita respirAR.',
    image_url: '',
    answers: [
      { text: 'Wow… nunca lo había pensado así.' },
      { text: 'Tiene sentido, vivo acelerada y mi cuerpo lo siente.' },
      { text: 'Tal vez… siempre estoy buscando controlarlo todo.' },
      { text: 'No lo sé, pero algo claramente no está funcionando.' },
    ],
  },
  // Página 10
  {
    text: '¿Estás lista para dejar de pelear con tu cuerpo y empezar a escucharlo?',
    subtitle: 'No es fuerza de voluntad — es permitir que tu cuerpo vuelva a encontrar su equilibrio.',
    image_url: '/Imagem-pag-10.png',
    answers: [
      { text: 'Sí, estoy lista para hacerlo diferente esta vez.' },
      { text: 'Quiero, pero aún tengo miedo de fracasar otra vez.' },
      { text: 'No sé cómo empezar, pero quiero sentirme bien.' },
      { text: 'No estoy segura… pero sé que no quiero seguir así.' },
    ],
  },
  // Página 11
  {
    text: '¿Y si existiera una forma de bajar de peso sin pasar hambre… y sin castigarte?',
    subtitle: 'Cuando tu cuerpo descansa, responde. Y tu cintura cambia.',
    image_url: '',
    answers: [
      { text: 'Eso suena exactamente a lo que necesito.' },
      { text: 'Si es sin hambre ni culpa… ¡me apunto ya!' },
      { text: 'Tal vez funcione, pero nunca me lo habían explicado así.' },
      { text: 'No lo sé, pero quiero saber cómo hacerlo.' },
    ],
  },
  // Página 12
  {
    text: '¿Qué resultado te gustaría ver en las próximas 4 semanas?',
    subtitle: 'Cuando tu cuerpo descansa, responde. Y tu cintura cambia.',
    image_url: '',
    answers: [
      { text: 'Bajar de peso sin sacrificio' },
      { text: 'Desinflamarme y sentirme más liviana' },
      { text: 'Dormir mejor y tener más energía' },
      { text: 'Aprender a comer con conciencia' },
    ],
  },
];