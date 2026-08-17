import { NextResponse } from "next/server";
import { evaluateApplication } from "@/lib/ai/evaluate-application";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { answers } = body

        if(!answers){
            return NextResponse.json(
                {error: "Faltan las respuestas del formulario"},
                {status: 400}
            )
        }

        const evaluation = await evaluateApplication(answers)

        return NextResponse.json (
            {
                success: true,
                evaluation
            },
            {status: 200}
        )
    } catch(error){
        console.error("Error al evaluar la aplicacion:", error)

        return NextResponse.json(
            {error: "Ocurrio un error al evaluar la aplicacion"},
            {status: 500}
        )
    }
}