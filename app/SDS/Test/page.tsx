"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type Question = {
  id: number;
  text: string;
  dimension: string;
};

type Answer = {
  questionId: number;
  selectedOption: string;
};

export default function SDSTest() {
  const searchParams = useSearchParams();
  const questionCount = searchParams.get("type");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [scores, setScores] = useState({
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionCount) return;

      try {
        const response = await fetch(`/api/sds?type=${questionCount}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch questions: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.length !== parseInt(questionCount)) {
          throw new Error(
            `Received ${data.length} questions, expected ${questionCount}`
          );
        }

        const shuffledQuestions = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load questions"
        );
      }
    };
    fetchQuestions();
  }, [questionCount]);

  // 初始化时打印初始得分
  useEffect(() => {
    console.log("Initial scores:", scores);
  }, [scores]); // 添加 scores 作为依赖

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

      // 如果之前选择了"是"，现在要减去这个分数
      if (existingAnswer?.selectedOption === "是") {
        newScores[dimension as keyof typeof newScores] -= 1;
      }

      // 如果现在选择了"是"，则加1分
      if (selectedOption === "是" && dimension in newScores) {
        newScores[dimension as keyof typeof newScores] += 1;
      }

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
    }
  };

  const calculateResult = () => {
    // 跳转到结果页面并传递参数
    const queryParams = new URLSearchParams({
      R: scores.R.toString(),
      I: scores.I.toString(),
      A: scores.A.toString(),
      S: scores.S.toString(),
      E: scores.E.toString(),
      C: scores.C.toString(),
      q: questions.length.toString(),
    });

    window.location.href = `/SDS/Result?${queryParams.toString()}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen overflow-hidden">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!questions.length)
    return (
      <div className="flex items-center justify-center min-h-screen overflow-hidden">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center pt-[5vh] md:pt-[15vh] p-4 gap-4">
      {/* 提示框 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-800 mb-2">测试说明</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>根据第一印象作答，无需过度思考</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  无需纠结对错或优劣，选择&quot;是&quot;或&quot;否&quot;即可
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>不必考虑是否应该选择什么，而是根据自己的想法选择</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>系统将分析答案生成个性化职业兴趣报告</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full max-w-2xl mb-4 bg-blue-600 text-white rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="badge badge-ghost px-2">
            <p>答题进度</p>
          </div>
          <div className="flex-1 h-2 bg-blue-300 rounded-full">
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
        {/* 问题内容 */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          {currentQuestion?.text}
        </h2>

        {/* 选项 - 修改为蓝黄配色 */}
        <div className="grid grid-cols-2 gap-4">
          {["是", "否"].map((option) => (
            <button
              key={option}
              onClick={() =>
                handleOptionClick(
                  currentQuestion.id,
                  option,
                  currentQuestion.dimension
                )
              }
              className={`btn justify-center text-lg h-16 transition-all
                ${
                  currentAnswer?.selectedOption === option
                    ? option === "是"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="mt-8 space-y-4">
          {currentQuestionIndex > 0 && (
            <button
              onClick={handlePreviousQuestion}
              className="btn btn-outline w-full h-16 text-lg bg-white hover:bg-blue-50 border-blue-600 text-blue-800"
            >
              上一题
            </button>
          )}
          {currentQuestionIndex === questions.length - 1 &&
            answers.length === questions.length && (
              <button
                onClick={calculateResult}
                className="btn btn-primary w-full h-16 text-lg bg-blue-600 hover:bg-blue-700"
              >
                查看结果
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
