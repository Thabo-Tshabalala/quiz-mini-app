'use client';
import './globals.css'; // Or wherever your globals.css file is

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    question: 'What is the native token of Celo?',
    options: ['CELO', 'ETH', 'BTC'],
    answer: 'CELO',
  },
  {
    question: 'Which language is used for writing smart contracts?',
    options: ['Rust', 'Solidity', 'Python'],
    answer: 'Solidity',
  },
  {
    question: 'Where does a Farcaster MiniApp run?',
    options: ['Inside Farcaster Clients', 'On-chain', 'In Discord'],
    answer: 'Inside Farcaster Clients',
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleAnswer = async (option: string) => {
    if (selected) return; // Prevent re-answering
    setSelected(option);

    if (option === questions[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelected(null);
      const next = current + 1;
      if (next < questions.length) setCurrent(next);
      else setShowScore(true); // Show score when all questions are done
    }, 1000);
  };

  const getButtonClass = (option: string) => {
    if (!selected)
      return 'bg-white hover:bg-blue-100 text-gray-800 border-gray-300';
    if (option === questions[current].answer)
      return 'bg-green-500 text-white border-green-600';
    if (option === selected)
      return 'bg-red-400 text-white border-red-500';
    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-bold mb-3 text-gray-800">🎉 All Done!</h2>
              <p className="text-lg text-gray-700 mb-2">
                You scored <strong>{score}</strong> out of {questions.length}
              </p>
              <p className="text-sm text-green-600 font-medium">
                🏆 Reward eligible — hook smart contract here!
              </p>
              <button
                onClick={() => location.reload()}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
              >
                Play Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 text-sm text-gray-500 font-medium">
                Question {current + 1} of {questions.length}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {questions[current].question}
              </h3>

              <div className="flex flex-col gap-4">
                {questions[current].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`transition duration-300 px-5 py-3 rounded-xl font-medium border text-left shadow-sm ${getButtonClass(
                      opt
                    )}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-3 transition-all duration-300"
                    style={{
                      width: `${
                        ((current + (selected ? 1 : 0)) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  Progress: {Math.round(((current + (selected ? 1 : 0)) / questions.length) * 100)}%
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
