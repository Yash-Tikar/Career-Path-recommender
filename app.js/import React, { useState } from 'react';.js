import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Lightbulb, ClipboardCheck } from 'lucide-react';

const questions = [
  { id: 1, q: "When solving a problem, do you prefer:", options: ["Data & Logic", "People's Feelings", "Creative Ideas", "Building things"], trait: ["Analytical", "Social", "Creative", "Technical"] },
  { id: 2, q: "Which project sounds more exciting?", options: ["Designing a Logo", "Coding an App", "Managing a Team", "Writing a Report"], trait: ["Creative", "Technical", "Social", "Analytical"] },
  // Add 4 more similar questions here
];

export default function CareerApp() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ skills: '', interests: '' });
  const [scores, setScores] = useState({ Analytical: 0, Creative: 0, Social: 0, Technical: 0 });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnswer = (trait) => {
    setScores({ ...scores, [trait]: scores[trait] + 1 });
    if (step < questions.length + 1) setStep(step + 1);
    else getRecommendation();
  };

  const getRecommendation = async () => {
    setLoading(true);
    setStep('loading');
    
    const prompt = `User Skills: ${formData.skills}. Interests: ${formData.interests}. 
    Aptitude: ${JSON.stringify(scores)}. Recommend 1 Career Path, Why, and a 3-step Roadmap. 
    Format: Use Markdown with Bold headers.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      setResult(data.candidates[0].content.parts[0].text);
      setStep('result');
    } catch (e) {
      setResult("Error connecting to Gemini. Check your API Key.");
      setStep('result');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Sparkles size={20}/></div>
          <h1 className="text-xl font-bold text-slate-800">CareerPath AI</h1>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome!</h2>
            <p className="text-slate-500 mb-6">Let's find your perfect career path.</p>
            <input 
              className="w-full p-4 bg-slate-100 rounded-2xl mb-4 focus:ring-2 ring-blue-500 outline-none" 
              placeholder="Your Skills (e.g. Math, Art)"
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
            <input 
              className="w-full p-4 bg-slate-100 rounded-2xl mb-6 focus:ring-2 ring-blue-500 outline-none" 
              placeholder="Your Interests (e.g. Tech, Music)"
              onChange={(e) => setFormData({...formData, interests: e.target.value})}
            />
            <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">Continue</button>
          </div>
        )}

        {/* Step 2: Aptitude Test */}
        {step > 1 && step <= questions.length + 1 && (
          <div className="animate-in slide-in-from-right duration-300">
            <span className="text-blue-600 font-bold text-sm uppercase tracking-widest">Question {step - 1} of 6</span>
            <h2 className="text-xl font-bold mt-2 mb-6">{questions[step-2].q}</h2>
            <div className="space-y-3">
              {questions[step-2].options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(questions[step-2].trait[i])}
                  className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {step === 'loading' && (
          <div className="text-center py-10">
            <div className="animate-bounce mb-4 text-blue-600"><BrainCircuit size={48} className="mx-auto"/></div>
            <p className="text-slate-600 font-medium">Gemini is analyzing your future...</p>
          </div>
        )}

        {/* Result State */}
        {step === 'result' && (
          <div className="animate-in zoom-in duration-500">
            <div className="bg-green-50 text-green-700 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <ClipboardCheck /> <span className="font-bold">Recommendation Ready!</span>
            </div>
            <div className="text-slate-700 whitespace-pre-line text-sm leading-relaxed">
              {result}
            </div>
            <button onClick={() => window.location.reload()} className="w-full mt-8 text-slate-400 text-sm font-medium">Retake Test</button>
          </div>
        )}
      </div>
    </div>
  );
}