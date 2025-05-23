"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const questionCount = searchParams.get("questionCount");

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

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionCount) return;

      try {
        const response = await fetch(`/api/mbtiTest?type=${questionCount}`);

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

  const handleCircleClick = (
    questionId: number,
    dimensionA: string,
    dimensionB: string,
    weight: number
  ) => {
    const existingAnswer = answers.find((a) => a.questionId === questionId);

    // 如果点击的是同一个答案，直接跳到下一题
    if (existingAnswer?.selectedOption === weight.toString()) {
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 100);
      }
      return;
    }

    const newAnswers = [
      ...answers.filter((a) => a.questionId !== questionId),
      { questionId, selectedOption: weight.toString() },
    ];
    setAnswers(newAnswers);

    setScores((prev) => {
      const newScores = { ...prev };

      // 清除原有答案的积分
      if (existingAnswer) {
        const prevWeight = parseFloat(existingAnswer.selectedOption);
        // 减去原有答案的积分
        newScores[dimensionA as keyof typeof newScores] -= prevWeight;
        newScores[dimensionB as keyof typeof newScores] -= 1 - prevWeight;
      }

      // 计算新的分数
      const scoreA = weight;
      const scoreB = 1 - weight;

      if (dimensionA in newScores) {
        newScores[dimensionA as keyof typeof newScores] += scoreA;
      }
      if (dimensionB in newScores) {
        newScores[dimensionB as keyof typeof newScores] += scoreB;
      }

      console.log("Current scores:", newScores);
      return newScores;
    });

    // 只有在不是最后一题时才进入下一题
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 100);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      console.log("Moving to previous question. Current scores:", scores);
    }
  };

  const calculateResult = () => {
    // 计算最终类型
    const type = [
      scores.I > scores.E ? "I" : "E",
      scores.S > scores.N ? "S" : "N",
      scores.T > scores.F ? "T" : "F",
      scores.J > scores.P ? "J" : "P",
    ].join("");

    // 跳转到结果页面并传递参数
    const queryParams = new URLSearchParams({
      type,
      E: scores.E.toString(), // 确保传递浮点数
      I: scores.I.toString(),
      S: scores.S.toString(),
      N: scores.N.toString(),
      T: scores.T.toString(),
      F: scores.F.toString(),
      J: scores.J.toString(),
      P: scores.P.toString(),
    });

    window.location.href = `/MBTI/TestResult?${queryParams.toString()}`;
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
            <div
              key={index}
              className={`flex items-center justify-start text-lg h-16 transition-all p-4 rounded-lg
                ${
                  index === 0
                    ? "bg-green-100 text-green-800" // A选项绿色背景
                    : "bg-purple-100 text-purple-800" // B选项紫色背景
                }`}
            >
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-4">
                {String.fromCharCode(65 + index)}
              </span>
              {option.text}
            </div>
          ))}
        </div>
        {/* 圆形选择按钮 */}
        <div className="flex items-center justify-between gap-4 md:gap-6 mt-8 mb-8 px-2">
          <span className="text-green-600 font-bold text-3xl md:text-5xl">
            A
          </span>
          <div className="flex items-center justify-center gap-3 md:gap-6 flex-1">
            {[1, 0.75, 0.5, 0.25, 0].map((weight, index) => {
              const isSelected =
                currentAnswer?.selectedOption === weight.toString();
              const isLeft = index < 2;
              const isMiddle = index === 2;
              const color = isMiddle ? "gray" : isLeft ? "green" : "purple";
              const size =
                index === 2 ? 32 : index === 1 || index === 3 ? 40 : 48;

              return (
                <button
                  key={index}
                  onClick={() =>
                    handleCircleClick(
                      currentQuestion.id,
                      currentQuestion.options[0].dimension,
                      currentQuestion.options[1].dimension,
                      weight
                    )
                  }
                  style={{
                    width: size,
                    height: size,
                    borderWidth: 3,
                    borderColor: isMiddle
                      ? "#9CA3AF"
                      : color === "green"
                      ? "#16A34A"
                      : "#9333EA",
                    backgroundColor: isSelected
                      ? color === "gray"
                        ? "#9CA3AF"
                        : color === "green"
                        ? "#16A34A"
                        : "#9333EA"
                      : "#FFFFFF",
                    transition: "background-color 0.3s ease",
                    animation: isSelected ? "pulse 0.5s" : "none",
                    cursor: "pointer",
                    borderRadius: "9999px",
                    flexShrink: 0,
                  }}
                  className="hover:bg-gray-100" // 使用Tailwind CSS实现悬停效果
                ></button>
              );
            })}
          </div>
          <span className="text-purple-600 font-bold text-3xl md:text-5xl mx-2">
            B
          </span>
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
            answers.some((a) => a.questionId === currentQuestion?.id) && (
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
