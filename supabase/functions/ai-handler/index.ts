// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
// @ts-ignore
import { corsHeaders } from '../_shared/cors.ts'

declare const Deno: any;

async function generateQuizWithGroq(note: any, apiKey: string) {
  const prompt = `
    You are an AI educational assistant. Generate a high-quality quiz based on the following note:
    Title: ${note.title}
    Content: ${note.subject}

    Requirements:
    - Generate exactly 5 questions.
    - 3 Multiple Choice Questions (type: "multiple_choice") with 4 options (A, B, C, D).
    - 2 Identification Questions (type: "identification").
    - The output MUST be a valid JSON object.
    - Identification questions should have a concise correctAnswer.

    JSON Structure:
    {
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "Question text?",
          "options": [
            {"label": "A", "text": "Option A"},
            {"label": "B", "text": "Option B"},
            {"label": "C", "text": "Option C"},
            {"label": "D", "text": "Option D"}
          ],
          "correctAnswer": "Option A"
        },
        {
          "id": "q4",
          "type": "identification",
          "question": "Question text?",
          "correctAnswer": "Exact Answer"
        }
      ]
    }
    Return ONLY the JSON. No preamble or explanation.
  `;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errorData}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Robust JSON parsing (handles potential markdown blocks if response_format fails)
  const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(jsonStr);
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload } = await req.json()
    
    // Securely get the API key from environment variables
    const apiKey = Deno.env.get('API_KEY');

    if (action === 'generate-quiz') {
      const { note } = payload;
      
      let questions: any[] = [];
      let usedAI = false;

      if (apiKey) {
        try {
          const aiQuiz = await generateQuizWithGroq(note, apiKey);
          questions = aiQuiz.questions;
          usedAI = true;
        } catch (aiErr) {
          console.error("AI Generation failed, falling back to mock logic:", aiErr);
        }
      }

      // Fallback to local generation logic if AI fails or no API key
      if (questions.length === 0) {
        const sentences = note.subject.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
        
        sentences.slice(0, 3).forEach((sentence: string, i: number) => {
          const words = sentence.trim().split(' ').filter((w: string) => w.length > 3);
          if (words.length < 3) return;
          const answerWord = words[Math.floor(words.length / 2)];
          const question = sentence.replace(answerWord, '______').trim();

          questions.push({
            id: `mc-${i}`,
            type: 'multiple_choice',
            question: `Fill in the blank: "${question}"`,
            options: [
              { label: 'A', text: answerWord },
              { label: 'B', text: words[0] || 'Option B' },
              { label: 'C', text: words[words.length - 1] || 'Option C' },
              { label: 'D', text: words[1] || 'Option D' },
            ],
            correctAnswer: answerWord,
          });
        });

        sentences.slice(3, 5).forEach((sentence: string, i: number) => {
          const words = sentence.trim().split(' ').filter((w: string) => w.length > 3);
          if (words.length < 2) return;
          const answerWord = words[0];
          const question = sentence.replace(answerWord, '______').trim();

          questions.push({
            id: `id-${i}`,
            type: 'identification',
            question: `Identify: "${question}"`,
            correctAnswer: answerWord,
          });
        });

        if (questions.length < 3) {
          questions.push({
            id: `mc-fallback-1`,
            type: 'multiple_choice',
            question: `What is the main topic of the note titled "${note.title}"?`,
            options: [
              { label: 'A', text: note.title },
              { label: 'B', text: 'Mathematics' },
              { label: 'C', text: 'History' },
              { label: 'D', text: 'Science' },
            ],
            correctAnswer: note.title,
          });
        }
      }

      const quizData = {
        noteId: note.id,
        noteTitle: note.title,
        notePreview: note.subject.substring(0, 80) + (note.subject.length > 80 ? '...' : ''),
        questions,
      };

      return new Response(JSON.stringify({ quiz: quizData, usedApiKey: usedAI }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (action === 'transcribe-audio') {
      // Mock for now, could integrate Groq Whisper here too
      const transcribedText = "This is simulated transcribed speech from the voice recording. Secure edge function handled the request.";
      return new Response(JSON.stringify({ text: transcribedText, usedApiKey: !!apiKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
})

