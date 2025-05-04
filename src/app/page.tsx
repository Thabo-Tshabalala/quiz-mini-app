'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ClaimFrame from '../frames/claim';  // Update the path to the correct location
import './globals.css';

declare global {
  interface Window {
    ethereum?: import('@metamask/providers').MetaMaskInpageProvider;
  }
}

const QuizRewardABI = [
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'string', name: 'tokenURI', type: 'string' },
    ],
    name: 'rewardUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const questions = [
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
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questions>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const contractAddress = '0xmycontractaddress'; 

  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrent(0);
    setScore(0);
    setShowScore(false);
  }, []);

  const rewardUserNFT = async (userAddress: string, tokenURI: string) => {
    const ethereum = window.ethereum;
    if (!ethereum) {
      console.error('Please install MetaMask!');
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, QuizRewardABI, signer);

    try {
      const tx = await contract.rewardUser(userAddress, tokenURI);
      await tx.wait();
      console.log('User rewarded with NFT:', tx);
    } catch (error) {
      console.error('Error rewarding user:', error);
    }
  };

  const handleAnswer = async (option: string) => {
    if (selected) return;
    setSelected(option);

    if (option === shuffledQuestions[current].answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);
      const next = current + 1;
      if (next < shuffledQuestions.length) setCurrent(next);
      else setShowScore(true);
    }, 1000);
  };

  const claimReward = async () => {
    if (score < 2) {
      console.log('You need at least 2 correct answers to claim the reward.');
      return;
    }

    const tokenURI = 'ipfs://QmXgk49t7k6uPZT5FvryzxfS9D5rcQhGbLVysSyD7w9jw4';

    const ethereum = window.ethereum;
    if (!ethereum) {
      alert('MetaMask is not installed! Please download MetaMask from https://metamask.io/');
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    if (!accounts || accounts.length === 0) {
      console.error('No accounts found!');
      return;
    }

    await rewardUserNFT(accounts[0], tokenURI);
  };

  const getButtonClass = (option: string) => {
    if (!selected) return 'bg-white hover:bg-blue-100 text-gray-800 border-gray-300';
    if (option === shuffledQuestions[current].answer) return 'bg-green-500 text-white border-green-600';
    if (option === selected) return 'bg-red-400 text-white border-red-500';
    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  const restartQuiz = () => {
    const reshuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(reshuffled);
    setCurrent(0);
    setScore(0);
    setShowScore(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-800 flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 border border-blue-100">
        {shuffledQuestions.length > 0 && (
          showScore ? (
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-3 text-gray-800">🎉 All Done!</h2>
              <p className="text-lg text-gray-700 mb-2">
                You scored <strong>{score}</strong> out of {shuffledQuestions.length}
              </p>
              {score >= 2 ? (
                <>
                  <p className="text-sm text-green-600 font-medium">🏆 Reward eligible —</p>
                  <button
                    onClick={claimReward}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
                  >
                    Claim Reward
                  </button>
                  {/* Show the ClaimFrame when the user qualifies for the reward */}
                  <ClaimFrame userName="John Doe" tokenURI="ipfs://QmXgk49t7k6uPZT5FvryzxfS9D5rcQhGbLVysSyD7w9jw4" />
                </>
              ) : (
                <p className="text-sm text-red-600 font-medium mt-4">
                  ❌ You need at least 2 correct answers to claim the reward.
                </p>
              )}
              <button
                onClick={restartQuiz}
                className="mt-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300"
              >
                Restart Quiz
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-500 font-medium">
                Question {current + 1} of {shuffledQuestions.length}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {shuffledQuestions[current].question}
              </h3>
              <div className="flex flex-col gap-4">
                {shuffledQuestions[current].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`transition duration-300 px-5 py-3 rounded-xl font-medium border text-left shadow-sm ${getButtonClass(opt)}`}
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
                      width: `${((current + (selected ? 1 : 0)) / shuffledQuestions.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  Progress: {Math.round(((current + (selected ? 1 : 0)) / shuffledQuestions.length) * 100)}%
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
