import React from "react";
import { useState, useEffect } from "react";
import logo from "./img/logo-quiz.png";
import "./App.css";

function App() {
  const [showQuest, setShowQuest] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, []);
  const fetchQuizData = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5");
      const data = await response.json();
      setQuizData(data.results);
    } catch (error) {
      console.log("Cannot get Data", error);
    }
  };

  const handleStartQuiz = () => {
    setShowQuest(true);
    setStartTime(new Date());
  };

  const handleAnswer = (answer) => {
    if (isTransitioning) {
      return;
    }

    const updateAnswer = [...userAnswers];
    updateAnswer[currentQuestion] = answer;
    setUserAnswers(updateAnswer);

    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion === quizData.length - 1) {
      setShowResults(true);
      setEndTime(new Date());
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizData[index].correct_answer) {
        score++;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setQuizData(null);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setShowResults(false);
    setShowReview(false);
    setStartTime(new Date());
    setEndTime(null);
    setIsAnswered(false);
    setIsTransitioning(false);
    fetchQuizData();
  };

  const handleGoHome = () => {
    setCurrentQuestion(0);
    setShowResults(false);
    setShowQuest(false);
    setShowReview(false);
    setIsAnswered(false);
    setIsTransitioning(false);
    fetchQuizData();
  };

  const handleReviewAnswers = () => {
    setShowResults(false);
    setShowReview(true);
  };

  if (showResults) {
    const totalTime = ((endTime - startTime) / 1000).toFixed(0);
    const totalScore = calculateScore();

    return (
      <div className="container">
        <div className="show-results">
          <h3>Quiz Results</h3>
          <p>Total time: {totalTime} seconds</p>
          <p>Correct answers: {totalScore}</p>
          <p>
            {totalScore >= quizData.length * 0.2
              ? "Congratulations! You passed the test :D"
              : "Sorry! You failed the test :(("}
          </p>
          <button className="btn" onClick={handleRestart}>
            Restart
          </button>
          <button className="btn" onClick={handleGoHome}>
            Home
          </button>
          <button className="btn" onClick={handleReviewAnswers}>
            Review Answers
          </button>
        </div>
      </div>
    );
  }

  if (showReview) {
    const questionsWithAnswers = quizData.map((question, index) => ({
      ...question,
      userAnswer: userAnswers[index],
    }));

    return (
      <div className="container">
        <h2 className="title-review">Review Your Answers</h2>
        {questionsWithAnswers.map((question, index) => (
          <div key={index} className="question-review">
            <h3>Question {index + 1}</h3>
            <p>Question: {question.question}</p>
            <p>
              - Your Answer: {question.userAnswer || "Not answered"}
              {question.userAnswer &&
                (question.userAnswer === question.correct_answer ? (
                  <span className="correct-answer"> (Correct)</span>
                ) : (
                  <span className="incorrect-answer"> (Incorrect)</span>
                ))}
            </p>
            <p>- Correct Answer: {question.correct_answer}</p>
          </div>
        ))}
        <button className="btn" onClick={handleGoHome}>
          Home
        </button>
        <button className="btn" onClick={handleRestart}>
          Restart
        </button>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="screen-loader">
        <div className="loader"></div>
        <p className="screen-loader_title">Preparing questions</p>
      </div>
    );
  }

  const currentQuestionData = quizData[currentQuestion];
  const options = [
    ...currentQuestionData.incorrect_answers,
    currentQuestionData.correct_answer,
  ];

  return (
    <div className="container">
      {showQuest && quizData && quizData.length > 0 ? (
        <div className="question-container">
          <h3>Question {currentQuestion + 1}</h3>
          <p>{currentQuestionData.question}</p>
          {options.map((option, index) => (
            <div key={index} className="option-container">
              <button
                className={`option-btn ${
                  isAnswered && option === currentQuestionData.correct_answer
                    ? "true-answer"
                    : isAnswered && option === userAnswers[currentQuestion]
                    ? "wrong-answer"
                    : ""
                }`}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            </div>
          ))}
          <button className="btn btn-quiz" onClick={handleNextQuestion}>
            {currentQuestion !== quizData.length - 1 ? "Next" : "Finish"}
          </button>
        </div>
      ) : (
        <div>
          <img src={logo} alt="quizz" className="logo" />
          <h1 className="title">Are You Ready?</h1>
          <button className="btn" onClick={handleStartQuiz}>
            Start Quiz
          </button>
          <p className="copyright">
            © 2023 Duong Phi Hung - dphung1010@gmail.com
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
