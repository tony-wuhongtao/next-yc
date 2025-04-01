"use client";
import { useState, useEffect } from "react";

type Question = {
  id: number;
  text: string;
  options: { text: string; dimension: string }[];
};

type Answer = {
  questionId: number;
  selectedOption: string;
};

export default function MBTITest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [scores, setScores] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });

  // 从API获取题目并随机排序
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/api/mbtiTest70");
      const data = await response.json();
      const shuffledQuestions = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
    };
    fetchQuestions();
  }, []);

  // 初始化时打印初始得分
  useEffect(() => {
    console.log("Initial scores:", scores);
  }, []);

  const handleOptionClick = (
    questionId: number,
    selectedOption: string,
    dimension: string
  ) => {
    const existingAnswer = answers.find((a) => a.questionId === questionId);
    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questionId),
      { questionId, selectedOption },
    ];
    setAnswers(newAnswers);

    setScores((prev) => {
      const newScores = { ...prev };

      if (existingAnswer) {
        const currentQuestion = questions.find((q) => q.id === questionId);
        if (currentQuestion) {
          const prevOption = currentQuestion.options.find(
            (opt) => opt.text === existingAnswer.selectedOption
          );
          if (prevOption) {
            newScores[prevOption.dimension] -= 1;
          }
        }
      }

      newScores[dimension] += 1;
      console.log("Current scores:", newScores);
      return newScores;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      console.log("Moving to previous question. Current scores:", scores);
    }
  };

  const calculateResult = () => {
    console.log("Final scores:", scores);
    // 这里可以添加显示结果的逻辑
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  if (!questions.length)
    return (
      <div className="flex items-center justify-center min-h-screen overflow-hidden">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center pt-[15vh] md:pt-[25vh] p-4 gap-4">
      {/* 进度条 */}
      <div className="w-full max-w-2xl mb-4 bg-green-600 text-white rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="badge badge-ghost">
            <p>答题进度</p>
          </div>
          <div className="flex-1 h-2 bg-green-300 rounded-full">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="badge badge-outline">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
      </div>

      {/* 问题卡片 */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* 提示 */}
        <div className="mb-6 text-green-800">
          <b>选择您更倾向的答案</b>
          <br />
          <small>不要过多思考，靠第一感觉选择</small>
        </div>

        {/* 问题内容 */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {currentQuestion.text}
        </h2>

        {/* 选项 */}
        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() =>
                handleOptionClick(
                  currentQuestion.id,
                  option.text,
                  option.dimension
                )
              }
              className={`btn justify-start text-lg h-16 transition-all
                ${
                  currentAnswer?.selectedOption === option.text
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`}
            >
              <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center mr-4">
                {String.fromCharCode(65 + index)}
              </span>
              {option.text}
            </button>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="mt-8 space-y-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePreviousQuestion}
              className="btn btn-outline w-full h-16 text-lg bg-white hover:bg-green-50 border-green-600 text-green-800"
            >
              上一题
            </button>
          )}
          {currentQuestionIndex === questions.length - 1 &&
            answers.length === questions.length && (
              <button
                onClick={calculateResult}
                className="btn btn-primary w-full h-16 text-lg"
              >
                查看结果
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
