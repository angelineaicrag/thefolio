import { useState } from "react";

const questions = [
  {
    question: "Who is the author of the University Series?",
    answers: ["Jonaxx", "Gwy Saludes", "Maxinejiji"],
    correct: "Gwy Saludes",
  },
  {
    question: "Who is the author of the College Series?",
    answers: ["Maxinejiji", "Inksteady", "Gwy Saludes"],
    correct: "Inksteady",
  },
  {
    question: "Which author is known as Maxinejiji?",
    answers: ["MaxineLat", "Jonaxx", "Cecelib"],
    correct: "MaxineLat",
  },
  {
    question: "Which platform is popular for reading Wattpad stories?",
    answers: ["Goodreads", "Wattpad", "Netflix"],
    correct: "Wattpad",
  },
  {
    question: "Who is the author of My Husband is a Mafia Boss?",
    answers: ["Maxinejiji", "KIB", "YANALOVESYOU"],
    correct: "YANALOVESYOU",
  },
];

function AuthorGame() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showEnd, setShowEnd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selected) {
      setFeedback("⚠ Please select an answer.");
      return;
    }

    const correctAnswer = questions[current].correct;

    if (selected === correctAnswer) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${correctAnswer}`);
    }

    // Move to next question after short delay
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
        setSelected("");
        setFeedback("");
      } else {
        setShowEnd(true);
      }
    }, 1200);
  };

  const restartGame = () => {
    setCurrent(0);
    setScore(0);
    setSelected("");
    setFeedback("");
    setShowEnd(false);
  };

  if (showEnd) {
    return (
      <div className="quiz-box">
        <h2>Game Over 🎉</h2>
        <p>Your Score: {score} / {questions.length}</p>
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <h2>Who’s the Author? 📚</h2>
      <p className="question">{questions[current].question}</p>

      <form onSubmit={handleSubmit}>
        {questions[current].answers.map((answer, idx) => (
          <label key={idx}>
            <input
              type="radio"
              name="answer"
              value={answer}
              checked={selected === answer}
              onChange={(e) => setSelected(e.target.value)}
            />
            {answer}
          </label>
        ))}

        <button type="submit">Submit</button>
      </form>

      {feedback && <p className="result">{feedback}</p>}
      <p className="score">Score: {score} / {questions.length}</p>
    </div>
  );
}

export default AuthorGame;

