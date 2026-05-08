// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
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
      
      // If we have an API key, we could call an external AI here (e.g. OpenAI or Gemini)
      // Example for Gemini/OpenAI placeholder:
      // if (apiKey) {
      //   const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', { ... })
      // }

      // Based on your code: Fallback to the local generation logic
      const sentences = note.subject.split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
      const questions: any[] = [];

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

      const quizData = {
        noteId: note.id,
        noteTitle: note.title,
        notePreview: note.subject.substring(0, 80) + (note.subject.length > 80 ? '...' : ''),
        questions,
      };

      return new Response(JSON.stringify({ quiz: quizData, usedApiKey: !!apiKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (action === 'transcribe-audio') {
      // If we have an API key, we could call an external AI here (e.g. OpenAI Whisper)
      // Example for Whisper placeholder:
      // if (apiKey) {
      //   const aiResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', { ... })
      // }

      // Based on your code: Fallback to the local mock logic
      const transcribedText = "This is simulated transcribed speech from the voice recording. Secure edge function handled the request.";
      return new Response(JSON.stringify({ text: transcribedText, usedApiKey: !!apiKey }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
})
