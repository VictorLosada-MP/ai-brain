import { openai } from "./client";
import { APPLICATION_EVALUATOR_PROMPT } from "./promps/application"

// Tipo que le dice a typescript como debe lucir en resultado que esperamos de la IA
type EvaluationResult = {
    resumen_ejecutivo: string,
    señales_positivas: string,
    señales_de_riesgo: string,
    nivel_de_fit: "Alto" | "Medio" | "Bajo",
    justificacion_fit: string,
    decision: "Aprobado" | "Rechazadp",
    justificacion_desicion: string
}

// PREPARAMOS EL MENSAJE QUE LE VAMOS A ENVIAR A LA IA

export async function evaluateApplication(answers: Record<string, any>) {
    const userMessage = `
  Aquí están las respuestas del formulario de aplicación:
  
  ${JSON.stringify(answers, null, 2)} 

  Analiza estas respuestas según tus instrucciones.
  `;
  
    // 2. Llamamos a la IA
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo rápido y económico
      messages: [
        {
          role: "system",
          content: APPLICATION_EVALUATOR_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      response_format: { type: "json_object" }, // Obligamos a que responda en JSON
      temperature: 0.3, // Bajo para que sea más consistente
    });
  
    // 3. Extraemos el contenido de la respuesta y validamos 
    const content = response.choices[0].message.content;
  
    if (!content) {
      throw new Error("La IA no devolvió ninguna respuesta");
    }
  
    // 4. Convertimos el texto JSON en un objeto de JavaScript
    const result: EvaluationResult = JSON.parse(content);
  
    return result;
  }