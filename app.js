// === Botón Google Play ===
document.getElementById('downloadBtn')?.addEventListener('click', () => {
  // (opcional) tracking/analytics
});

// === Carrusel dentro de la pantalla del teléfono ===
(function phoneCarousel(){
  const screen = document.getElementById('phoneScreen');
  if (!screen) return;

  const slides = [...screen.querySelectorAll('.screen-img')];
  let i = slides.findIndex(s => s.classList.contains('is-visible'));
  if (i < 0) i = 0;

  setInterval(() => {
    slides[i].classList.remove('is-visible');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-visible');

    screen.classList.add('flash');
    setTimeout(() => screen.classList.remove('flash'), 420);
  }, 5000);
})();

// === Efecto máquina de escribir para la tagline ===
(function typeTagline(){
  const el = document.getElementById('tagline');
  if (!el) return;

  const full = el.textContent.trim();
  el.textContent = "";
  let idx = 0;

  const speed = 24;
  const startDelay = 400;

  setTimeout(() => {
    const t = setInterval(() => {
      el.textContent += full.charAt(idx);
      idx++;
      if (idx >= full.length) clearInterval(t);
    }, speed);
  }, startDelay);
})();

// --- Mostrar pasos 1-2-3 de forma escalonada al cargar ---
(function revealSteps(){
  const list = document.querySelector('.hiw-steps');
  if (!list) return;
  const steps = [...list.querySelectorAll('.hiw-step')];

  steps.forEach(s => s.classList.remove('revealed'));

  const startDelay = 250;
  const stepGap    = 160;

  setTimeout(() => {
    steps.forEach((step, i) => {
      setTimeout(() => step.classList.add('revealed'), i * stepGap);
    });
  }, startDelay);
})();

// ===== Scroll reveal con IntersectionObserver =====
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  });

  els.forEach(el => io.observe(el));
})();

// === Chat: abrir/cerrar + BOT LOCAL (sin n8n) ===
(() => {
  const btn = document.getElementById('btnSupport');
  const panel = document.getElementById('alChat');
  const closeBtn = document.getElementById('alChatClose');
  const body = document.getElementById('alChatBody');
  const input = document.getElementById('alChatInput');
  const sendBtn = document.getElementById('alChatSend');
  const typing = document.getElementById('alTyping');

  if (!btn || !panel) return;

  function toggle(){
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) input?.focus();
  }
  function hide(){
    panel.hidden = true;
    btn.setAttribute('aria-expanded','false');
  }

  btn.addEventListener('click', toggle);
  closeBtn?.addEventListener('click', hide);

  // ===== BOT LOCAL (100 respuestas) =====

  const FAQS = [
    // 1 SALUDO GENERAL
    {
      triggers: ["hola","hi", "ola", "hello","holis", "buenas", "buenos dias", "buen dia", "buenas tardes", "buenas noches", "que onda", "que tal","hola botsito"],
      reply: "¡Hola! 👋 Soy el asistente de <b>AL Calculadora</b>. Estoy aquí para ayudarte con información de la app: suscripciones, calculadoras, problemas de acceso, respaldo y más. Cuéntame qué necesitas 🤝"
    },
    // 2 LOGIN BLOQUEO HORA

    
    {
      triggers: [
        "no puedo iniciar sesion","no pude iniciar sesion","no puedo iniciar","no pude iniciar","no puedo entrar","no pude entrar",
        "no me deja entrar","no me deja iniciar","no me deja acceder","no puedo acceder","error al iniciar","no puedo loguearme",
        "no puedo logearme","no puedo abrir la app","no puedo usarla","me saca de la app", "gracias, grasias", "plan mensual", "plan barato", "plan recomendado"
      ],
      reply: "Parece un tema de acceso 🔐. Primero verifica esto:\n1) Activa en tu teléfono <b>Fecha y hora automáticas</b> (la app la usa para validar tu suscripción y darte modo sin conexión).\n2) Si abriste tu cuenta en otro teléfono, <b>cierra sesión en el anterior</b> y vuelve a entrar aquí (solo se puede una sesión activa por cuenta y por seguridad).\n3) Si después de eso sigue igual, mándanos mensaje y lo liberamos manualmente 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },

    {
      triggers: ["gracias", "muchas gracias", "te debo una", "Ok gracias"],
      reply: "De nada, es un placer ayudarte☺️."
    },

    {
  triggers: ["como me puedo suscribir", "como me suscribo", "como se suscribe", "quiero suscribirme", "donde me suscribo"],
  reply: "Puedes suscribirte entrando a la app, iniciando sesión con tu cuenta y desde el apartado de suscripción eliges el plan (mensual o anual) y el método de pago que más te convenga. 🙂"
},

{
  triggers: ["quiero cambiar de plan", "puedo pasar de mensual a anual", "cambiar mi suscripcion", "subir de plan", "bajar de plan"],
  reply: "Sí puedes cambiar de plan 👍. Lo ideal es hacerlo al terminar tu periodo actual (por ejemplo, cuando se venza el mensual) y ahí eliges el nuevo plan dentro de la app. Pero lo mejor es cancelar la subscripción actual y esperar la fecha de fin de subscripción que te marque la app, despues ya podras cambiar de pla."
},
{
  triggers: ["ya pague y no me deja entrar", "despues de pagar cuanto tarda", "pague hace rato y no entra", "ya hice el pago y no funciona"],
  reply: "La activación normalmente es inmediata (menos de 1 minuto⏱️). Cierra la app y vuelve a abrirla con internet. Si en 5 minutos sigue igual, mándanos la captura del pago y tu correo para activarlo manual 👉 Soporte de AL."
},


     {
      triggers: ["plan mensual","plan barato","plan recomendado"],
      reply: "El plan mensual tiene un costo de $3799 MX, ideal si es la primera vez que compras una suscripcion de AL Calculadora."
    },
    // 3 LOGIN OTRO DISPOSITIVO
    {
      triggers: ["sesion en otro telefono","iniciar en otro telefono","no me deja por otro dispositivo","otro dispositivo tiene la cuenta"],
      reply: "Tu cuenta de <b>AL Calculadora</b> está pensada para usarse en <b>un dispositivo a la vez</b> para proteger tus datos y tu suscripción. Entra al teléfono donde sí te deja → cierra sesión → vuelve a entrar en el nuevo. Si ya no tienes el teléfono anterior, escríbenos y la liberamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 4 LOGIN GOOGLE RECOMENDADO
    {
      triggers: ["como inicio","como entrar","como me registro","como puedo entrar","como puedo usarla","como accedo"],
      reply: "Puedes entrar de dos formas:\n• <b>Correo y contraseña</b> (clásico)\n• <b>Cuenta de Google</b> (recomendado ✅ porque es más rápido y no tienes que recordar contraseña). Después de entrar puedes hacer la compra desde dentro de la app."
    },
    // 5 HORA AUTOMATICA
    {
      triggers: ["hora automatica","activar hora","fecha y hora automatica","me pide la hora","problema de fecha y hora"],
      reply: "La app te pide <b>hora automática</b> porque así controla la vigencia de tu suscripción y te deja trabajar <b>sin internet</b> sin que alguien la use de forma indebida. Actívala en tu Android → ‘Fecha y hora’ → ‘Usar hora de la red’. Luego vuelve a abrir AL Calculadora ✅"
    },
    // 6 PRECIOS/PLANES
    {
      triggers: ["precio","cuanto cuesta","plan","planes","suscripcion","suscripción","costo","mensual","anual","pago"],
      reply: "Actualmente manejamos 👇\n• <b>Plan mensual:</b> $279.99 MXN\n• <b>Plan anual:</b> $2,499 MXN\nLos dos incluyen <b>todas</b> las funciones: calculadoras, cotizador, base de datos, notas, creador de fórmulas, respaldos y futuras mejoras. Se paga <b>dentro de la app</b> usando los métodos que tengas en Google Play."
    },
    // 7 DONDE PAGO
    {
      triggers: ["donde pago","como pago","como hago el pago","formas de pago","metodo de pago","pagar dentro de la app"],
      reply: "Para pagar entra a tu cuenta en AL Calculadora → ve al apartado de <b>suscripciones</b> o al engrane ⚙️ → elige el plan → se abre el pago de <b>Google Play</b>. Ahí puedes usar tarjeta, saldo de Play o el método que tengas registrado ✅"
    },
    // 8 POR QUE SE BLOQUEA
    {
      triggers: ["se bloqueo","se bloqueó","ya no me deja usar","dice que expiro","vencio mi suscripcion","suscripcion vencida"],
      reply: "Cuando la fecha de tu plan termina ⏱️ la app se bloquea para evitar usos sin pago. Solo tienes que entrar a <b>suscripciones</b> y renovar. Si crees que se bloqueó por error o cambiaste de teléfono, mándanos mensaje 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 9 AUTO-RENOVACION
    {
      triggers: ["se cobro solo","me cobro solo","pago automatico","renovacion automatica","se renovó solo"],
      reply: "Las compras hechas por <b>Google Play</b> pueden renovarse automáticamente en la fecha de vencimiento (Google te avisa). Si no quieres que se renueve, entra antes de la fecha y <b>cancela la suscripción</b> desde la Play Store. Dentro de la app también tenemos el acceso al engrane para guiarte."
    },
    // 10 CAMBIAR DE PLAN
    {
      triggers: ["cambiar de plan","quiero anual","quiero mensual","subir a anual","bajar a mensual"],
      reply: "Sí puedes cambiar 📦. Lo ideal es hacerlo cuando tu plan actual esté por terminar. Entras a suscripciones → eliges el nuevo plan → Google hace el ajuste. Si necesitas que lo hagamos manual (porque cambiaste antes de tiempo), escríbenos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 11 PAIS/PESOS
    {
      triggers: ["soy de otro pais","moneda diferente","no veo en mx","precio en otro pais"],
      reply: "Mostramos los precios en <b>MXN</b> porque la app está pensada principalmente para México. Pero si tu cuenta de Google Play está en otro país, Play hace la conversión con tu moneda local según tu forma de pago."
    },
    // 12 DESCARGA
    {
      triggers: ["descargar","donde descargo","como la descargo","no la encuentro","play store","link de descarga","enlace de descarga"],
      reply: "La app está publicada en <b>Google Play Store</b>. Solo busca <b>“AL Calculadora”</b> y te debe aparecer con el ícono azul AL. Si no te aparece puede ser por región o por versión de Android. En ese caso escríbenos y te ayudamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 13 IOS
    {
      triggers: ["ios","iphone","apple","applestore","cuando sale en ios","saldrá en ios"],
      reply: "Por ahora AL Calculadora está disponible <b>solo en Google Play</b> porque la mayoría de alumineros trabaja con Android. Pero sí está contemplado llevarla a <b>Apple Store</b> más adelante 🍎. Si te interesa iOS, escríbenos para ir anotándote."
    },
    // 14 SIN INTERNET
    {
      triggers: ["sin internet","offline","sin conexion","sin conexión","la puedo usar sin internet","no tengo internet"],
      reply: "Sí 👍. AL Calculadora está pensada para que puedas seguir trabajando <b>sin internet</b> en la obra o en el taller. Solo necesitas conexión cuando: 1) te registras, 2) activas/renuevas tu suscripción y 3) quieres hacer respaldo en la nube."
    },
    // 15 CALCULADORAS BASICAS
    {
      triggers: ["calculadoras","que calculadoras trae","que puedo calcular","tipos de calculadoras","trae calculo de ventanas"],
      reply: "Incluye las calculadoras más usadas por alumineros: puertas, ventanas, corredizas, fijas, combinadas y varios sistemas. El flujo es así: pones <b>alto y ancho</b> → la app calcula los <b>perfiles a usar</b> y sus <b>medidas exactas</b>. Así reduces errores y ahorras tiempo 🧠⚡."
    },
    // 16 CREAR FORMULAS
    {
      triggers: ["creador de formulas","crear formulas","mis formulas","formulas personalizadas"],
      reply: "Si tú trabajas con descuentos o medidas diferentes, puedes usar el <b>creador de fórmulas</b> para guardar tu forma de calcular. Lo haces una sola vez y después solo metes alto/ancho y listo. Esto es ideal para talleres que ya traen su forma de trabajar y no la quieren cambiar."
    },
    // 17 COTIZADOR
    {
      triggers: ["cotizador","hacer cotizacion","hacer presupuesto","cotizacion para cliente"],
      reply: "El cotizador te permite armar <b>cotizaciones rápidas y ordenadas</b> con los precios que tú mismo registras. Así puedes darle costo al cliente en caliente 🔥 sin ir a la libreta o a la calculadora aparte."
    },
    // 18 BASE DE DATOS
    {
      triggers: ["base de datos","agregar precios","meter precios","mis precios","lista de precios"],
      reply: "Ve a <b>Cotizador → Base de datos</b> y ahí metes los perfiles, vidrios, herrajes y lo que vendas con sus precios. Lo haces una sola vez y después solo actualizas. Tus datos se guardan y se pueden respaldar para que no los pierdas al cambiar de teléfono."
    },
    // 19 RESPALDO / CAMBIO DE TEL
    {
      triggers: ["cambiar de telefono","cambie de telefono","como paso mis datos","no quiero perder mis datos","respaldo","hacer copia"],
      reply: "Te recomendamos hacer <b>un respaldo</b> antes de cambiar de teléfono. La app puede guardar tus datos en la nube y luego los descargas en el nuevo. Si ya cambiaste y no hiciste copia, escríbenos y vemos qué se puede recuperar 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 20 NOTAS
    {
      triggers: ["notas","bloc de notas","libreta","apuntes"],
      reply: "La sección de <b>notas</b> es para que no andes con hojas sueltas 📒. Ahí apuntas medidas, pendiente de cliente, dirección, datos de una obra, etc. Luego lo puedes exportar o respaldar."
    },
    // 21 MODO SIN CRASH
    {
      triggers: ["se cierra","se sale","se crashea","se cierra sola"],
      reply: "Si la app se cierra sola puede ser por 3 cosas: 1) versión de Android muy vieja, 2) memoria del teléfono muy llena, 3) datos dañados. Primero reinicia el dispositivo. Si sigue igual, borra caché de la app. Si aún así no jala, escríbenos y te pedimos un pequeño log 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 22 NO HAY PLAN GRATIS
    {
      triggers: ["hay plan gratis","es gratis","tienen gratis","modo gratis"],
      reply: "Por el momento <b>no hay plan gratis</b>. Esto porque la app incluye muchas funciones específicas para aluminería y lleva mantenimiento constante. Lo que sí hay son planes accesibles y puedes cambiar de mensual a anual cuando quieras."
    },
    // 23 SOPORTE WHATSAPP
    {
      triggers: ["soporte","contacto","whatsapp","numero","número","quiero hablar con alguien"],
      reply: "Claro 👌 Escríbenos aquí 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>. No manejamos horario fijo porque también andamos en campo, pero te respondemos lo más pronto posible."
    },
    // 24 REDES
    {
      triggers: ["tiktok","tik tok","youtube","redes","redes sociales"],
      reply: "Puedes ver contenido y tips en nuestras redes:\n• <a href=\"https://www.tiktok.com/@josueftm?_t=ZS-90WoSvoBuIZ&_r=1\" style=\"color:#0F6FDC\">TikTok</a>\n• <a href=\"https://www.youtube.com/@ftherreriayaluminio\" style=\"color:#0F6FDC\">YouTube</a>\nAhí subimos cosas de herrería, aluminio y actualizaciones de la app."
    },
    // 25 POR QUE PIDE PERMISOS
    {
      triggers: ["por que pide permiso","por que pide la hora","permiso raro","permiso extraño"],
      reply: "Los permisos que pide AL Calculadora son <b>solo</b> para: validar tu suscripción, permitir modo sin internet y hacer respaldo. No usamos tu configuración para nada extraño ni compartimos tus datos."
    },
    // 26 OPTIMIZADOR VIDRIO (futuro)
    {
      triggers: ["optimizador","cortes de vidrio","acomodo de cortes","cortes optimizados"],
      reply: "El módulo de optimización está pensado para que puedas acomodar cortes (como para vidrio) sin desperdicio. Estamos integrándolo con la misma lógica de la app, así que lo verás dentro de tu suscripción sin pagar más 💪"
    },
    // 27 NO ENCUENTRO UNA CALCULADORA
    {
      triggers: ["no encuentro la calculadora","no veo la calculadora","no trae esta serie","no trae la que uso"],
      reply: "La app trae las más usadas, pero si a ti te falta una serie o sistema que manejes mucho, nos lo puedes pedir y lo agregamos en una actualización. Mándanos foto/nombre de la serie y cómo la calculas 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 28 RAZON DE UNA SOLA SESION
    {
      triggers: ["por que una sola sesion","solo una sesion","por que no puedo en dos telefonos"],
      reply: "Manejamos una sola sesión activa por cuenta para que no se comparta una suscripción entre varias personas y para proteger tus datos de base de precios. Si necesitas cambiar de teléfono, solo cierra sesión en el anterior y listo ✅"
    },
    // 29 CADUCIDAD SIN INTERNET
    {
      triggers: ["se me caduco sin internet","sin internet se bloqueo","no tenia internet y ya no abrio"],
      reply: "La app deja trabajar sin internet, pero cada cierto tiempo necesita validar que tu suscripción sigue activa. Si estabas muchos días sin conexión, solo conéctate 1 vez (wifi/datos), abre la app y se vuelve a habilitar."
    },
    // 30 CREAR CUENTA
    {
      triggers: ["crear cuenta","registrarme","como me registro","no tengo cuenta"],
      reply: "Abre la app → elige <b>Crear cuenta</b> → puedes hacerlo con correo y contraseña o con tu cuenta de Google. Te recomendamos Google porque es más rápido y no olvidas contraseña."
    },
    // 31 RECUPERAR CONTRASEÑA
    {
      triggers: ["olvide mi contraseña","recuperar contraseña","no recuerdo la contraseña","resetear pass"],
      reply: "Si entraste con Google no necesitas contraseña 👍. Si entraste con correo y la olvidaste, mándanos el correo con el que te registraste y te ayudamos a recuperarla 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 32 ALTA VELOCIDAD
    {
      triggers: ["rapido","mas rapido","se tarda"],
      reply: "Para que la app vaya más fluida: cierra otras apps, asegúrate de tener algo de espacio libre y mantén AL Calculadora actualizada desde Play. Está optimizada para que corra bien en teléfonos de trabajo 👍"
    },
    // 33 REPORTE DE ERROR
    {
      triggers: ["error","bug","me marco error","sale pantalla rara","pantalla en blanco"],
      reply: "Gracias por avisar 🙏 Toma captura o graba un videíto corto de lo que pasa y mándalo al Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>. Con eso lo corregimos rápido."
    },
    // 34 PAGO NO SE REFLEJA
    {
      triggers: ["pague y no se reflejo","ya pague y sigue bloqueada","pago no aparece"],
      reply: "A veces Google tarda unos minutos en avisar. Cierra y vuelve a abrir la app. Si sigue bloqueada, mándanos captura del cobro y lo activamos manual 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 35 ACTUALIZACIONES
    {
      triggers: ["actualizacion","nuevas funciones","van a meter mas cosas","siguen agregando cosas"],
      reply: "Sí 💪 Estamos agregando más herramientas para alumineros (más series, más cotizador, mejores respaldos) sin subirte el precio en tu periodo actual. Por eso es buena idea tener la app actualizada desde Play."
    },
    // 36 USO EN TALLER
    {
      triggers: ["la puedo usar en el taller","sirve para taller","sirve para obra"],
      reply: "Sí, está pensada para ambos: taller y obra. En taller te ayuda a preparar material antes de cortar, y en obra te ayuda a cotizar o anotar medidas del cliente sin regresar a la compu."
    },
    // 37 COMPARACION CON LIBRETA
    {
      triggers: ["porque mejor que libreta","por que usar esta y no libreta"],
      reply: "La libreta se pierde o se moja 😅. Aquí las medidas quedan guardadas, las fórmulas se aplican solas y puedes respaldar. Además la app te calcula perfiles exactos, cosa que en la libreta tienes que hacer a mano."
    },
    // 38 USO PARA PRINCIPIANTES
    {
      triggers: ["soy nuevo","voy empezando","apenas estoy aprendiendo","no se mucho de aluminio"],
      reply: "Perfecto, AL Calculadora te sirve justo para eso ✅. Te da las medidas listas, te evita errores en descuento y te ayuda a cotizar sin tener que saber todas las series de memoria. Y si quieres reforzar, tenemos contenido en YouTube."
    },
    // 39 USO PARA MAESTROS
    {
      triggers: ["ya soy maestro","ya se","ya tengo experiencia"],
      reply: "Entonces la puedes usar para <b>agilizar</b> tu trabajo. Muchos maestros la usan para ya no hacer las cuentas de cabeza y para dejarle la app a su ayudante y que no se equivoque."
    },
    // 40 DIFERENTES PRECIOS
    {
      triggers: ["puedo poner mis precios","se pueden cambiar los precios","no manejo esos precios"],
      reply: "Sí 👌 Tú metes tus propios precios en Base de datos. La app no te obliga a usar una lista fija. Así puedes poner tu utilidad, tu vidrio, tu perfil y tu mano de obra."
    },
    // 41 EXPORTAR NOTAS
    {
      triggers: ["exportar notas","sacar notas","descargar notas"],
      reply: "Las notas que haces en la app se pueden exportar para que las tengas a la mano o las compartas. Así ya no se te pierden los apuntes del cliente."
    },
    // 42 UNA CUENTA POR DISPOSITIVO
    {
      triggers: ["compartir cuenta","prestar cuenta","puedo pasarsela a otro"],
      reply: "Por seguridad y por licenciamiento es <b>una cuenta por dispositivo</b>. Si otra persona necesita usarla, lo mejor es que tenga su propia cuenta. Así tú mantienes tus precios privados."
    },
    // 43 INSTALAR EN TABLET
    {
      triggers: ["puedo en tablet","sirve en tablet","instalar en tablet"],
      reply: "Si tu tablet tiene Google Play y Android compatible, sí la puedes instalar igualito que en el teléfono 👍"
    },
    // 44 CAMBIO DE NUMERO
    {
      triggers: ["cambie de numero","numero nuevo"],
      reply: "No hay problema. Lo importante es el <b>correo o la cuenta de Google</b> con la que entraste. Mientras entres con la misma, reconocemos tu suscripción."
    },
    // 45 NO CARGA IMAGENES
    {
      triggers: ["no carga imagen","no se ve imagen","se ve en blanco"],
      reply: "Puede ser tu conexión o el navegador. Cierra y vuelve a abrir. Si estás en web, prueba en Chrome. Si sigues sin ver el chat o los íconos, mándanos captura."
    },
    // 46 NO ME LLEGA CORREO
    {
      triggers: ["no me llega correo","no llego correo"],
      reply: "Revisa spam o correo no deseado. A veces Gmail los mete ahí. Si no está, dinos y te lo reenviamos."
    },
    // 47 COMPATIBILIDAD ANDROID
    {
      triggers: ["version de android","no es compatible","mi telefono no deja instalar"],
      reply: "La app está optimizada para Android relativamente reciente. Si tu equipo es muy viejo quizá no te deje. Escríbenos y te decimos si hay alternativa para tu modelo 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 48 PERDI MI SUSCRIPCION
    {
      triggers: ["perdi mi suscripcion","no aparece mi suscripcion","no reconoce mi pago"],
      reply: "Tranquilo 👍 a veces al reinstalar no se sincroniza a la primera. Abre la app con internet. Si sigue sin aparecer, mándanos el correo y tu comprobante y la reactivamos."
    },
    // 49 QUIERO FACTURA
    {
      triggers: ["factura","necesito factura","me dan factura"],
      reply: "Sí podemos ayudarte con factura, pero necesitamos tus datos fiscales y el comprobante del pago que hiciste en Play. Mándalos al Whats y te decimos el paso 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 50 SE QUEDO EN CARGANDO
    {
      triggers: ["se quedo cargando","no pasa de cargando","pantalla cargando"],
      reply: "Cierra la app por completo y vuelve a abrir con internet. Si sigue, puede ser que no se descargó bien algún recurso. Reinstala y entra de nuevo con tu cuenta."
    },
    // 51 QUIERO MAS SERIES
    {
      triggers: ["quiero mas series","agreguen mas series","no esta mi serie"],
      reply: "Pásanos el nombre de la serie y de qué fabricante es y la vamos metiendo en el orden en que nos la piden más usuarios. Así la app se vuelve más útil para todos 🙌"
    },
    // 52 PUERTAS/VENTANAS
    {
      triggers: ["ventana","puerta","corrediza","fija"],
      reply: "Sí, la app te calcula los perfiles para puertas y ventanas. Solo ingresa alto/ancho y listo. Si tu sistema requiere descuento especial, crea una fórmula propia."
    },
    // 53 RESETEAR APP
    {
      triggers: ["resetear app","limpiar app","borrar datos"],
      reply: "Puedes borrar caché/datos desde tu Android para empezar limpio, pero <b>haz respaldo primero</b> si ya metiste precios o notas."
    },
    // 54 MODO OSCURO
    {
      triggers: ["modo oscuro","dark mode"],
      reply: "Lo tenemos considerado para futuras mejoras de interfaz. Por ahora estamos priorizando más herramientas para el cálculo 👷‍♂️."
    },
    // 55 NO PUEDO ACTUALIZAR
    {
      triggers: ["no puedo actualizar","no me deja actualizar"],
      reply: "Abre Play Store → busca AL Calculadora → actualiza. Si no te aparece el botón, borra caché de Play Store y vuelve a intentar."
    },
    // 56 COMPARTIR COTIZACION
    {
      triggers: ["compartir cotizacion","enviar cotizacion","pdf"],
      reply: "Armas la cotización en la app y ya la puedes compartir por el medio que uses con tus clientes. Así se ve más profesional que mandarla toda en texto suelto."
    },
    // 57 CONTRASEÑA INCORRECTA
    {
      triggers: ["contraseña incorrecta","password incorrecta","clave mal"],
      reply: "Verifica mayúsculas/minúsculas. Si de plano no es, mándanos el correo con el que te registraste y te ayudamos a restablecer."
    },
    // 58 CAMBIO DE CORREO
    {
      triggers: ["cambiar correo","otro correo","quiero usar otro gmail"],
      reply: "Se puede, pero es mejor que lo hagamos nosotros para no perder tu historial. Mándanos el correo actual y el nuevo 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    },
    // 59 INSTALAR EN PC
    {
      triggers: ["pc","computadora","windows"],
      reply: "La app está pensada para móvil (Android). Si quieres usarla en PC puedes probar con un emulador de Android."
    },
    // 60 SIN ESPACIO
    {
      triggers: ["no tengo espacio","me dice memoria llena"],
      reply: "Libera un poco de espacio (fotos/videos) y vuelve a instalar. La app no pesa tanto, pero Android no instala si estás al límite."
    },
    // 61 COMO FUNCIONA
    {
      triggers: ["como funciona","para que sirve","que hace la app"],
      reply: "<b>AL Calculadora</b> es una herramienta para alumineros que te ahorra hasta 50% del tiempo: metes medidas → te da perfiles y cortes → armas cotización → guardas tus precios → todo en un mismo lugar."
    },
    // 62 LICENCIAS EMPRESA
    {
      triggers: ["para mi equipo","para varios trabajadores","varias licencias"],
      reply: "Si quieres que varios de tu taller la usen, escríbenos y vemos una forma de activarlos sin que estén peleándose por la misma cuenta."
    },
    // 63 NO ENCIENDE CHAT
    {
      triggers: ["no abre el chat","no sale el chat"],
      reply: "Refresca la página o vuelve a abrir la app. Si sigues sin verlo, puede ser tu navegador. Prueba en Chrome."
    },
    // 64 REQUISITOS MINIMOS
    {
      triggers: ["requisitos","que necesita","minimo para que funcione"],
      reply: "Con un Android medianito y un poquito de espacio corre bien. Lo importante es que tengas Play Store y puedas iniciar con tu cuenta."
    },
    // 65 QUIERO DEMO
    {
      triggers: ["hay demo","puedo probar","quiero probar"],
      reply: "Ahorita no tenemos demo pública, pero si quieres te enseñamos en video cómo funciona para que veas si te conviene antes de pagar."
    },
    // 66 HISTORIAL
    {
      triggers: ["historial","que he hecho","lo que he calculado"],
      reply: "Muchas cosas se quedan guardadas para que no repitas. Igual, si quieres más registro, usa las notas."
    },
    // 67 MULTI IDIOMA
    {
      triggers: ["otros idiomas","ingles","portugues"],
      reply: "Por ahora está en español porque la mayoría de usuarios es de MX y LATAM."
    },
    // 68 PROBLEMA CON GOOGLE PLAY
    {
      triggers: ["error play","play store no deja","no me deja comprar"],
      reply: "Eso lo controla Google Play. Revisa tu método de pago o intenta con otra tarjeta. Si ya te cobró pero no activó, nos mandas captura."
    },
    // 69 NO PUEDO RESPALDAR
    {
      triggers: ["no puedo respaldar","no me deja respaldo"],
      reply: "Asegúrate de tener internet en ese momento. Si aun así no puedes, dinos qué mensaje te sale."
    },
    // 70 PREGUNTAS DEL CURSO
    {
      triggers: ["curso","aprendizaje","aprender canceleria"],
      reply: "Si eres nuevo te recomendamos nuestro curso de cancelería de cero a experto para que entiendas las bases y la app te rinda más."
    },
    // 71 USO PARA HERRERIA
    {
      triggers: ["sirve para herreria","hago herreria también"],
      reply: "Muchos herreros la usan para la parte de aluminio y para tener todo en un solo lugar. Y en redes subimos herrería también."
    },
    // 72 CAMBIAR MONEDA
    {
      triggers: ["cambiar moneda","otra moneda"],
      reply: "Maneja MXN como base. Si quieres poner precios en tu moneda, simplemente ingrésalos así en tu base de datos."
    },
    // 73 NO VEO SUSCRIPCION
    {
      triggers: ["no veo el boton de suscripcion","no aparece suscripcion"],
      reply: "Cierra y vuelve a abrir con internet. Si sigue sin salir, mándanos captura de tu pantalla."
    },
    // 74 LENTO EN DATOS
    {
      triggers: ["lento en datos","con datos se traba"],
      reply: "Algunas partes usan más internet (respaldos). Si puedes, haz eso en wifi."
    },
    // 75 DOS CUENTAS
    {
      triggers: ["tengo dos cuentas","me registre dos veces"],
      reply: "Dinos cuál quieres conservar y te ayudamos a dejar una sola activa."
    },
    // 76 BORRAR CUENTA
    {
      triggers: ["borrar cuenta","eliminar cuenta"],
      reply: "Si quieres eliminar tu cuenta y tus datos, mándanos el correo con el que te registraste y lo hacemos manualmente."
    },
    // 77 PAGOS RECHAZADOS
    {
      triggers: ["pago rechazado","no paso la tarjeta"],
      reply: "Eso lo rechaza el banco o Play. Intenta con otro método o espera unos minutos y vuelve a intentar."
    },
    // 78 PLAN ANUAL BENEFICIO
    {
      triggers: ["conviene anual","diferencia anual"],
      reply: "El anual es para quien ya decidió usarla en el taller: te sale más barato que pagar mes por mes y te olvidas todo el año."
    },
    // 79 FACTURAR MES
    {
      triggers: ["factura mensual","quiero factura cada mes"],
      reply: "Sí se puede, pero necesitamos que nos mandes tu pago de cada mes para emitir la factura correspondiente."
    },
    // 80 NO GUARDA
    {
      triggers: ["no guarda","no se guardo","se borro lo que hice"],
      reply: "Puede que cerraste la app muy rápido. Vuelve a intentarlo y espera a que se guarde. Si se sigue borrando, dinos."
    },
    // 81 CARACTERES ESPECIALES
    {
      triggers: ["no me deja poner acentos","no acepta simbolos"],
      reply: "Algunas entradas están limitadas para evitar errores. Usa texto normal."
    },
    // 82 VERSION WEB
    {
      triggers: ["tienen version web","puedo usarla en web"],
      reply: "La tenemos sobre todo para mostrar, pero la versión fuerte es la de Android."
    },
    // 83 MODO PRUEBA
    {
      triggers: ["modo prueba","trial"],
      reply: "Ahorita no hay modo prueba abierto porque la mayoría entra ya a trabajar con sus proyectos."
    },
    // 84 LIMPIAR LISTAS
    {
      triggers: ["limpiar listas","borrar precios"],
      reply: "Puedes editar o borrar desde base de datos. Hazlo con cuidado para no borrar tus precios por error."
    },
    // 85 PERFIL NO CONOZCO
    {
      triggers: ["no conozco el perfil","no se cual es el perfil"],
      reply: "La app te da el perfil según la serie. Si tú usas por nombre comercial, descríbenos y lo mapeamos contigo."
    },
    // 86 MULTIPLES OBRAS
    {
      triggers: ["varias obras","varios proyectos"],
      reply: "Usa notas y base de datos para separar. Si necesitas algo más avanzado, nos dices."
    },
    // 87 REACTIVAR
    {
      triggers: ["reactivar","me reactivan","activar de nuevo"],
      reply: "Sí 👍 solo necesitamos confirmar tu pago o tu cuenta y la reactivamos."
    },
    // 88 VERSION VIEJA
    {
      triggers: ["version vieja","tengo version anterior"],
      reply: "Actualiza desde Play para tener todas las funciones nuevas."
    },
    // 89 CAMBIOS RECIENTES
    {
      triggers: ["que cambiaron","novedades","ultimas mejoras"],
      reply: "Se han metido más cálculos, mejoramos diseño del chat y seguimos afinando la parte de respaldos sin costo extra."
    },
    // 90 ERROR EN CALCULO
    {
      triggers: ["calculo mal","me dio mal la medida"],
      reply: "Mándanos la medida que pusiste y el resultado que te dio para revisarlo. Así lo corregimos para todos."
    },
    // 91 CERRAR SESION
    {
      triggers: ["como cierro sesion","cerrar sesion"],
      reply: "Ve al engrane o ajustes dentro de la app y ahí tienes el botón de <b>Cerrar sesión</b>. Úsalo cuando vayas a cambiar de teléfono."
    },
    // 92 PERMITIR ACTUALIZAR
    {
      triggers: ["me pide actualizar y no quiero"],
      reply: "Algunas actualizaciones son necesarias para que la suscripción funcione bien, por eso aparecen obligatorias."
    },
    // 93 CORRECCION DE DATOS
    {
      triggers: ["cambiar mi nombre","corregir datos","me equivoque al registrar"],
      reply: "Dinos qué dato quieres corregir (nombre, teléfono, correo de contacto) y lo ajustamos."
    },
    // 94 NO TENGO GOOGLE
    {
      triggers: ["no tengo google","no tengo play store"],
      reply: "La forma oficial es por Play. Si de plano no tienes, háblanos y vemos opción."
    },
    // 95 SEGURIDAD
    {
      triggers: ["es seguro","seguridad","usan mi informacion"],
      reply: "Usamos tus datos solo para darte acceso y guardar tus configuraciones. No los vendemos ni los compartimos."
    },
    // 96 MANDAR CAPTURA
    {
      triggers: ["te mando captura","te mando video"],
      reply: "Perfecto 👍 mándala al Whats y con eso entendemos más rápido tu caso."
    },
    // 97 CUANTO TARDA SOPORTE
    {
      triggers: ["cuanto tardan","cuando responden","no contestan"],
      reply: "Respondemos lo más rápido que se puede. A veces estamos en taller o en obra, pero sí te contestamos en ese mismo día casi siempre."
    },
    // 98 MAS HERRAMIENTAS
    {
      triggers: ["van a meter mas","mas herramientas","mas modulos"],
      reply: "Sí, la idea es que con una sola app tengas todo lo de aluminio: cálculos, notas, cotizador y ahora hasta respaldos."
    },
    // 99 FELICITACION
    {
      triggers: ["felicidades","muy buena app","me gusto","esta buena"],
      reply: "¡Gracias! 🤜🤛 Nos ayuda mucho que la uses y nos digas qué más le meterías para hacerla más útil para los alumineros."
    },

    // 100 FALLBACK

    {
  triggers: ["que plan me recomiendas", "que plan recomiendas", "cual plan me conviene", "que es mejor mensual o anual"],
  reply: "Si apenas la vas a probar en tu taller 👉 toma el <b>mensual $279.99 MXN</b>. Si ya viste que sí la usas diario 👉 te conviene más el <b>anual $2,499 MXN</b> porque te olvidas todo el año y sale más barato."
},
{
  triggers: ["como la descargo", "donde la descargo", "descargar app", "descargar al calculadora", "instalar al calculadora"],
  reply: "La descargas desde la <b>Google Play Store</b> buscando <b>“AL Calculadora”</b>. Te debe salir el ícono azul con AL. Si no te aparece, mándanos captura y vemos tu caso."
},
{
  triggers: ["como estas", "como estas?", "que tal estas", "que onda bot", "como andamos?","como andamos","quetal estas"],
  reply: "Todo en orden por aquí 🤖✨. Listo para ayudarte con AL Calculadora. ¿Es sobre suscripción, acceso o calculadoras?"
},
{
  triggers: ["me puedes ayudar","me puedes ayudar?","me ayudas", "necesito ayuda", "tengo una duda", "me apoyas"],
  reply: "Claro 🙌 dime qué te está pasando: ¿no te deja entrar, quieres pagar, o no encuentras una calculadora? Mientras más detalle me des, mejor te respondo."
},
{
  triggers: ["por que es una buena aplicacion", "por que es buena", "por que deberia usarla", "que ventajas tiene"],
  reply: "Porque te ahorra tiempo ⏱️ y errores. Metes alto/ancho y te da los perfiles exactos, puedes guardar tus precios, hacer cotizaciones en caliente y trabajar sin internet. Además la vamos actualizando sin cobrarte extra en tu periodo."
},
{
  triggers: ["que incluye", "que trae", "que funciones tiene", "que puedo hacer aqui"],
  reply: "Incluye: calculadoras de puertas y ventanas, creador de fórmulas, base de datos de precios, cotizador, notas y respaldo. Todo pensado para alumineros ✅"
},
{
  triggers: ["no encuentro la calculadora", "no veo la calculadora", "donde estan las calculadoras"],
  reply: "Algunas calculadoras están en el menú principal y otras dentro de los apartados. Si no ves la que ocupas, dínos la serie o sistema que usas y la vamos agregando."
},
{
  triggers: ["no tengo internet ahorita", "no tengo datos", "la puedo usar sin internet"],
  reply: "Sí 👍. Solo asegúrate de haber activado tu suscripción con internet. Después puedes usar las calculadoras y tus datos sin conexión."
},
{
  triggers: ["se paga una sola vez", "es pago unico", "solo pago una vez"],
  reply: "No, es por suscripción (mensual o anual). Esto nos permite seguirle metiendo funciones y darte soporte cuando se bloquea o cambias de teléfono."
},
{
  triggers: ["tienen soporte", "hablar con alguien", "persona real"],
  reply: "Sí, tenemos soporte humano 😄. Escríbenos aquí 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a> y dinos que vienes del chat."
},
{
  triggers: ["no recuerdo con que correo entre", "no recuerdo mi correo", "no recuerdo con que cuenta"],
  reply: "Pásanos tu nombre y el número con el que nos escribes y buscamos tu cuenta en el sistema. Escríbenos al Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["hay descuento", "me haces descuento", "tienes promocion"],
  reply: "De momento los precios son: <b>$279.99 MXN mensual</b> y <b>$2,499 MXN anual</b>. Si lanzamos promo la avisamos en el mismo chat y en redes 😉"
},

{
  triggers: ["no puedo pagar", "no me deja pagar", "error al pagar", "no puedo comprar"],
  reply: "Eso casi siempre viene de Google Play (método de pago rechazado, sin saldo o tarjeta vencida). Intenta con otro método o vuelve a abrir la app. Si ya te cobró y no se activó 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["como cancelo", "quiero cancelar", "dejar de pagar", "dar de baja"],
  reply: "Las suscripciones se cancelan desde tu <b>Google Play Store</b> en ‘Pagos y suscripciones’. Ahí eliges AL Calculadora y tocas cancelar. Si te atoras nos mandas captura."
},
{
  triggers: ["me bloqueo sin motivo", "se bloqueo sola", "de la nada se bloqueo"],
  reply: "Cuando la app no puede validar tu fecha (porque no hay hora automática o llevabas días sin internet) se protege y se bloquea. Solo activa la hora automática y abre la app con internet 1 vez ✅"
},
{
  triggers: ["puedo usarla en dos telefonos", "dos telefonos", "compartir la cuenta"],
  reply: "Por seguridad la cuenta se permite en <b>un solo dispositivo a la vez</b>. Si cambias de teléfono → cierra sesión en el anterior → entra en el nuevo."
},
{
  triggers: ["cuando sale en ios", "cuando sale para iphone", "para apple cuando"],
  reply: "Está planeado llevarla a iOS 🍎 pero primero estamos fortaleciendo la versión Android (que es la que más usan los alumineros)."
},
{
  triggers: ["me da calculo mal", "no coincide la medida", "medida equivocada"],
  reply: "Mándanos la medida que metiste y el resultado que obtuviste. Muchas veces es por el sistema o por un descuento distinto al tuyo y lo podemos ajustar para todos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["puedo meter mis perfiles", "agregar perfil nuevo", "perfil personalizado"],
  reply: "Sí 👌 en la parte de <b>Base de datos</b> puedes meter lo que tú usas: perfiles, accesorios, vidrios, mano de obra. La app no te amarra a una lista fija."
},
{
  triggers: ["tienen manual", "como se usa la app", "tutorial", "video de uso"],
  reply: "Tenemos contenido y ejemplos en nuestras redes y te podemos mandar video corto según lo que quieras hacer. Escríbenos al Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["se borro todo", "perdi mis datos", "perdi mis notas", "no veo mis precios"],
  reply: "Si no hiciste respaldo y borraste datos del teléfono, es posible que se hayan perdido. Por eso recomendamos respaldo. Cuéntanos qué perdiste y vemos si se puede recuperar algo."
},
{
  triggers: ["como respaldo", "donde respaldo", "guardar en la nube"],
  reply: "En la app tienes opción de guardar tus datos para que, si cambias de teléfono o reinstalas, los vuelvas a cargar. Hazlo cuando tengas internet ✅"
},
{
  triggers: ["me conviene anual", "anual o mensual", "porque anual"],
  reply: "El <b>anual</b> te conviene si ya la usas todos los días en el taller y no quieres que se te pase la fecha. Pagas una vez y listo por 12 meses."
},
{
  triggers: ["puedo facturar mi trabajo", "puedo sacar cotizacion", "me sirve para cotizar"],
  reply: "Sí, justo para eso están el cotizador y la base de datos: armas el costo según tus precios y le das el total al cliente en el momento."
},
{
  triggers: ["sirve para principiante", "no se nada", "voy empezando"],
  reply: "Sí 👍 la app te ayuda a no equivocarte en los cálculos y a ir aprendiendo las medidas. Y si no entiendes una, nos preguntas."
},
{
  triggers: ["sirve para maestros", "ya tengo taller", "ya trabajo en esto"],
  reply: "Para los que ya trabajan les sirve para <b>velocidad</b> y para que el ayudante no se equivoque. La app te deja tus fórmulas hechas."
},
{
  triggers: ["porque pide hora automatica", "para que quiere la hora", "no quiero activar la hora"],
  reply: "La pedimos para que tu suscripción no se pueda ‘congelar’ cambiando la hora del teléfono y para que puedas trabajar sin conexión con confianza. No usamos tu hora para nada más."
},
{
  triggers: ["me saco de la sesion", "me cerro solo", "se cerro la cuenta"],
  reply: "Eso pasa cuando se abre en otro dispositivo o cuando hubo un cambio de seguridad. Solo vuelve a iniciar y listo."
},
{
  triggers: ["como contacto a soporte", "numero de soporte", "whats de soporte"],
  reply: "Aquí está 👇<br><a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>. Mándanos tu nombre y qué teléfono usas."
},
{
  triggers: ["tienen comunidad", "grupo de whatsapp", "grupo exclusivo"],
  reply: "Sí, tenemos grupo para que recibas tips y avisos. Pídenos la invitación en el Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["puedo pagar sin tarjeta", "sin tarjeta", "otro metodo de pago"],
  reply: "Depende de lo que tu Google Play tenga activo en tu país (saldo, efectivo en tiendas, etc.). La app por seguridad cobra dentro de Play."
},
{
  triggers: ["no tengo play store", "no puedo entrar a play", "mi play no sirve"],
  reply: "Escríbenos y vemos si podemos darte una forma alternativa 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["tienen version para pc", "version escritorio", "desde la compu"],
  reply: "La versión oficial es para Android porque es lo que casi todos los alumineros traen en obra. Para PC se puede usar con emulador."
},
{
  triggers: ["no quiero que se renueve", "quitar renovacion", "desactivar renovacion"],
  reply: "Entra a Play Store → Pagos y suscripciones → AL Calculadora → cancelar. Así, cuando termine tu mes/año, ya no se cobra."
},
{
  triggers: ["cuando actualizan", "cuando meten mas", "van a meter mas calculadoras"],
  reply: "Sí, estamos metiendo más series y funciones. Lo bueno es que todo lo nuevo entra en el mismo plan que ya pagaste 💪"
},
{
  triggers: ["como agrego mis descuentos", "descuentos personalizados", "mis medidas son diferentes"],
  reply: "En el <b>creador de fórmulas</b> puedes dejar guardados tus propios descuentos. Así no los vuelves a meter cada vez."
},
{
  triggers: ["se ve raro", "no se ve bien", "se desacomodo"],
  reply: "Puede ser tu tamaño de pantalla o tu navegador. Actualiza la página o reinstala la app y vuelve a entrar."
},
{
  triggers: ["me puedes explicar que es al calculadora", "que es al calculadora", "para que sirve al calculadora"],
  reply: "<b>AL Calculadora</b> es una herramienta hecha para alumineros: calcula perfiles con medidas exactas, guarda tus precios, te deja cotizar rápido y funciona sin internet. Todo en un solo lugar."
},
{
  triggers: ["quiero que todo este en la nube", "todo en la nube", "subir todo"],
  reply: "Puedes respaldar cada cierto tiempo para que no dependas solo del teléfono. Así, si cambias de equipo, recuperas tus datos."
},
{
  triggers: ["como actualizo el precio", "cambiar precio", "subir precio"],
  reply: "Ve a <b>Cotizador → Base de datos</b> y ahí actualizas el precio del artículo. En la siguiente cotización ya se usa ese nuevo precio."
},
{
  triggers: ["como agrego vidrio", "meter vidrio", "precio de vidrio"],
  reply: "Igual que los perfiles: en Base de datos metes ‘Vidrio’ con su precio por m² o como lo manejes y luego lo llamas en el cotizador."
},
{
  triggers: ["puedo trabajar sin registrarme", "sin cuenta", "sin login"],
  reply: "No, necesitas cuenta. Es lo que nos permite identificarte, guardar tus configuraciones y darte acceso sin internet."
},
{
  triggers: ["si cambio de telefono pierdo todo", "pierdo todo si cambio", "no quiero perder"],
  reply: "No, si haces respaldo y entras con la misma cuenta, puedes recuperar tus datos. Lo importante es usar SIEMPRE el mismo correo/Google."
},
{
  triggers: ["puedo usarla para otro oficio", "no soy aluminero", "me sirve si no hago aluminio"],
  reply: "Está optimizada para aluminio, pero muchas cosas (notas, cotizador, base de datos) las puedes usar para otros oficios."
},
{
  triggers: ["necesito soporte urgente", "tengo un caso urgente", "urgente"],
  reply: "Mándalo directo al Whats con captura y pon ‘URGENTE’ al inicio 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["puedo pasarla a mi amigo", "pasarsela a mi amigo", "compartir apk"],
  reply: "Lo mejor es que cada quien tenga su cuenta. Así cada uno tiene sus precios y nosotros podemos dar soporte sin mezclar datos."
},
{
  triggers: ["porque vale eso", "porque cuesta eso", "esta caro"],
  reply: "El precio incluye: todas las calculadoras, actualizaciones, respaldo, soporte por Whats y mejoras sin tener que comprar otra versión. Es una herramienta de trabajo, no solo una app."
},
{
  triggers: ["como mando captura", "en donde te mando captura"],
  reply: "Envíala por Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a> y dinos qué estabas haciendo cuando salió el error."
},

{
  triggers: ["hola de nuevo", "ya volvi", "volvi"],
  reply: "Qué bueno verte otra vez 👋. ¿Seguimos con AL Calculadora? Dime si es de acceso, de pago o de calculadoras."
},
{
  triggers: ["no entiendo el creador de formulas", "no se usar el creador", "ayuda con creador de formulas"],
  reply: "El creador de fórmulas es para guardar tu forma de calcular. Metes los descuentos una sola vez y luego solo pones alto/ancho. Así todos en tu taller calculan igual ✅"
},
{
  triggers: ["como actualizo la app", "no se actualiza", "no me sale actualizar"],
  reply: "Abre la <b>Google Play Store</b>, busca ‘AL Calculadora’ y toca actualizar. Si no te aparece, borra caché de Play y vuelve a abrir."
},
{
  triggers: ["me salio version nueva", "se actualizo sola", "cambio el diseño"],
  reply: "Sí, vamos metiendo mejoras visuales y nuevas funciones. Si algo se te movió, dime qué no encuentras y te digo dónde quedó 😉"
},
{
  triggers: ["como meto un cliente", "guardar cliente", "datos del cliente"],
  reply: "Puedes usar la parte de notas o la de cotizador para guardar nombre del cliente, teléfono y lo que te pidió. Así ya no se te pierde."
},
{
  triggers: ["no me reconoce la cuenta", "dice que no existe mi cuenta", "correo no valido"],
  reply: "Revisa que estés usando el mismo correo con el que te registraste. Si no lo recuerdas, mándanos tu nombre y lo buscamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["dice error de suscripcion", "error en suscripcion", "no se activo mi suscripcion"],
  reply: "Eso pasa cuando Play no le avisó bien a la app. Cierra, vuelve a abrir con internet. Si sigue igual, mándanos captura del pago y la activamos manual ✅"
},
{
  triggers: ["no me deja hacer respaldo", "error al respaldar", "no se guarda en la nube"],
  reply: "Asegúrate de tener internet y sesión iniciada. Si sigues viendo el error, mándanos captura para revisar qué parte está fallando."
},
{
  triggers: ["puedo usar de forma personal y en el taller", "dos usos", "dos perfiles"],
  reply: "Sí, puedes meter varias obras/proyectos dentro de la misma cuenta. Solo organízalo con notas y nombres claros."
},
{
  triggers: ["cual es el whatsapp", "whats de la app", "whats del soporte"],
  reply: "Es este 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["porque tarda en abrir", "se tarda en abrir", "lento al iniciar"],
  reply: "La primera vez que la abres después de actualizar puede tardar un poquito porque carga tus datos. Después ya va más rápido 👍"
},
{
  triggers: ["que pasa si desinstalo", "si la borro pierdo todo", "puedo desinstalarla"],
  reply: "La puedes desinstalar y volver a instalar. Solo asegúrate de entrar con la misma cuenta y, si puedes, haz respaldo antes para no perder precios."
},
{
  triggers: ["puedo usarla sin registrarme en google", "no quiero usar mi cuenta de google"],
  reply: "Lo ideal es usar tu cuenta de Google porque así Play puede cobrarte y la app puede reconocerte. Sin cuenta no podemos vincularte tu suscripción."
},
{
  triggers: ["puedo comprar por fuera de play", "quiero pagar directo", "pago directo a ustedes"],
  reply: "Normalmente el pago es dentro de Google Play porque ahí queda todo seguro y automático. Si en tu país no te deja, escríbenos y vemos opción manual."
},
{
  triggers: ["me marca dispositivo no autorizado", "dispositivo no valida", "no valida el dispositivo"],
  reply: "Eso sale cuando ya había una sesión activa en otro equipo. Cierra sesión allá o escríbenos para liberar tu cuenta 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["quiero poner logo", "quiero personalizar", "puedo personalizar cotizacion"],
  reply: "Por ahora la app se centra en que saques el cálculo y la cotización rápido. Lo de personalizar con logo lo tenemos en la lista de mejoras ✅"
},
{
  triggers: ["se ve muy chico", "letras muy chicas", "quiero mas grande"],
  reply: "Prueba subir el tamaño de fuente de tu teléfono. La app respeta el tamaño del sistema en la mayoría de pantallas."
},
{
  triggers: ["no me deja escribir", "no puedo escribir", "no deja teclear"],
  reply: "Cierra el chat o la pantalla actual y vuelve a abrir. Si tienes teclado flotante, prueba con el teclado normal del sistema."
},
{
  triggers: ["cuantos usuarios tienen", "quien la usa", "la usan otros talleres"],
  reply: "La usan ya varios talleres y maestros de aluminio porque les quita tiempo de cálculo y todos pueden usar la misma forma de medir."
},
{
  triggers: ["para que sirve el chat", "porque hay un chat", "este chat para que es"],
  reply: "Este chat es para responderte lo básico de AL Calculadora sin que tengas que buscar. Y si es algo más complejo, te mandamos al Whats real."
},
{
  triggers: ["aceptan sugerencias", "puedo sugerir", "quiero proponer una funcion"],
  reply: "Sí 🙌 las sugerencias de los mismos alumineros son las que vamos metiendo primero. Cuéntanos tu idea en el Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["tienen version para empresa", "soy empresa", "quiero varias licencias"],
  reply: "Si son varios en tu empresa/taller, mándanos cuántos son y qué funciones usan más y te armamos una forma de activarlos sin que se estén sacando la sesión."
},
{
  triggers: ["puedo usarla sin tarjeta", "quiero pagar en oxxo", "pago en efectivo"],
  reply: "Depende de los métodos que tenga activa tu Google Play. Algunos países dejan pagar en tiendas o con saldo. Revísalo en tu Play Store."
},
{
  triggers: ["no me llega la notificacion", "no recibo notificaciones"],
  reply: "Algunas notificaciones dependen de tu Android y permisos. Revisa que AL Calculadora tenga permisos de notificaciones en ajustes."
},
{
  triggers: ["se queda en pantalla blanca", "pantalla en blanco", "no muestra nada"],
  reply: "Eso suele ser por caché o por una actualización a medias. Cierra la app, bórrale caché y vuelve a abrir con internet."
},
{
  triggers: ["cuanto tarda soporte", "cuanto se tardan en contestar"],
  reply: "Normalmente contestamos el mismo día ⏱️. Si no, al día siguiente. Si es muy urgente, mándalo con ‘URGENTE’ al inicio."
},
{
  triggers: ["puedo cambiar mi nombre", "editar mi nombre", "cambiar mis datos"],
  reply: "Sí, solo dinos cómo lo quieres mostrar y lo actualizamos. Esto es útil si la cuenta la pagó otra persona y la usas tú."
},
{
  triggers: ["no puedo ver mis respaldos", "donde estan mis respaldos"],
  reply: "Asegúrate de haber iniciado sesión con la misma cuenta con la que hiciste el respaldo. Si cambiaste de correo, ahí está el detalle."
},
{
  triggers: ["como meto mano de obra", "meter mano de obra", "agregar mano de obra"],
  reply: "Regístrala en la base de datos como un concepto más (ej. ‘Mano de obra por puerta’) y luego en el cotizador la agregas al trabajo."
},
{
  triggers: ["como meto accesorios", "agregar accesorios", "herrajes"],
  reply: "Igual que los perfiles: en base de datos das de alta el accesorio con su precio y luego lo agregas en la cotización."
},
{
  triggers: ["que pasa si no pago", "si no pago que pasa"],
  reply: "La app se bloquea hasta que vuelvas a activar tu suscripción. Tus datos no se borran, solo se detiene el uso."
},
{
  triggers: ["porque necesito internet al inicio", "me pide internet al principio"],
  reply: "Solo para validar que tu suscripción está activa y sincronizar tus datos. Después de eso puedes trabajar sin internet."
},
{
  triggers: ["puedo usarla en varias obras en el dia", "muchos trabajos en el dia"],
  reply: "Sí, la puedes usar todas las veces que quieras. No cobramos por uso, se paga solo la suscripción."
},
{
  triggers: ["puedo compartir la cotizacion por whatsapp", "enviar por whatsapp"],
  reply: "Sí 👍 sacas la info en la app y la pegas o adjuntas donde atiendes a tus clientes (Whats, Messenger, etc.)."
},
{
  triggers: ["que diferencia tiene con una hoja de excel", "porque no mejor excel"],
  reply: "En Excel tú tienes que armar todo. Aquí ya está pensado para aluminio, con descuentos, notas y respaldo. Y lo traes en el teléfono."
},
{
  triggers: ["puedo trabajar sin crear formulas", "no quiero crear formulas"],
  reply: "Sí, puedes usar las que ya trae. Las fórmulas personalizadas son solo si tú trabajas distinto."
},
{
  triggers: ["que pasa si cambio de numero de whatsapp", "cambie mi whatsapp"],
  reply: "No pasa nada con tu app. Lo que importa es tu cuenta de Google / correo con la que entras a AL Calculadora."
},
{
  triggers: ["puedo usarla para puertas de aluminio", "puertas de aluminio"],
  reply: "Sí, ese es uno de los usos principales. Metes medidas y te muestra perfiles y cortes necesarios."
},
{
  triggers: ["puedo usarla para ventanas corredizas", "ventana corrediza", "corrediza de aluminio"],
  reply: "Sí 👌 hay calculadoras para eso. Y si tu corrediza trae otra guía o sistema, nos la puedes pedir."
},
{
  triggers: ["me marca que la sesion expiro", "sesion expirada", "expira sesion"],
      reply: "Eso significa que hacía rato no validábamos tu cuenta. Solo vuelve a iniciar sesión y ya."
},
{
  triggers: ["puedo pasar mis datos a otra cuenta", "mover datos a otra cuenta"],
  reply: "En general los datos quedan ligados a la cuenta con la que entraste. Si quieres moverlos, escríbenos para revisarlo caso por caso."
},
{
  triggers: ["puedo usarla con mis trabajadores", "dar acceso a mis trabajadores"],
  reply: "Sí, pero lo ideal es que cada uno tenga su acceso o que todos trabajen con el mismo teléfono del taller para que no se estén tumbando la sesión."
},
{
  triggers: ["trae optimizador de cortes", "optimizador integrado"],
  reply: "Estamos trabajando esa parte para que la tengas dentro de la misma app sin pagar otra. Va enfocada a vidrio/aluminio sin desperdicio."
},
{
  triggers: ["que pasa si restauro el telefono", "restaurar de fabrica"],
  reply: "Vas a tener que volver a instalar la app y entrar con tu cuenta. Si tenías respaldo, lo puedes volver a cargar ✅"
},
{
  triggers: ["puedo pagarle a otro su suscripcion", "quiero pagar para otra persona"],
  reply: "Sí, siempre que la compra se haga desde el dispositivo donde se usa la app. Eso lo hace Play para ligar el pago."
},
{
  triggers: ["hay soporte por correo", "correo de soporte"],
  reply: "El canal más rápido es Whats. Si necesitas correo, primero escríbenos ahí y te lo pasamos."
},
{
  triggers: ["como reporto un error", "quiero reportar un error"],
  reply: "Mándanos lo que hiciste paso a paso + captura de pantalla. Con eso lo replicamos y lo arreglamos rápido 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["me salio anuncio raro", "me salio un mensaje raro"],
  reply: "Tómale captura y mándalo. Así vemos si es de Android o de la app."
},
{
  triggers: ["la app esta chida", "muy buena", "me gusto mucho"],
  reply: "Gracias 🙌 la hicimos pensando en que el aluminero tenga TODO en el mismo lugar y no ande con mil hojas."
},
{
  triggers: ["no quiero que guarde mis datos", "privacidad", "datos privados"],
  reply: "Guardamos solo lo necesario para tu cuenta y tu suscripción. Si quieres borrar algo específico, dínoslo y lo quitamos."
},

{
  triggers: ["no abre en mi android", "mi android es viejo", "telefono viejo"],
  reply: "Puede que tu Android sea muy viejo o sin servicios de Google. Intenta en otro dispositivo o escríbenos para ver tu modelo."
},
{
  triggers: ["puedo pagar mas tarde", "quiero pagar despues", "pago luego"],
  reply: "Sí, puedes seguir entrando con tu cuenta, pero la app se quedará bloqueada hasta que hagas el pago ✅"
},
{
  triggers: ["no me sale el engrane", "no veo el engrane", "donde esta el engrane"],
  reply: "El engrane está en la parte de inicio/configuración. Si no lo ves es posible que tu pantalla esté haciendo zoom. Prueba girar el teléfono."
},
{
  triggers: ["me pide que actualice la hora", "mensaje de hora", "aviso de hora"],
  reply: "Activa ‘fecha y hora automáticas’ en tu Android. Es requisito para que la suscripción se pueda validar bien."
},
{
  triggers: ["puedo usarlo en telefono de mi esposa", "quiero prestarlo", "prestar mi app"],
  reply: "Puedes, pero recuerda que solo una sesión puede estar activa. Si ella entra, te va a sacar a ti."
},
{
  triggers: ["no encuentro mi respaldo", "perdi el respaldo", "respaldo no aparece"],
  reply: "Revisa si iniciaste con el mismo correo. Si cambiaste de cuenta, el respaldo queda ligado a la anterior."
},
{
  triggers: ["me puedes dar el link", "link de la app", "enlace directo"],
  reply: "Está en Google Play Store buscando <b>AL Calculadora</b>. Si no te aparece, avísanos y te mandamos enlace directo."
},
{
  triggers: ["que pasa si cambio de correo", "quiero cambiar de google"],
  reply: "Avísanos antes para mover tu acceso y que no pierdas tu suscripción 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["tienen soporte sabado", "tienen soporte domingo", "atienden fin de semana"],
  reply: "No tenemos horario fijo, pero sí respondemos fines de semana cuando vemos tu mensaje 👍"
},
{
  triggers: ["no me deja escribir en el chat", "se congela el chat"],
  reply: "Cierra el chat y vuelve a abrirlo. Si sigues igual, actualiza la página/app."
},
{
  triggers: ["quiero usarlo con mi socio", "con mi ayudante", "con mi empleado"],
  reply: "Lo mejor es que todos usen la misma forma de calcular. Puedes enseñarles a usar tu cuenta, pero recuerda que es 1 sesión a la vez."
},
{
  triggers: ["porque no esta en appgallery", "huawei"],
  reply: "Por ahora la subida está hecha solo en Google Play. Si tu Huawei trae Play, la puedes instalar."
},
{
  triggers: ["no me sale la pantalla azul", "fondo no carga"],
  reply: "Puede ser tu conexión. Carga primero el contenido y luego los estilos. Si no, recarga."
},
{
  triggers: ["quiero ponerle mis colores", "quiero otro tema", "quiero otro color"],
  reply: "El tema actual lo mantenemos igual para todos. Lo que sí puedes personalizar son tus precios, notas y fórmulas."
},
{
  triggers: ["hay limite de notas", "cuantas notas puedo guardar"],
  reply: "No hay un tope pensado para el día a día de un taller. Si llegas a un límite, te avisamos."
},
{
  triggers: ["puedo exportar todo", "exportar todo junto", "descargar todo"],
  reply: "Puedes ir exportando/respaldando por secciones. Si necesitas un volcado completo, escríbenos y lo vemos."
},
{
  triggers: ["cuanto se tarda en activarse", "cuando se activa mi pago"],
  reply: "Normalmente es inmediato. Si pasa de 5 minutos, cierra y abre. Si sigue, mándanos la captura del cobro."
},
{
  triggers: ["me puedes mandar lista de precios", "trae precios ya hechos"],
  reply: "La app no te impone una lista porque cada zona maneja precios distintos. Tú metes los tuyos y se quedan guardados."
},
{
  triggers: ["puedo poner precio por metro", "precio por m2", "manejo m2"],
  reply: "Sí, en base de datos puedes poner tus precios por m² y luego usarlos en cotizador."
},
{
  triggers: ["como meto mano de obra por hora", "cobro por hora"],
  reply: "Regístrala como un ítem más en tu base (ej. “Mano de obra por hora”) y al cotizar lo agregas las veces que ocupes."
},
{
  triggers: ["como elimino un precio", "borrar un item", "quitar precio"],
  reply: "Entra a base de datos, edita el elemento y bórralo. Si lo borras por error, solo vuelve a crearlo."
},
{
  triggers: ["puedo dejar notas al cliente", "nota interna"],
  reply: "Sí, usa la parte de notas para eso. Así no mezclas lo técnico con lo que le piensas decir al cliente."
},
{
  triggers: ["no me gusta mi usuario", "cambiar nombre de usuario"],
  reply: "Dinos cómo lo quieres mostrar y lo cambiamos desde soporte."
},
{
  triggers: ["tienen canal de youtube", "videos de youtube"],
  reply: "Sí 👉 <a href=\"https://www.youtube.com/@ftherreriayaluminio\" style=\"color:#0F6FDC\">YouTube</a>. Ahí subimos contenido relacionado."
},
{
  triggers: ["tienen tiktok", "videos cortos", "reels"],
  reply: "Sí 👉 <a href=\"https://www.tiktok.com/@josueftm?_t=ZS-90WoSvoBuIZ&_r=1\" style=\"color:#0F6FDC\">TikTok</a>. Ahí ves tips rápidos."
},
{
  triggers: ["se me olvido cerrar sesion", "deje la sesion abierta"],
  reply: "Si quedó la sesión en otro teléfono, desde soporte la podemos forzar a cerrar. Escríbenos."
},
{
  triggers: ["no quiero que mis trabajadores vean mis precios", "ocultar precios"],
  reply: "Puedes darles la app para cálculo y dejar la parte de base de datos sólo para ti. Así tú controlas los costos."
},
{
  triggers: ["puedo cambiar el idioma", "ingles"],
  reply: "Por ahora solo español. La mayoría de usuarios es de MX y LATAM."
},
{
  triggers: ["como hago si no aparece mi serie", "falta una serie"],
  reply: "Mándanos el nombre de la serie y cómo la calculas y la agregamos en una actualización 👌"
},
{
  triggers: ["no quiero que se vea el link", "ocultar link"],
  reply: "Los links al soporte se ponen para que sea fácil contactarnos. Si quieres otra forma de contacto, dínosla."
},
{
  triggers: ["puedo usar la app estando fuera de mexico", "la uso en usa", "la uso en otro pais"],
  reply: "Sí, se puede usar en cualquier país mientras tengas Android y Play. Los precios puedes meterlos en tu moneda."
},
{
  triggers: ["porque dice mxn", "quiero que diga mi moneda"],
  reply: "Porque el precio base que publicamos es en MXN. Pero tú puedes meter tus propios precios en tu moneda."
},
{
  triggers: ["puedo ver mi historial de pagos", "donde veo mis pagos"],
  reply: "Tus pagos de suscripción los ves en tu cuenta de Google Play, ahí queda el recibo."
},
{
  triggers: ["puedo pagar con saldo de play", "saldo de google play"],
  reply: "Si tu cuenta tiene ese método activo, sí 👍 la app acepta lo que tu Play acepte."
},
{
  triggers: ["tienen politica de reembolso", "puedo pedir reembolso"],
  reply: "Los cobros los hace Google Play, así que se rigen por la política de Play. Si algo salió mal, cuéntanos y lo revisamos."
},
{
  triggers: ["quiero pasar mis datos a otro numero", "otro whatsapp"],
  reply: "El Whats no afecta tu suscripción, solo es para soporte. Lo importante es tu correo/cuenta de Google."
},
{
  triggers: ["puedo usarla en android tv", "android tv"],
  reply: "No está pensada para TV. Mejor úsala en teléfono o tablet."
},
{
  triggers: ["tienen version lite", "version mas ligera"],
  reply: "La que ves ya está optimizada para que no pese demasiado y se pueda usar en teléfonos de trabajo."
},
{
  triggers: ["quiero que mi logo salga en las cotizaciones", "cotizacion con logo"],
  reply: "Lo tenemos anotado como mejora de presentación 👍"
},
{
  triggers: ["no ha llegado la actualizacion", "no me sale la nueva version"],
  reply: "A veces Play la va liberando por grupos. Espera un ratito o borra caché de Play Store."
},
{
  triggers: ["quiero invitar a alguien a probarla", "como la comparto"],
  reply: "Puedes mandarle el enlace de la Play Store o decirle que busque ‘AL Calculadora’ en su Android."
},
{
  triggers: ["la puedo instalar en emulador", "bluestacks"],
  reply: "Sí, pero recuerda que la app está hecha para móvil. En emulador puede verse distinta."
},
{
  triggers: ["puedo tener varias cuentas", "quiero otra cuenta"],
  reply: "Puedes crear otra cuenta con otro correo. Solo recuerda cuál tiene la suscripción."
},
{
  triggers: ["la app se ve cortada", "no se ve completa"],
  reply: "Revisa el zoom o tamaño de fuente de tu teléfono. Algunos los tienen muy grandes y por eso se recorta."
},
{
  triggers: ["no puedo meter punto decimal", "no acepta punto"],
  reply: "Prueba con coma o revisa el teclado que estás usando. Algunos teclados cambian el separador."
},
{
  triggers: ["ustedes pueden meterme los precios", "pueden configurarmela"],
  reply: "Sí te podemos orientar, pero lo ideal es que tú metas tus precios porque solo tú sabes cuánto cobras."
},
{
  triggers: ["como se que es la app correcta", "hay otra igual", "me salen varias"],
  reply: "La nuestra trae ícono azul con las letras <b>AL</b> y dice ‘AL Calculadora’. Si tienes duda mándanos captura."
},
{
  triggers: ["me detecta como suscripcion vencida", "dice vencida y si pague"],
  reply: "Eso es desincronización. Vuelve a abrir con internet. Si no se corrige, mándanos tu comprobante."
},
{
  triggers: ["porque necesito registro", "porque tengo que crear cuenta"],
  reply: "Porque así podemos guardar tus cosas, ligarte tu suscripción y dejarte usar la app sin internet."
},
{
  triggers: ["puedo usarlo sin pagar solo para ver", "solo quiero ver"],
  reply: "Por ahora no hay modo solo-ver. Está pensada como herramienta de trabajo, no como demo."
},
{
  triggers: ["me da miedo meter mi tarjeta", "es seguro pagar"],
  reply: "El pago no lo vemos nosotros, lo hace <b>Google Play</b>. Es el mismo sistema con el que compras apps y juegos."
},
{
  triggers: ["puedo ponerle contraseña a mis notas", "notas privadas"],
  reply: "De momento no, pero puedes llevar tus notas sensibles afuera y usar la app para lo operativo."
},

{
  triggers: ["no entiendo", "No entiendo", "no sirves", "no te entiendo", "No te entiendo"],
  reply: "Por favor tenme paciensia es mi primera chamba.🥹"
},
{
  triggers: ["puedo usarla para aluminio y vidrio a la vez", "uso aluminio y vidrio"],
  reply: "Sí, es lo que muchos hacen: calculan aluminio y guardan precios de vidrio en la misma base."
},
{
  triggers: ["puedo trabajar si cambia el precio del perfil", "subio el aluminio"],
  reply: "Sí, solo actualizas ese perfil en la base de datos y listo. Las futuras cotizaciones salen con el nuevo precio."
},
{
  triggers: ["que pasa si no tengo whatsapp", "no uso whatsapp"],
  reply: "Te podemos atender por otro medio, pero Whats es lo más rápido. Escríbenos y te damos correo."
},
{
  triggers: ["me pueden hacer una cotizacion ustedes", "hazme una cotizacion"],
  reply: "La idea es que tú mismo la hagas en la app para que sea rápido 😉 pero si se te complica nos mandas medidas y te orientamos."
},
{
  triggers: ["puedo pasar las notas a mi compu", "descargar notas a pc"],
  reply: "Sí, exporta o copia el contenido y lo mandas a tu compu por el medio que uses."
},
{
  triggers: ["puedo ver los cambios que hacen", "changelog", "historial de cambios"],
  reply: "Te podemos mandar lo más reciente cuando nos escribas. Vamos publicando conforme agregamos funciones."
},
{
  triggers: ["la app pesa mucho", "esta muy pesada"],
  reply: "Para todo lo que hace está ligera. Si tu teléfono está lleno, libera un poco de espacio y vuelve a instalar."
},
{
  triggers: ["puedo poner fotos del proyecto", "adjuntar foto"],
  reply: "La parte de notas la puedes usar para describir el proyecto. Adjuntar fotos dentro de la misma app lo tenemos anotado como mejora."
},
{
  triggers: ["no quiero que mi gente vea la parte de suscripcion", "ocultar suscripcion"],
  reply: "Esa parte no se puede ocultar porque es donde se gestiona el pago y la reactivación."
},
{
  triggers: ["porque me pide revalidar", "revalidar suscripcion"],
  reply: "Porque la app permite trabajar sin internet, pero de vez en cuando necesita comprobar que tu suscripción sigue vigente."
},
{
  triggers: ["puedo usar varios metodos de pago", "pagar con otra tarjeta"],
  reply: "Eso lo controlas desde Google Play. Ahí agregas o quitas tarjetas."
},
{
  triggers: ["puedo usarla en modo horizontal", "rotar la app"],
  reply: "Está pensada para vertical porque así se usa más cómodo en teléfono."
},
{
  triggers: ["me pueden avisar cuando salga en ios", "aviso ios"],
  reply: "Claro, mándanos Whats diciendo ‘avísame cuando salga en iOS’ y te apuntamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["si cambio de pais me sirve", "me mudo de pais"],
  reply: "Sí, mientras tengas acceso a tu cuenta de Google y Play, la app te sigue funcionando. Solo cambian los métodos de pago."
},
{
  triggers: ["que pasa si mi telefono se descompone", "se rompio mi telefono"],
  reply: "Instala la app en el nuevo teléfono, entra con tu cuenta y recupera lo que tengas respaldado. Si la cuenta quedó ‘atorada’ en el viejo, te la liberamos."
},
{
  triggers: ["puedo ver mis calculos anteriores", "historial de calculos"],
  reply: "Muchos cálculos los dejas guardados en tus notas o en tus respaldos. Úsalos para no volver a teclear todo."
},
{
  triggers: ["se queda pensando", "ruedita dando vueltas"],
  reply: "Es que está cargando o esperando internet. Si dura mucho, cierra y abre."
},
{
  triggers: ["quiero hacer una demo en video", "puedo grabar la pantalla"],
  reply: "Sí, puedes grabarla. Solo no la subas como tuya o vendiéndola tú 😂"
},
{
  triggers: ["no me gustan los emojis", "quitar emojis"],
  reply: "Los usamos para que sea más amigable. Pero el contenido es el mismo."
},
{
  triggers: ["puedo usar teclado externo", "teclado bluetooth"],
  reply: "Sí, la app acepta el teclado que tenga tu Android."
},
{
  triggers: ["que hago si no entiendo una respuesta", "no entiendo lo que me dijiste"],
  reply: "Dime exactamente qué parte no te quedó clara y te la explico más sencillo o con pasos."
},
{
  triggers: ["desaparecio el boton", "no veo el boton"],
  reply: "Puede ser por el tamaño de tu pantalla. Desliza o gira el teléfono y debe aparecer."
},
{
  triggers: ["puedo usarla con guantes", "no detecta mis dedos"],
  reply: "Eso ya depende del táctil de tu teléfono 😅 la app sí responde al toque normal."
},
{
  triggers: ["no quiero perder mi suscripcion", "cuidar mi suscripcion"],
  reply: "Solo entra con la misma cuenta, mantén hora automática y si cambias de teléfono, cierra sesión en el anterior. Con eso no la pierdes."
},
{
  triggers: ["puedo venderle a mis compañeros la app", "revender la app"],
  reply: "Mejor recomiéndalas y que cada quien la descargue desde su Play. Así todos tienen soporte."
},
{
  triggers: ["cuantas veces puedo respaldar", "limite de respaldos"],
  reply: "Puedes respaldar cuando lo necesites. Solo trata de no hacer 50 al día para no saturarte 😂"
},
{
  triggers: ["puedo dividir cotizacion", "cotizacion por partes"],
  reply: "Haz varias cotizaciones por proyecto y nómbralas claro (ej. ‘Ventanas planta baja’, ‘Puertas patio’)."
},
{
  triggers: ["puedo usarla para pvc", "no es aluminio pero"],
  reply: "La lógica es similar, pero la app está pensada para aluminio. Puedes usar notas y cotizador igual."
},
{
  triggers: ["puedo usarla si no se mucho de celulares", "no soy bueno con celulares"],
  reply: "Sí, por eso la hicimos sencilla: entras, pones medidas, te da el resultado. Y si no, nos preguntas."
},
{
  triggers: ["tienen grupo de facebook", "facebook"],
  reply: "El canal que más usamos es Whats, pero podemos pasarte los demás si lo necesitas."
},
{
  triggers: ["no quiero que salga mi numero en los datos", "ocultar numero"],
  reply: "Puedes dejar solo el nombre en tus notas/cotizaciones si prefieres."
},
{
  triggers: ["me recomiendas mensual o anual", "que me conviene mas"],
  reply: "Mensual si apenas vas a probarla, anual si ya la usas diario en el taller 👌"
},
{
  triggers: ["que pasa si cierro el chat", "cierro el chat"],
  reply: "No pasa nada, cuando lo abras otra vez sigo aquí 😎"
},
{
  triggers: ["quien hizo la app", "quien son ustedes","quien desarollo la app","quien hizo la app?", "quien son ustedes?","de donde son ustedes?","de donde son ustedes","quien la hizo","quien la iso?","quien la iso?","quien la creo?","quien la creo"],
  reply: "Es una app hecha en México 🇲🇽 pensada específicamente para alumineros, no es una app genérica."
},
{
  triggers: ["puedo pasar mis datos a mi hijo", "mi hijo la va a usar"],
  reply: "Sí, solo que si él entra con tu cuenta te va a sacar. Mejor que la use en el mismo dispositivo."
},
{
  triggers: ["puedo trabajar sin activar", "sin activar suscripcion"],
  reply: "No, hay que activarla primero. Una vez activada sí puedes trabajar sin internet."
},
{
  triggers: ["como cierro sesion si no me deja entrar", "no puedo cerrar sesion"],
  reply: "Dinos el correo con el que te registraste y te forzamos el cierre desde soporte 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},

// 👇 PEGAR ANTES DEL ÚLTIMO { triggers:["*"], reply:"Estoy aquí..." }

{ triggers: ["tengo dudas del pago", "explicame el pago", "no entiendo como se paga"], 
  reply: "El pago se hace dentro de la misma app usando el sistema seguro de Google Play. Tú eliges mensual ($279.99 MXN) o anual ($2,499 MXN) y Google hace el cobro con la tarjeta o método que ya tengas. No vemos tus datos bancarios, solo la confirmación de que pagaste."
},
{ triggers: ["me puedes explicar los planes otra vez", "no entendi los planes", "que diferencia hay de los planes"], 
  reply: "Los dos planes traen TODO: calculadoras, cotizador, base de datos, notas, respaldos. La diferencia es el tiempo: mensual es para ir probando y anual es para taller que ya decidió usarla diario. El anual termina saliendo más barato si la usas todo el año."
},
{ triggers: ["y si no tengo tarjeta", "no cuento con tarjeta", "puedo pagar en tienda"], 
  reply: "Depende de lo que tu Google Play tenga habilitado en tu país. Algunas cuentas dejan pagar con saldo, con tarjetas de regalo o hasta en tiendas. Revísalo en tu Play Store en ‘Pagos y suscripciones’. Si no te deja, escríbenos y vemos alternativa 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["me aparece pago rechazado", "no paso el cobro", "google no quiso cobrar"], 
  reply: "Ese rechazo lo hace Google o tu banco (tarjeta vencida, fondos insuficientes o seguridad). Intenta de nuevo, o agrega otro método en Play. Si sí te cobró y la app no se activó, mándanos la captura y la activamos manual ✅"
},
{ triggers: ["no quiero que se cobre solo", "quitar cobro automatico", "como desactivo renovacion"], 
  reply: "Ve a la app de <b>Google Play Store</b> → Pagos y suscripciones → AL Calculadora → Cancelar. Así terminas tu periodo pero NO se vuelve a cobrar."
},
{ triggers: ["que pasa si cancelo", "si cancelo pierdo todo", "si cancelo se borra"], 
  reply: "Si cancelas ya no se vuelve a cobrar en la siguiente fecha. Tu app se queda activa hasta el día que ya pagaste. Tus datos (precios, notas) NO se borran."
},
{ triggers: ["me equivoque de plan", "pague el que no queria", "compre el plan incorrecto"], 
  reply: "Pasa 😅. Envíanos la captura del pago y dinos cuál era el que querías. Si la compra es muy reciente podemos ayudarte a corregirlo."
},
{ triggers: ["como entro mas rapido", "quiero entrar sin escribir", "sin contraseña"], 
  reply: "Usa tu cuenta de Google para entrar. Es la forma más rápida y no tienes que acordarte de la contraseña cada vez 📲"
},
{ triggers: ["porque me pide una sola sesion", "no quiero que me saque del otro telefono"], 
  reply: "Lo hacemos así para que no compartan una sola suscripción entre varias personas y luego a ti te la bloquee Google. Si cambias de teléfono, cierra sesión en el anterior y listo."
},
{ triggers: ["tengo dos telefonos y una sola cuenta", "quiero usarlo en dos al mismo tiempo"], 
  reply: "No se puede usar <b>al mismo tiempo</b> en dos. Pero sí puedes ir cambiando: cierras sesión en uno → entras en el otro. Si ya no tienes el viejo, te la liberamos desde soporte."
},
{ triggers: ["me pide la hora cada rato", "ya la active y vuelve a pedirla", "porque insiste en la hora"], 
  reply: "La hora automática es parte del sistema de seguridad y de las suscripciones sin conexión. Si tu teléfono la desactiva o cambia de zona, la app te lo vuelve a pedir para validar que no haya truco 😉"
},
{ triggers: ["me puedes explicar lo del modo sin internet", "como es eso de sin internet"], 
  reply: "Cuando tú pagas y entras, la app guarda que sí tienes suscripción. Desde ahí puedes usar las calculadoras y tus precios aunque no haya wifi. Solo de vez en cuando te va a pedir conectarte para revalidar."
},
{ triggers: ["y si estoy trabajando en una obra sin señal", "mi taller no tiene internet", "trabajo sin wifi"], 
  reply: "Justo para eso está hecha AL Calculadora. Activas tu suscripción con internet y después puedes usarla donde no hay señal. Solo no dejes pasar demasiados días sin conectarte para que no se bloquee."
},
{ triggers: ["puedo usarla con mis propios descuentos", "yo manejo otros descuentos", "mi perfil descuenta diferente"], 
  reply: "Sí ✅ para eso está el <b>creador de fórmulas</b>. Ahí pones tus descuentos una sola vez y se quedan guardados. Así todos en tu taller van a calcular igual."
},
{ triggers: ["puedo tener varias formulas", "varias formulas para diferentes sistemas", "dos formas de calcular"], 
  reply: "Sí, puedes tener varias. Por ejemplo: una para ventana corrediza, otra para abatible y otra para un sistema especial que tú usas. Solo eliges cuál quieres usar en ese trabajo."
},
{ triggers: ["no encuentro donde meter los precios", "donde se meten los precios", "donde esta la base de datos"], 
  reply: "Entra a <b>Cotizador → Base de datos</b>. Ahí agregas perfiles, vidrios, herrajes, mano de obra y lo que vendas. Lo haces una sola vez y después solo actualizas."
},
{ triggers: ["se borran mis precios si la desinstalo", "pierdo lo que ya meti", "y si la quito"], 
  reply: "Si hiciste respaldo, no. Si no respaldaste y borras datos del teléfono, sí se pueden perder. Por eso te recomendamos respaldar cuando termines de meter tus precios."
},
{ triggers: ["que es respaldo", "para que respalda", "porque debo respaldar"], 
  reply: "El respaldo es una copia de seguridad de lo que ya configuraste (precios, notas, a veces tus fórmulas). Sirve para que, si cambias de teléfono, puedas recuperar todo sin volver a escribir."
},
{ triggers: ["ya hice respaldo, ahora que", "como recupero un respaldo", "como lo cargo"], 
  reply: "Cuando instales la app en otro teléfono o la abras de nuevo, inicia con la misma cuenta y usa la opción de cargar/restaurar respaldo. La app detecta que tienes uno y te lo deja traer."
},
{ triggers: ["puedo pasar mi respaldo a otro correo", "quiero usar otro gmail para el mismo respaldo"], 
  reply: "Por defecto el respaldo se queda asociado a la cuenta con la que lo hiciste. Si de verdad necesitas moverlo a otra cuenta, escríbenos y lo vemos manualmente 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["porque no tengo un plan gratis", "denme un mes gratis", "puedo probar sin pagar"], 
  reply: "No manejamos plan gratis porque la app ya incluye todo (calculadoras, cotizador, respaldo y soporte). Pero sí te dejamos entrar sin pagar para que veas la estructura y luego hagas el pago dentro de la app."
},
{ triggers: ["me pueden dar precio en dolares", "cuanto es en usd", "cuanto es en otra moneda"], 
  reply: "El precio base lo publicamos en <b>MXN</b>. Tu Google Play es el que hace la conversión según tu país y tu método de pago. Por eso en algunos países puede verse un poquito diferente."
},
{ triggers: ["quiero que mi trabajador no vea precios", "ocultar base de datos", "no quiero que se vea el costo"], 
  reply: "Lo que puedes hacer es que tú hagas y guardes los precios, y a tu trabajador le enseñes solo a usar las calculadoras. Así no toca la base de datos."
},
{ triggers: ["como hago una cotizacion completa", "pasos para cotizar", "no se cotizar aqui"], 
  reply: "1) Registra tus precios en Base de datos. 2) Entra al cotizador y selecciona lo que vas a instalar. 3) Agrega mano de obra o vidrio. 4) La app te da el total y lo mandas por Whats al cliente. Rápido y sin sacar calculadora."
},
{ triggers: ["como le mando la cotizacion al cliente", "compartir por whatsapp", "enviar presupuesto"], 
  reply: "Armas tu cotización en la app y después la copias/pegas en el Whats de tu cliente. Así le llega ordenada y con los conceptos claros."
},
{ triggers: ["puedo poner fotos en la nota", "agregar imagen", "adjuntar foto al cliente"], 
  reply: "Por ahora las notas son de texto para que sea rápido. Si necesitas enviar fotos, mándalas directo por tu Whats tradicional."
},
{ triggers: ["sirve para aluminio y vidrio", "trabajo vidrio y aluminio", "manejo los dos"], 
  reply: "Sí, muchos talleres la usan justo así: metal + vidrio. Meten en base de datos el vidrio que usan y lo llaman en el cotizador."
},
{ triggers: ["porque dice que mi suscripcion vencio si si pague", "me dice vencido pero pague", "marcado como vencido"], 
  reply: "Eso es que la app no recibió a tiempo el aviso de Google Play. Cierra la app, vuelve a abrir con internet. Si sigue igual, mándanos la captura del pago y te la activamos ✅"
},
{ triggers: ["que pasa si mi hijo la abre en su telefono", "mi hijo la abrio", "mi hijo la instalo"], 
  reply: "Si él entra con tu cuenta te va a sacar a ti. Por seguridad es 1 dispositivo. Solo cierra sesión en uno y entra en el otro."
},
{ triggers: ["me la puedes explicar facil", "dime que es en corto", "resumelo"], 
  reply: "Es una app para alumineros: pones medidas → te dice qué perfiles usar → cotizas → guardas precios → trabajas sin internet. Y todo se queda en tu cuenta."
},
{ triggers: ["como se si tengo la ultima version", "quiero la mas nueva", "quiero la version actual"], 
  reply: "Ve a tu Google Play Store y busca ‘AL Calculadora’. Si sale el botón ‘Actualizar’ dale clic. Si dice ‘Abrir’ ya tienes la última."
},
{ triggers: ["no aparece en mi play store", "no la encuentro en mi tienda", "no sale en la tienda"], 
  reply: "Puede ser por región o por versión de Android. Escríbenos con captura de pantalla y te ayudamos con el enlace directo 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["cual es su tiktok", "pasa el tiktok", "pasa tus redes"], 
  reply: "Claro 👉 <a href=\"https://www.tiktok.com/@josueftm?_t=ZS-90WoSvoBuIZ&_r=1\" style=\"color:#0F6FDC\">TikTok</a> y 👉 <a href=\"https://www.youtube.com/@ftherreriayaluminio\" style=\"color:#0F6FDC\">YouTube</a>."
},
{ triggers: ["no hay horarios de atencion", "a que hora contestan", "tardan en contestar"], 
  reply: "No tenemos horario fijo porque también andamos en campo, pero sí respondemos lo antes posible. Si es urgente, mándalo con ‘URGENTE’ al inicio."
},
{ triggers: ["porque pide permisos raros", "para que son los permisos", "no quiero dar permisos"], 
  reply: "Los permisos son para validar tu suscripción, permitir respaldos y manejar la hora automática. No usamos tu información para otra cosa."
},
{ triggers: ["que pasa si mi pago se regresa", "google me devolvio el pago", "reembolso"], 
  reply: "Si Play te hace reembolso, la app se bloquea porque entiende que ya no hay suscripción. Solo vuelve a pagar o escríbenos si fue por error."
},
{ triggers: ["tengo dos talleres", "uso dos sucursales", "tengo dos lugares"], 
  reply: "Puedes usar la misma app para tus dos talleres, solo organízalos en notas/cotizador y llama los precios que correspondan."
},
{ triggers: ["puedo usarla para enseñar a mis alumnos", "uso en cursos", "uso en capacitacion"], 
  reply: "Sí 👌 de hecho ayuda mucho a los que van empezando. Solo explícales que la suscripción es individual."
},
{ triggers: ["quiero que aparezca mi logo en las cotizaciones", "marca propia en cotizacion"], 
  reply: "Lo tenemos en lista de mejoras para que puedas personalizar un poco más la salida 👌"
},
{ triggers: ["ya actualice pero no veo lo nuevo", "no se ve la nueva funcion"], 
  reply: "Cierra la app por completo y vuelve a entrar. Algunas cosas nuevas se cargan al iniciar."
},
{ triggers: ["como pongo mano de obra por pieza", "mano de obra por unidad"], 
  reply: "Crea un ítem en base de datos que se llame ‘Mano de obra por pieza’ con su precio. Luego en el cotizador lo agregas las veces que ocupes."
},
{ triggers: ["como pongo mano de obra por m2", "cobro por metro cuadrado"], 
  reply: "Registra tu mano de obra como concepto por m² en la base de datos y ya la tendrás siempre disponible en el cotizador."
},
{ triggers: ["no abre el chat en el telefono", "en mi cel no carga el chat"], 
  reply: "Refresca la página o vuelve a abrir la app. Si tu internet está lento el chat puede tardar un poquito en mostrarse."
},
{ triggers: ["la puedo usar en una tablet vieja", "tablet antigua"], 
  reply: "Si esa tablet tiene Play Store y Android compatible, sí. Si no, probablemente no te deje instalar."
},
{ triggers: ["me pueden pasar un pdf", "manual en pdf"], 
  reply: "Lo que hacemos normalmente es mandarte video corto o instrucciones por Whats porque así es más rápido de seguir en el teléfono."
},
{ triggers: ["porque me dice dato no valido", "dato invalido", "no acepta el dato"], 
  reply: "Algunos campos solo aceptan números porque son medidas. Revisa que no lleves espacios o letras. Si sigue igual, mándanos captura."
},
{ triggers: ["me la puedes explicar como si fuera niño", "explicame facil porfa"], 
  reply: "Es una calculadora grande para aluminio: le dices cuánto mide la ventana y ella te dice qué cortar y cuánto cobrar. Eso es todo 😉"
},
{ triggers: ["como se si ya quedo pagada", "como confirmo mi pago", "como se que ya se activo"], 
  reply: "Después de pagar puedes volver a entrar a la app y ya no debería aparecerte el aviso de suscripción. Si todavía sale, es que Play no avisó y nos mandas captura."
},
{ triggers: ["que pasa si me roban el telefono", "perdi el telefono", "me lo robaron"], 
  reply: "Instálala en tu nuevo teléfono y entra con la misma cuenta. Si la cuenta quedó abierta en el equipo robado, te la liberamos desde soporte."
},
{ triggers: ["puedo usarla en mi negocio y en mi casa", "dos ubicaciones"], 
  reply: "Sí, pero recuerda que es 1 dispositivo a la vez. Puedes cerrar en uno y abrir en el otro las veces que quieras."
},
{ triggers: ["se puede imprimir", "quiero imprimir la cotizacion"], 
  reply: "La forma más fácil es mandarla a tu Whats/PC y desde ahí imprimir. En móvil casi nadie imprime directo."
},
{ triggers: ["me pueden dar soporte por llamada", "quiero llamada"], 
  reply: "Normalmente atendemos por Whats porque ahí puedes mandar capturas. Pero si se complica mucho, ahí mismo vemos otra forma."
},
{ triggers: ["puedo pagar con cuenta empresarial", "quiero que la empresa pague"], 
  reply: "Sí, siempre que la cuenta de Google Play de ese dispositivo tenga un método de pago. Si es empresa y quiere varias licencias, nos escribe."
},
{ triggers: ["me pide actualizar pero no quiero", "quiero quedarme en la version vieja"], 
  reply: "Algunas actualizaciones son obligatorias porque cambian cosas de seguridad o de suscripciones. Por eso te la pide."
},
{ triggers: ["no entiendo el cotizador general", "el cotizador me confunde"], 
  reply: "Piensa en el cotizador como una lista de todo lo que vas a usar en ese trabajo: perfiles + vidrio + mano de obra. Lo agregas y la app hace la suma."
},
{ triggers: ["como meto impuestos", "quiero agregar iva"], 
  reply: "Puedes agregar un concepto de ‘IVA’ o ‘Impuesto’ en tu cotización. Así no tienes que estarlo calculando afuera."
},
{ triggers: ["por que aparece en azul el soporte", "porque ese link azul"], 
  reply: "Lo ponemos en azul para que puedas tocarlo y abrir Whats directo. Así no tienes que copiar y pegar."
},
{ triggers: ["me pueden avisar de mejoras", "quiero saber cuando la actualicen"], 
  reply: "Sí, cuando nos escribes por Whats ya te podemos avisar cuando salga algo nuevo 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["como se cuanto me falta para que se venza", "fecha de vencimiento", "cuando se vence"], 
  reply: "La fecha la lleva Google Play en tu cuenta de compras. Ahí puedes ver el próximo cobro o la fecha de corte."
},
{ triggers: ["porque no puedo pagar desde mi pc", "quiero pagar en la compu"], 
  reply: "El pago está pensado para hacerse desde el dispositivo donde usas la app porque así Play la vincula a ese teléfono."
},
{ triggers: ["puedo tener dos bases de datos", "una base para puertas y otra para ventanas"], 
  reply: "Puedes organizarlo dentro de la misma base usando nombres claros (ej. ‘PUERTA – perfil 1’, ‘VENTANA – perfil 2’). Así no te haces bolas."
},
{ triggers: ["la puedo usar en una empresa grande", "tenemos varios instaladores"], 
  reply: "Sí, pero ahí sí conviene que nos escribas para no estar liberando cuentas cada rato y dejar un esquema más cómodo para ustedes."
},
{ triggers: ["trae ejemplos ya cargados", "trae datos de ejemplo"], 
  reply: "Trae la estructura lista, pero los precios los metes tú para que reflejen tu zona y tu proveedor."
},
{ triggers: ["no encuentro el boton de cerrar sesion", "no veo cerrar sesion"], 
  reply: "Está en el área de configuración/engranes ⚙️. Si no lo ves en tu versión, mándanos captura."
},
{ triggers: ["porque me pide internet si ya pague", "ya pague y pide internet"], 
  reply: "Porque de vez en cuando tiene que confirmar con el servidor que tu suscripción sigue vigente. Es normal."
},
{ triggers: ["cuantos dispositivos puedo usar", "limite de dispositivos"], 
  reply: "1 activo a la vez. Si activas en otro, te saca del primero."
},
{ triggers: ["me puedes decir todo lo que incluye", "lista de funciones"], 
  reply: "Incluye: calculadoras de aluminio, creador de fórmulas, base de datos de precios, cotizador, notas, respaldo y soporte por Whats. Todo en un mismo pago."
},
{ triggers: ["como hago respaldo manual", "quiero hacer copia manual"], 
  reply: "Entra a la parte de respaldo/copia y lánzalo cuando tengas internet. No te tarda casi nada."
},
{ triggers: ["que pasa si respaldo sin internet", "no tengo internet pero quiero respaldar"], 
  reply: "El respaldo en la nube sí necesita internet. Si no tienes, puedes ir trabajando normal y respaldar cuando regreses al wifi."
},
{ triggers: ["sirve para vender", "la puedo usar para vender"], 
  reply: "Sí, te ayuda a tener precios claros y responderle rápido al cliente. Eso te da mucha ventaja cuando el cliente anda comparando."
},
{ triggers: ["puedo mover la app a la sd", "pasarla a memoria externa"], 
  reply: "La mayoría de apps de este tipo se queda en memoria interna para funcionar bien. Mejor deja que Android la administre."
},
{ triggers: ["me pueden dar una capacitacion", "quiero que me la expliquen por videollamada"], 
  reply: "Lo más rápido es que nos mandes tus dudas al Whats y te la vamos resolviendo punto por punto. Así no tienes que esperar a una videollamada."
},
{ triggers: ["como cambio de usuario", "quiero entrar con otra cuenta"], 
  reply: "Cierra sesión en el engrane y vuelve a entrar con el otro correo. Recuerda que la suscripción queda donde la pagaste."
},
{ triggers: ["me sale pantalla en blanco despues de pagar", "pague y no carga"], 
  reply: "Cierra la app por completo y vuelve a abrir con internet. Si sigue, mándanos captura del pago y de la pantalla."
},
{ triggers: ["puedo pedir funciones especiales", "quiero que le pongan algo solo para mi"], 
  reply: "Las funciones las metemos por prioridad de los usuarios. Pero sí puedes proponérnosla y la evaluamos 👍"
},
{ triggers: ["porque no trae anuncios", "no hay publicidad"], 
  reply: "Porque es una herramienta de trabajo. Preferimos que la experiencia sea limpia y sin anuncios molestando."
},
{ triggers: ["la puedo usar para pasarle informacion a mi administrativo", "compartir con oficina"], 
  reply: "Sí, haces la cotización o la nota y se la mandas por el canal que usen en tu taller (Whats, correo, etc.)."
},
{ triggers: ["como se que mis datos estan seguros", "privacidad de datos"], 
  reply: "Solo usamos tus datos para identificar tu cuenta y tu suscripción. No vendemos ni compartimos tu información."
},
{ triggers: ["no quiero que salga mi telefono", "quitar numero"], 
  reply: "Puedes no poner tu teléfono en tus notas si no quieres. La app no lo publica en ningún lado."
},
{ triggers: ["que pasa si se va la luz", "si se apaga mi telefono"], 
  reply: "No pasa nada, cuando encienda vuelves a abrir la app y sigues donde estabas."
},
{ triggers: ["como paso de mensual a anual", "quiero subir a anual"], 
  reply: "Haz el cambio al final de tu periodo o avísanos para ayudarte. Google Play hace el ajuste."
},
{ triggers: ["tienen grupo para ideas", "donde pido funciones"], 
  reply: "Lo más directo es que nos las mandes por Whats y ahí las vamos apuntando 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["me puedes recordar cuanto cuesta", "recordame el precio"], 
  reply: "Claro: <b>$279.99 MXN mensual</b> y <b>$2,499 MXN anual</b>. Incluye todas las funciones."
},
{ triggers: ["puedo pagar por año y despues por mes", "cambiar de anual a mensual"], 
  reply: "Sí, pero lo ideal es esperar a que termine tu periodo anual para no perder lo que ya pagaste."
},
{ triggers: ["puedo meter varias obras en un mismo dia", "varios trabajos en un dia"], 
  reply: "Sí, la app no te cobra por uso. Pagas la suscripción y trabajas lo que necesites."
},
{ triggers: ["porque dice que no tengo permiso", "permiso denegado"], 
  reply: "A veces pasa cuando no se descargó bien la versión. Cierra, vuelve a abrir con internet o reinstala."
},
{ triggers: ["me puedes pasar el link corto", "link directo corto"], 
  reply: "Te atendemos directo aquí 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["me gusto mucho la app", "esta bien padre la app"], 
  reply: "Gracias 🙌 la estamos haciendo pensando justo en los alumineros que trabajan diario y no quieren estar haciendo cuentas a mano."
},
{ triggers: ["quiero vender la app a mis clientes", "puedo recomendarla"], 
  reply: "Claro que sí, recomiéndala sin problema. Cada quien descarga y paga su suscripción en su Play Store."
},
{ triggers: ["no tengo play por que es un telefono chino", "telefono sin play"], 
  reply: "Escríbenos y vemos si tu modelo tiene alguna forma de instalarla 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["tienen planes para escuelas", "uso educativo"], 
  reply: "Mándanos el número de alumnos y lo vemos. La app sí ayuda a enseñar los cálculos."
},
{ triggers: ["puedo usarla en modo vertical solamente", "no quiero girar"], 
  reply: "Sí, está pensada para vertical. Así cabe mejor en el teléfono."
},
{ triggers: ["se ve raro mi boton de chat", "no se ve como el tuyo"], 
  reply: "Puede ser el navegador o el tema oscuro. Actualiza la página o prueba en Chrome."
},
{ triggers: ["no quiero que mis respaldos se borren", "seguridad de respaldos"], 
  reply: "Si los haces con tu cuenta y no la borras, los respaldos se quedan ahí para cuando los necesites."
},
{ triggers: ["como guardo mis clientes frecuentes", "clientes frecuentes"], 
  reply: "Úsalas notas o pon cada cliente como una cotización guardada. Así lo vuelves a abrir y solo cambias lo que ocupes."
},
{ triggers: ["me puedes decir las redes otra vez", "pasa tus redes de nuevo"], 
  reply: "TikTok 👉 <a href=\"https://www.tiktok.com/@josueftm?_t=ZS-90WoSvoBuIZ&_r=1\" style=\"color:#0F6FDC\">@josueftm</a> y YouTube 👉 <a href=\"https://www.youtube.com/@ftherreriayaluminio\" style=\"color:#0F6FDC\">FT Herrería y Aluminio</a>."
},
{ triggers: ["si la instalo en el cel de mi esposa y luego en el mio", "dos personas misma cuenta"], 
  reply: "Se puede, pero una a la vez. Si ella entra te saca a ti. Cierra sesión cuando cambies de equipo."
},
{ triggers: ["porque a veces me pide otra vez la sesion", "me saca cada cierto tiempo"], 
  reply: "Es por seguridad o porque se actualizó. Solo vuelve a entrar y listo."
},
{ triggers: ["quiero mover la app a otro correo", "cambiar propietario"], 
  reply: "Dinos el correo actual y el nuevo, y lo revisamos manualmente."
},
{ triggers: ["se ve diferente al video que vi", "no es igual al que me enseñaron"], 
  reply: "Puede que estés viendo una versión más nueva. Dime qué no te aparece y te digo dónde está ahora."
},
{ triggers: ["puedo usarla con teclado fisico", "teclado bluetooth"], 
  reply: "Sí, la app acepta el teclado que tenga tu Android 👍"
},
{ triggers: ["me pueden mandar las instrucciones por whats", "malo para leer aqui"], 
  reply: "Claro 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>. Te lo mandamos más resumido."
},
{ triggers: ["porque no aparece mi pais", "soy de otro pais y no sale"], 
  reply: "El precio base está en MXN. Google Play lo adapta según tu país. Si no te deja, nos escribes."
},
{ triggers: ["tengo un problema distinto", "no es nada de lo que dices", "otro problema"], 
  reply: "Cuéntame con detalle qué te está pasando (qué botón tocaste y qué mensaje te salió) y te lo armo a la medida."
},
{ triggers: ["como agrego perfiles de linea española", "linea española"], 
  reply: "Dinos exactamente qué serie de línea española ocupas y la agregamos o te decimos cómo dejarla guardada."
},
{ triggers: ["como agrego serie 50", "serie 50"], 
  reply: "La serie 50 la puedes manejar con tus fórmulas o con la parte de base de datos. Si quieres pantalla de aviso como la que ya tienes en la app, nos la pides."
},
{ triggers: ["puedo usarlo para calcular puertas pesadas", "puertas grandes"], 
  reply: "Sí, pero ahí sí es importante meter tus medidas tal cual, porque a veces las series cambian. Si tienes dudas nos mandas foto/medida."
},
{ triggers: ["que pasa si me marca que no hay suscripcion", "suscripcion no valida"], 
  reply: "Solo vuelve a abrir con internet. Si no se quita, mándanos tu captura de pago y la reactivamos."
},
{ triggers: ["si pago hoy cuenta desde hoy", "cuando empieza a contar"], 
  reply: "Sí, cuenta desde el momento en que Google Play aprueba tu pago."
},
{ triggers: ["si me equivoco de nota se puede recuperar", "recuperar nota"], 
  reply: "Si la borraste del todo ya no. Pero puedes respaldar seguido para no perder nada."
},
{ triggers: ["como le puedo hacer para que mis muchachos no borren nada", "proteger mis datos"], 
  reply: "Lo ideal es que solo tú tengas el teléfono o la cuenta principal. A tus muchachos dales las medidas o la cotización ya hecha."
},
{ triggers: ["hay forma de que solo calcule y no vea precios", "modo calculadora"], 
  reply: "Ahorita no hay un ‘modo solo cálculo’, pero puedes decirle que no entre a la parte de base de datos."
},
{ triggers: ["porque me sale mensaje en rojo", "mensaje rojo"], 
  reply: "Es un aviso de validación (dato mal puesto, suscripción vencida, hora desactivada). Lee el mensaje y haz lo que te pide. Si no se quita, nos mandas captura."
},
{ triggers: ["me puedes pasar todo en una lista", "resumen de todo"], 
  reply: "La app hace: 1) cálculo de perfiles, 2) fórmulas personalizadas, 3) base de datos de precios, 4) cotizador, 5) notas, 6) respaldo, 7) soporte por Whats. Con eso ya trabajas completo."
},
{ triggers: ["me pueden dar soporte si no pago", "sin pagar dan soporte"], 
  reply: "Sí te podemos orientar para que puedas entrar y pagar. Ya soporte avanzado sí es para usuarios activos 👍"
},
{ triggers: ["me puedes explicar que es el engrane", "para que es el engrane"], 
  reply: "El engrane ⚙️ es donde están las opciones de cuenta, suscripción y a veces cerrar sesión. Si te atoras, entra ahí."
},
{ triggers: ["me pueden hacer el calculo ustedes", "hazme un calculo rapido"], 
  reply: "La idea es que tú puedas hacerlo directo en la app. Pero si es algo raro nos mandas las medidas y te decimos si entra."
},
{ triggers: ["puedo ponerle nombre a mis cotizaciones", "ordenar cotizaciones"], 
  reply: "Sí, es buena práctica ponerle nombre: ‘Cliente Juan’, ‘Puerta patio’, ‘Obra escuela’, etc. Así las ubicas rápido."
},
{ triggers: ["si uso una tablet y un cel a la vez que pasa", "dos dispositivos al mismo tiempo"], 
  reply: "Te va a sacar de uno. Está diseñado para 1 activo a la vez."
},
{ triggers: ["como envio mi error", "donde te mando la captura"], 
  reply: "Mándala al Whats 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a> y dinos qué estabas haciendo."
},
{ triggers: ["por que se ve blanco despues de actualizar", "despues de actualizar no sale nada"], 
  reply: "A veces el navegador o el teléfono guarda la versión vieja. Cierra todo y vuelve a abrir. Si no, reinstala."
},
{ triggers: ["como entro a la parte de suscripcion", "no encuentro suscripcion"], 
  reply: "Está en el menú o en el engrane ⚙️. Ahí te aparece para activar o renovar."
},
{ triggers: ["me la puedes resumir a mi cliente", "quiero decirle al cliente que uso esta app"], 
  reply: "Dile así: “Uso AL Calculadora, es una app profesional para aluminio, con esto te saco la cotización más precisa y sin errores.” Queda bien 😉"
},
{ triggers: ["si reinstalo pierdo mi sesion", "reinstale y ya no me deja"], 
  reply: "Solo vuelve a entrar con la misma cuenta. Si ya no te acuerdas con cuál entraste, nos escribes."
},
{ triggers: ["como meto mis series importadas", "series especiales"], 
  reply: "Mándanos el nombre, foto o cómo las calculas y te ayudamos a dejarlas listas para que no lo hagas cada vez."
},
{ triggers: ["sirve para puertas plegadizas", "corredizas especiales"], 
  reply: "Sí, pero esas a veces llevan fórmula distinta. Nos mandas medidas y te decimos cómo dejarla guardada."
},
{ triggers: ["si trabajo con precios de dolar", "aluminio a dolar"], 
  reply: "Mete tus precios ya convertidos a la moneda con la que cobras. La app te respeta ese precio."
},
{ triggers: ["puedo mandar a imprimir un reporte", "reporte de trabajos"], 
  reply: "Hazlo desde la información que ya tienes en la app: la mandas a correo/Whats y desde tu compu la imprimes."
},
{ triggers: ["tienen algun numero fijo", "quiero llamar a oficina"], 
  reply: "El canal principal es Whats porque ahí vemos capturas y videos. Escríbenos ahí primero 👍"
},
{ triggers: ["como se si ya se respaldo", "comprobar respaldo"], 
  reply: "Si la app te dijo que se hizo el respaldo y estabas con internet, ya quedó. Para estar seguro, entra otra vez y revisa que puedas cargar."
},
{ triggers: ["se puede bloquear por no pagar", "se bloquea solo"], 
  reply: "Sí, cuando termina el periodo y no se paga, la app se protege y se bloquea. Es normal."
},
{ triggers: ["me pueden dar soporte fuera de mexico", "soy de otro pais y tengo problema"], 
  reply: "Sí, te atendemos igual por Whats. Solo dinos tu país para entender tu forma de pago."
},
{ triggers: ["como se si me va a volver a cobrar", "checar renovacion"], 
  reply: "En tu Google Play Store → Pagos y suscripciones → AL Calculadora → ahí te dice si está activa la renovación."
},
{ triggers: ["la puedo usar en modo avion", "sin señal del todo"], 
  reply: "Si tu suscripción ya está validada, sí. Solo recuerda conectarte de vez en cuando."
},
{ triggers: ["me la puedes dar mas resumida", "respuesta mas corta"], 
  reply: "Es una app para alumineros: calcula, cotiza, guarda y trabaja sin internet. Se paga por mes o por año dentro de la app."
},
{ triggers: ["que pasa si bajo la version", "instale otra version"], 
  reply: "Puede que no funcione bien la parte de suscripción. Mejor quédate en la última."
},
{ triggers: ["como paso mis notas a otro telefono", "mover notas"], 
  reply: "Con el respaldo. Haz respaldo en el viejo → instala en el nuevo → entra con la misma cuenta → carga respaldo."
},
{ triggers: ["puedo tener una cuenta personal y otra del taller", "dos cuentas distintas"], 
  reply: "Sí, solo cierra sesión cuando cambies. Cada cuenta lleva sus datos y su suscripción."
},
{ triggers: ["como entro si no recuerdo nada", "olvide todo"], 
  reply: "Mándanos tu nombre y, si tienes, capturas de la app. Con eso vemos qué correo usabas 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{ triggers: ["yo no soy el dueño de la cuenta", "me la compartieron y se bloqueo"], 
  reply: "Pídele al dueño que cierre sesión en su teléfono o nos autorice para liberar tu acceso."
},
{ triggers: ["como se si mis datos se guardan cada 24h", "guardado automatico"], 
  reply: "La app intenta guardar cada cierto tiempo cuando ve internet. Pero si traes datos muy importantes, respáldalos manualmente."
},
{ triggers: ["puedo usarla en un telefono prestado", "telefono de un amigo"], 
  reply: "Sí, pero cuando lo dejes tendrás que cerrar sesión ahí para que puedas entrar en el tuyo."
},
{ triggers: ["que pasa si la abro en 3 telefonos", "varios telefonos"], 
  reply: "Te va a ir sacando de los anteriores. Solo 1 activo a la vez."
},
{ triggers: ["puedo usarla para cobrar mas rapido", "agilizar cobro"], 
  reply: "Sí, porque ya no andas calculando a mano. Le das el precio al cliente en el momento y así no se te va con otro."
},
{ triggers: ["me puedes mandar las ligas sin colores", "sin azul"], 
  reply: "Claro: Whats soporte 👉 https://wa.me/522721917499  · TikTok 👉 https://www.tiktok.com/@josueftm?_t=ZS-90WoSvoBuIZ&_r=1  · YouTube 👉 https://www.youtube.com/@ftherreriayaluminio"
},
{ triggers: ["tienen telegram", "otro canal"], 
  reply: "El canal principal es Whats. Si necesitas otro, dinos y lo vemos."
},
{ triggers: ["no me aparece el boton de comprar", "no veo el boton"], 
  reply: "Actualiza la app, cierra y vuelve a abrir. Si no, mándanos captura para ver qué pantalla tienes."
},
{ triggers: ["como se si mi respaldo esta en la nube", "respaldo en nube"], 
  reply: "Si lo hiciste conectado y la app no te marcó error, está en la nube listo para que lo traigas."
},
{ triggers: ["por que es mejor que excel", "diferencia con excel"], 
  reply: "Porque aquí ya está todo pensado para aluminio, en español, en el teléfono y con respaldo. En Excel tú armas todo y se puede borrar más fácil."
},
{ triggers: ["si la app falla me regresan mi dinero", "reembolso por falla"], 
  reply: "Las devoluciones las maneja Google Play según sus políticas. Pero si fue un fallo nuestro, nos mandas captura y lo resolvemos."
},
{ triggers: ["puedo pagar solo una semana", "pago por dias"], 
  reply: "No, los periodos son mensual o anual."
},
{ triggers: ["esta app es tuya", "quien creo al calculadora"], 
  reply: "Es un proyecto hecho en México pensado específicamente para alumineros. Por eso trae justo lo que usan ustedes."
},
{ triggers: ["como hago que no se vea el icono azul", "quitar icono al"], 
  reply: "El ícono azul es identidad de la app y se queda así 😊"
},
{ triggers: ["me puedes dar los datos para mi ficha tecnica", "descripcion de la app"], 
  reply: "AL Calculadora: app móvil para aluminería que calcula perfiles, permite crear fórmulas propias, cotizar trabajos, guardar precios y trabajar sin conexión. Pago mensual/anual vía Google Play."
},
{ triggers: ["se escucha raro el texto que manda", "respuesta rara"], 
  reply: "Cuéntame cuál para afinarla. La idea es que el bot siempre te hable como soporte de AL."
},
{ triggers: ["puedo hacer cuentas de otro material", "no es aluminio lo mio"], 
  reply: "Sí, puedes usar el cotizador y las notas igual. Solo pon tus materiales en la base de datos."
},
{
  triggers: ["prueba de respuesta", "test de respuesta"],
  reply: "Prueba recibida ✅. El bot está respondiendo. Si quieres que hable de otra forma, cambiamos el texto."
},

{
  triggers: ["wow", "woow", "wooow", "woww"],
  reply: "😄 ¡Me alegra que te sorprenda! Si quieres te muestro también cómo activar la suscripción o dónde meter tus precios."
},
{
  triggers: ["increible", "increíble", "que increible", "super increible"],
  reply: "🤩 Gracias, la idea es justo que el aluminero trabaje más rápido y sin errores."
},
{
  triggers: ["genial", "que genial", "super genial"],
  reply: "🙌 Qué bueno que te gustó. ¿Quieres que te pase el link de descarga o el Whats de soporte?"
},
{
  triggers: ["excelente", "exelente", "muy bien", "super bien"],
  reply: "🔥 Excelente entonces. Si ya la tienes instalada, el siguiente paso es activar tu suscripción dentro de la app."
},
{
  triggers: ["orale", "órale", "orale que bien"],
  reply: "😎 ¡Órale! Así ya no tienes que andar sacando cuentas a mano cada vez."
},
{
  triggers: ["que padre", "super padre", "muy padre"],
  reply: "🥳 Gracias. La fuimos armando justo con lo que pedían los alumineros."
},
{
  triggers: ["me encanto", "me encantó", "me gusto mucho"],
  reply: "💙 Qué chido leer eso. Guárdanos en favoritos y si ocupas ayuda nos escribes."
},
{
  triggers: ["que chevere", "chévere", "super chevere"],
  reply: "😄 ¡Chévere! Funciona igual en cualquier país, tú solo metes tus precios."
},
{
  triggers: ["no inventes", "no manches", "neta", "neta que si"],
  reply: "😂 Sí, sí se puede hacer todo eso dentro de la app. Y sin internet después."
},
{
  triggers: ["uff", "ufff", "uff que bien"],
  reply: "😌 Uff, lo logramos. ¿Te paso el Whats por si te atoras en otra parte?"
},
{
  triggers: ["bien", "muy bien", "perfecto", "super"],
  reply: "✅ Perfecto. Entonces ya nada más activa la hora automática si te la pide."
},
{
  triggers: ["brutal", "esta brutal", "esta perron", "esta perrón"],
  reply: "🐺 Jajaja gracias. Y todavía le vamos a ir metiendo más calculadoras."
},
{
  triggers: ["me sirvio", "me sirvió", "si me ayudo"],
  reply: "🙌 Qué bueno que sí te sirvió. Si quieres hacemos otra para tus notas o cotizaciones."
},
{
  triggers: ["ya vi", "ya entendi", "ya quedó", "ya kedo"],
  reply: "👌 Buenísimo. Si luego quieres cambiar de teléfono, solo cierra sesión en el anterior."
},
{
  triggers: ["esta cool", "esta chido", "esta chida", "esta buena"],
  reply: "😎 Gracias. Recuerda que el pago es dentro de la app para que quede ligado a tu cuenta."
},
{
  triggers: ["que rapido", "super rapido", "rapidisimo"],
  reply: "⚡ Así es la idea: que en taller no pierdas tiempo. Metes alto/ancho y listo."
},
{
  triggers: ["me sorprende", "sorprendente", "que sorpresa"],
  reply: "🤖 A muchos les sorprende que sí funcione sin internet después de activar. Pero sí, está pensado así."
},
{
  triggers: ["me gusta", "si me gusta", "esta bien"],
  reply: "💪 Qué bueno. Si quieres te paso el enlace de soporte 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["buen trabajo", "muy buen trabajo", "gracias buen trabajo"],
  reply: "🙏 Gracias a ti por usarla. Tú dinos qué más te gustaría que haga la app."
},
{
  triggers: ["eso era", "era lo que queria", "justo eso"],
  reply: "🟦 Exacto. Si luego quieres que responda en modo ‘soporte’, le vamos metiendo más frases."
},
{
  triggers: ["nice", "muy nice", "nicee"],
  reply: "😄 Gracias. Si quieres automatizamos también la respuesta de ‘no puedo pagar’."
},
{
  triggers: ["re bien", "recontra bien", "de lujo"],
  reply: "💎 De lujo entonces. Asegúrate de tener la hora automática activa y no se te bloquea."
},
{
  triggers: ["10 de 10", "10/10", "100%", "al 100"],
  reply: "💯 Gracias por el 10/10. Te dejo el Whats por si ocupas 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: ["perfectisimo", "perrfecto", "perf"],
  reply: "👌 Quedó. Ahora sí ya puedes seguir metiendo tus precios."
},
{
  triggers: ["muy completo", "super completo", "bastante completo"],
  reply: "📦 La idea es que no tengas que andar con libretas. Todo en la app."
},
{
  triggers: ["que buena respuesta", "así si", "esa era"],
  reply: "😌 Me da gusto. Te puedo dar también las de ‘no puedo entrar’, ‘me bloqueo’ y ‘no tengo internet’."
},
{
  triggers: ["que buena app", "app chida", "esta muy buena la app"],
  reply: "📱 Gracias 🙌. Y recuerda: si no pagas en fecha, solo la reactivas desde la app."
},
{
  triggers: ["me solucionaste", "ya quedo resuelto", "resuelto"],
  reply: "🧩 Resuelto entonces. Si te vuelve a pasar con otro usuario, ya tienes qué contestar."
},
{
  triggers: ["buen bot", "que buen bot", "si sirve el bot"],
  reply: "🤖 Gracias. Y lo chido es que todo está dentro del JS, sin n8n esta vez 😏."
},
{
  triggers: ["jajaja", "jajaja gracias", "jaja si"],
  reply: "😂 Jajaja. Si te late le puedo meter respuestas más ‘humanas’ para que no se vea robótico."
},
{
  triggers: ["que alivio", "menos mal", "ya estaba preocupado"],
  reply: "🫂 Todo bien. Si era por la hora automática, eso lo pide seguido para que no se truene la suscripción."
},
{
  triggers: ["esta clarisimo", "clarisimo", "super claro"],
  reply: "📝 Perfecto. Cualquier cosa rara que te pregunten tus usuarios la podemos meter como trigger."
},
{
  triggers: ["ya entendi todo", "ya comprendi", "ya se como"],
  reply: "✅ Buenísimo. Si quieres ahora lo hacemos para ‘no me aparece en Play’."
},
{
  triggers: ["que buena onda", "que buena atencion", "buen servicio"],
  reply: "🙋‍♂️ Gracias. Así también les contestará a tus usuarios cuando lo publiques."
},
{
  triggers: ["me ahorra tiempo", "super practico", "muy util"],
  reply: "⏱️ Esa es la idea: menos tiempo en cuentas, más tiempo trabajando o cotizando."
},
{
  triggers: ["superioor", "superior", "pro"],
  reply: "🛠️ Herramienta de taller tenía que ser. Nada de apps medias."
},
{
  triggers: ["impresionante", "impresionante la verdad"],
  reply: "🤩 Gracias. Y todavía se le puede meter la parte de ‘no tengo sesión libre’."
},
{
  triggers: ["mas que bien", "mas que perfecto"],
  reply: "🙌 Entonces ya nomás cuida que no entren dos al mismo tiempo con la misma cuenta."
},
{
  triggers: ["que bien explicado", "explicado clarito", "buenas explicaciones"],
  reply: "🗣️ Si quieres también te preparo las respuestas de ‘soy de otro país’, ‘no me aparece el precio’ y ‘se bloqueó sola’."
},
{
  triggers: ["esa respuesta me gusto", "esa me sirve", "esa si sirve"],
  reply: "📩 Guárdala así tal cual en tu JS y la puedes copiar para otras preguntas."
},
{
  triggers: ["me dejaste sin palabras", "sin palabras", "wow sin palabras"],
  reply: "😄 Jajaja. Si después quieres que el bot pregunte ‘¿quieres que te pase el Whats?’, también se puede."
},
{
  triggers: ["maravilloso", "es una maravilla", "que maravilla"],
  reply: "✨ Gracias. Está hecha para los que sí trabajan aluminio todos los días."
},
{
  triggers: ["que buena solucion", "solucion perfecta"],
  reply: "🧠 La dejamos así porque es fácil de mantener: solo agregas otro objeto al arreglo."
},
{
  triggers: ["esta muy claro ahora", "ya quedo claro"],
  reply: "👌 Cualquier texto que quieras que salga en azul se lo ponemos con el `<a style=\"color:#0F6FDC\">` que estás usando."
},
{
  triggers: ["esta bien explicado para el cliente", "esto le puedo mandar al cliente"],
  reply: "📲 Exacto. Puedes copiar la respuesta y pegársela al cliente directo en Whats."
},
{
  triggers: ["se siente profesional", "muy profesional"],
  reply: "🧰 Esa era la intención, que no se vea como chat genérico."
},
{
  triggers: ["me gusto el tono", "buen tono", "sonaste bien"],
  reply: "😎 Lo dejamos en tono cercano, de taller, pero sin perder lo serio de la suscripción."
},
{
  triggers: ["ya con eso", "con eso basta", "listo gracias"],
  reply: "🙌 Va, cualquier otra cosa me escribes aquí y la metemos al bot."
},
{
  triggers: ["esta padrisimo", "padrísimo", "re padrisimo"],
  reply: "🥳 Gracias. Guárdalo y no olvides dejar hasta abajo el fallback."
},
{
  triggers: ["que rapidez de respuesta", "rapidito contestaste"],
  reply: "⚡ Así quedará en tu página: respuestas rápidas sin esperar al servidor."
},
{
  triggers: ["lo lograste", "si se pudo", "al fin"],
  reply: "🎉 ¡Al fin! Ahora sí ya no dependes de n8n para estas preguntas frecuentes."
},

{
  triggers: [
    "ya pague y no me deja entrar",
    "ya pagué y no me deja entrar",
    "pague y no entra",
    "pague pero no tengo acceso",
    "pague hace rato y no me deja"
  ],
  reply: "Perfecto, gracias por pagar 🙌. Normalmente la activación es inmediata. Haz esto: 1) Cierra la app por completo. 2) Vuelve a abrirla con internet y con la hora automática activada. 3) Si cambiaste de teléfono o tenías sesión en otro, cierra sesión allá. 4) Si después de 5 min sigue igual, mándanos tu nombre/correo y la activamos manual 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: [
    "y si aun asi no me deja",
    "ya hice eso y no me deja",
    "ya active la hora y no me deja",
    "ya cierre sesion y no me deja",
    "sigue sin dejarme entrar"
  ],
  reply: "Entonces ya es un caso para verlo nosotros 🔎. A veces Google Play tarda en avisar o el dispositivo quedó ‘atorado’. Mándanos captura del pago + correo con el que entraste y lo liberamos desde nuestro lado 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: [
    "cuanto tarda en activarse",
    "despues de pagar cuanto tarda",
    "cuanto tiempo tarda en reflejar",
    "cuando se activa mi plan"
  ],
  reply: "El plan se activa casi al instante ⏱️. Solo que la primera vez tienes que volver a abrir la app con internet para que se sincronice. Si pasan más de 5 minutos y sigue bloqueada, nos mandas captura y la activamos a mano."
},
{
  triggers: [
    "quiero cambiar de plan",
    "cambiar de mensual a anual",
    "cambiar de anual a mensual",
    "como cambio de plan"
  ],
  reply: "Sí puedes cambiar de plan ✅. Lo mejor es: 1) cancela el plan actual en Play para que no se vuelva a cobrar, 2) espera a que llegue tu fecha de fin, 3) entras a la app y eliges el nuevo plan. Si lo necesitas antes de la fecha, nos escribes y te ayudamos."
},
{
  triggers: [
    "ya pague pero dice suscripcion vencida",
    "pague pero sigue vencida",
    "me dice vencida y ya pague"
  ],
  reply: "Eso pasa cuando la app no pudo validar la fecha (por hora manual o por falta de internet). Activa hora automática, abre con internet y debería quitarse. Si no se quita, nos mandas captura y la reparamos nosotros 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: [
    "no quiero esperar",
    "lo necesito ya",
    "urge que lo activen",
    "necesito activacion inmediata"
  ],
  reply: "Sin problema 👍. Mándanos tu comprobante de pago y correo y te lo activamos manual en cuanto lo veamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: [
    "porque se bloquea si ya pague",
    "ya pague porque se bloqueo",
    "porque me lo bloqueo"
  ],
  reply: "La app se protege cuando no puede comprobar la fecha o cuando ve que la cuenta está abierta en otro equipo. No significa que hayas perdido el pago. Solo hay que sincronizar (internet + hora automática) o que te la liberemos nosotros."
},
{
  triggers: ["quien hizo la app","quien iso la app","quien la iso", "quien son ustedes","quien son ustedes","quien hizo la app?", "quien son ustedes?","de donde son ustedes?","de donde son ustedes","quien la hizo","quien la iso?","quien la iso?","quien la creo?","quien la creo"],
  reply: "Es una app hecha en México 🇲🇽 pensada específicamente para alumineros, no es una app genérica."
},
{
  triggers: [
    "me cambiaron de telefono",
    "cambie de telefono y no entra",
    "telefono nuevo no deja entrar"
  ],
  reply: "Cuando cambias de teléfono, la cuenta queda ocupada en el anterior 📱. Entra al teléfono viejo y cierra sesión. Si ya no lo tienes, dinos y la liberamos 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
},
{
  triggers: [
    "pague pero no sale el plan",
    "no me aparece el plan",
    "no se refleja mi compra"
  ],
  reply: "Casi siempre es que Play no envió la confirmación. Vuelve a abrir con internet y espera un minuto. Si sigue igual, mándanos captura del cobro y lo registramos manual ✅."
},
{
  triggers: [
    "porque me pide hora automatica despues de pagar",
    "pague y me pide hora automatica"
  ],
  reply: "Porque la hora automática es la forma en que la app sabe que tu suscripción sigue vigente y no cambiaste la fecha del teléfono. Solo actívala y vuelve a abrir."
},




    {
      triggers: ["*"],
      reply: "Estoy aquí para ayudarte con toda la información relacionada con <b>AL Calculadora</b>. Si lo que necesitas es más específico (activar cuenta, liberar dispositivo o revisar un cobro) mándanos mensaje directo 👉 <a href=\"https://wa.me/522721917499\" style=\"color:#0F6FDC\">Soporte de AL</a>."
    }
  ];

  function addMessage(text, who){
    const row = document.createElement('div');
    row.className = 'al-msg ' + (who === 'you' ? 'you' : 'bot');
    const b = document.createElement('div');
    b.className = 'al-bubble';

    if (who === 'bot') {
      b.innerHTML = text;
    } else {
      b.textContent = text;
    }

    row.appendChild(b);
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }







  // === motor de coincidencia por palabras ===
function getBotReply(userText) {
  const t = (userText || "").toLowerCase().trim();

  let bestFaq = null;
  let bestScore = 0;

  for (const faq of FAQS) {
    for (const trigRaw of faq.triggers) {
      const trig = (trigRaw || "").toLowerCase().trim();
      if (!trig || trig === "*") continue;

      // 1) coincidencia exacta: prioridad máxima
      if (t.includes(trig)) {
        return faq.reply;
      }

      // 2) coincidencia parcial por palabras
      const words = trig.split(/\s+/);
      let score = 0;
      for (const w of words) {
        if (w && t.includes(w)) score++;
      }

      if (score > bestScore) {
        bestScore = score;
        bestFaq = faq;
      }
    }
  }

  if (bestFaq && bestScore > 0) {
    return bestFaq.reply;
  }

  // fallback (tu último objeto con "*")
  const fall = FAQS.find(f => f.triggers && f.triggers.includes("*"));
  return fall ? fall.reply : "Estoy aquí para ayudarte con AL Calculadora. 😉";}






    










  


  async function send(){
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'you');
    input.value = '';

    if (typing) typing.hidden = false;

    setTimeout(() => {
      const reply = getBotReply(text);
      addMessage(reply, 'bot');
      if (typing) typing.hidden = true;
    }, 250);
  }

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  addMessage("¡Hola! 👋 Soy el asistente de <b>AL Calculadora</b>. ¿Qué quieres saber?", "bot");
})();

// --- FIX forzado: reemplazar cualquier salvavidas por el SVG de soporte ---
(function forceSupportIcon(){
  const svgo = `
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"
         fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 11a7 7 0 0 1 14 0"/>
      <rect x="3" y="11" width="3.2" height="5" rx="1.6"/>
      <rect x="17.8" y="11" width="3.2" height="5" rx="1.6"/>
      <circle cx="12" cy="10" r="3.2"/>
      <path d="M7 20a5 5 0 0 1 10 0"/>
      <path d="M17 15.5h1.2a2 2 0 0 0 2-2"/>
      <circle cx="20.2" cy="13.5" r="0.5"/>
    </svg>`;
  document.querySelectorAll('.btn-support-outline .ico').forEach(el => {
    el.innerHTML = svgo;
    el.style.fontSize = '0';
    el.style.lineHeight = '0';
  });
})();

// === Carrusel para todos los <div class="phone__screen"> ===
(() => {
  const screens = document.querySelectorAll('.phone__screen');
  if (!screens.length) return;

  const INTERVAL = 4000; // 4s por slide (ajusta a gusto)

  screens.forEach((screen) => {
    const slides = Array.from(screen.querySelectorAll('.screen-img'));
    if (slides.length <= 1) return;

    // Asegura estado inicial
    let i = slides.findIndex(s => s.classList.contains('is-visible'));
    if (i < 0) { slides[0].classList.add('is-visible'); i = 0; }

    setInterval(() => {
      slides[i].classList.remove('is-visible');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-visible');
    }, INTERVAL);
  });
})();



