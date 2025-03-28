"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("english");
  const [targetLang, setTargetLang] = useState("spanish");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { value: "english", label: "English" },
    { value: "spanish", label: "Spanish" },
    { value: "french", label: "French" },
    { value: "german", label: "German" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("https://translate-api.rcovar00.workers.dev/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          source_lang: sourceLang,
          target_lang: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslatedText(data.translated_text || "Translation not available");
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Failed to translate"}`);
      setTranslatedText("");
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <h1 className="text-3xl font-bold mb-8">Text Translator</h1>
      
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <div className="w-full sm:w-5/12">
            <label htmlFor="sourceLang" className="block text-sm font-medium mb-1">
              Source Language
            </label>
            <select
              id="sourceLang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              {languages.map((lang) => (
                <option key={`source-${lang.value}`} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={swapLanguages}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          
          <div className="w-full sm:w-5/12">
            <label htmlFor="targetLang" className="block text-sm font-medium mb-1">
              Target Language
            </label>
            <select
              id="targetLang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              {languages.map((lang) => (
                <option key={`target-${lang.value}`} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium mb-1">
              Input Text
            </label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate"
              className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="translatedText" className="block text-sm font-medium mb-1">
              Translated Text
            </label>
            <textarea
              id="translatedText"
              value={translatedText}
              readOnly
              placeholder="Translation will appear here"
              className="w-full h-40 p-3 border border-gray-300 rounded-md resize-none bg-white dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Translating..." : "Translate"}
          </button>
        </div>
      </div>
    </main>
  );
}
