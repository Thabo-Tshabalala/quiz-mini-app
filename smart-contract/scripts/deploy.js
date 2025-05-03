import hardhat from "hardhat";
const { ethers } = hardhat;


async function main() {
  const QuizReward = await ethers.getContractFactory("QuizReward");
  const quizReward = await QuizReward.deploy();

  console.log(`✅ QuizReward deployed to: ${await quizReward.getAddress()}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});