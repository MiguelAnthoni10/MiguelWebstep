/* ==========================================================================
   /api/chat.js — Función serverless (Vercel)
   --------------------------------------------------------------------------
   Este archivo NO se ejecuta en el navegador. Vercel lo convierte
   automáticamente en un endpoint: POST /api/chat

   Aquí (y SOLO aquí) vive la clave secreta de Gemini, leída desde una
   variable de entorno (GEMINI_API_KEY) configurada en el panel de Vercel.
   El navegador del usuario nunca ve esta clave.

   No usa ninguna librería externa (usa "fetch", que ya viene incluido
   en el entorno de Vercel), así que no hace falta instalar nada con npm
   para que esta función funcione.
   ========================================================================== */

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Falta configurar GEMINI_API_KEY en las variables de entorno de Vercel."
    });
    return;
  }

  try {
    const { messages, lang, context } = req.body || {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Falta 'messages' (debe ser un arreglo con al menos un mensaje)." });
      return;
    }

    // Convertimos los mensajes al formato que espera Gemini
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 4000) }] // límite de seguridad por mensaje
    }));

    const esQuechua = lang === "qu";
    const instruccionIdioma = esQuechua
      ? `El usuario tiene la interfaz en QUECHUA (Runasimi). Responde de forma fluida, cálida y respetuosa en Quechua sureño (Cusco-Collao). Los nombres oficiales de trámites, documentos u oficinas (como "DNI", "RUC", "Licencia de Funcionamiento", "Mesa de Partes") se mantienen en español dentro de la oración, porque así los va a encontrar el usuario en la municipalidad. No traduzcas la respuesta completa al español después; responde directamente y solo en Quechua.`
      : `El usuario tiene la interfaz en ESPAÑOL. Responde en español claro, sencillo y cercano, sin jerga legal innecesaria. Puedes usar ocasionalmente una palabra amable en quechua (como "Allillanchu" - ¿cómo estás?, "Sulpayki" - gracias) para dar calidez, pero la respuesta principal debe estar en español para que sea clara y ágil.`;

    const contextoTramites = typeof context === "string" && context.trim()
      ? context.trim()
      : "(No se recibió información de trámites desde la aplicación.)";

    const systemInstruction = `Eres el asistente virtual de "Pushaq-IA", un prototipo educativo que orienta a los ciudadanos de Casma (Áncash, Perú) sobre trámites municipales frecuentes.

TU OBJETIVO:
Ayudar a personas de todas las edades (especialmente adultos de 50 a 70 años) a entender qué necesitan para realizar un trámite municipal, con un tono cálido, paciente y claro.

INFORMACIÓN OFICIAL DE LOS TRÁMITES QUE CUBRE ESTA APP (única fuente de verdad — no inventes datos que no estén aquí):
${contextoTramites}

REGLAS DE IDIOMA:
${instruccionIdioma}

REGLAS DE FORMATO (usa markdown simple, se muestra formateado en la app):
- Usa **negrita** para nombres de trámites, requisitos clave, costos o plazos importantes.
- Usa "### " al inicio de una línea para un subtítulo corto, si ayuda a organizar la respuesta.
- Usa "- " al inicio de una línea para listas de requisitos o pasos.
- Da respuestas breves y ordenadas. No satures con texto corrido.

REGLAS DE COMPORTAMIENTO:
- Si la pregunta es sobre uno de los trámites listados arriba, responde con esa información exacta.
- Si preguntan por un trámite que NO está en la lista (por ejemplo, trámites de RENIEC o de otras entidades), acláralo amablemente e indica que ese trámite no lo cubre esta guía, pero orienta de forma general si puedes.
- Si te saludan, responde el saludo con calidez antes de continuar.
- Si preguntan algo totalmente fuera de tema, recuérdales amablemente que eres el asistente de trámites municipales de Pushaq-IA.
- Nunca inventes costos, plazos o requisitos que no estén en la información oficial de arriba.`;

    const body = {
      contents,
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: { temperature: 0.5, maxOutputTokens: 800 }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Error de la API de Gemini:", data);
      res.status(502).json({ error: "No se pudo obtener respuesta de la IA. Intenta de nuevo en un momento." });
      return;
    }

    const textoRespuesta =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Disculpa, no pude generar una respuesta. ¿Puedes reformular tu pregunta?";

    res.status(200).json({ response: textoRespuesta });
  } catch (err) {
    console.error("Error en /api/chat:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}
