'use client';

import { useState } from 'react';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    question: "What is the native token of Celo?",
    options: ["CELO", "ETH", "BTC"],
    answer: "CELO"
  },
  {
    question: "Which language is used for writing smart contracts?",
    options: ["Rust", "Solidity", "Python"],
    answer: "Solidity"
  },
  {
    question: "Where does a Farcaster MiniApp run?",
    options: ["Inside Farcaster Clients", "On-chain", "In Discord"],
    answer: "Inside Farcaster Clients"
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === questions[current].answer) setScore(score + 1);
    const next = current + 1;
    if (next < questions.length) setCurrent(next);
    else setShowScore(true);
  };

  return (
    <main style={{ padding: 20 }}>
      {showScore ? (
        <div>
          <h2>Your score: {score}/{questions.length}</h2>
          <p>🎉 Great job! (Smart contract reward goes here)</p>
        </div>
      ) : (
        <div>
          <h3>{questions[current].question}</h3>
          {questions[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              style={{ display: 'block', margin: '8px 0', padding: '10px' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
