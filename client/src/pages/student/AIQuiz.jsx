import React, { useState } from 'react';
import { Sparkles, CheckCircle2, XCircle, Award, Zap, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { MOCK_AI_QUIZ } from '../../data/mockData';
import { toast } from 'react-toastify';

export const AIQuiz = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (Object.keys(selectedAnswers).length < MOCK_AI_QUIZ.questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    let correctCount = 0;
    MOCK_AI_QUIZ.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / MOCK_AI_QUIZ.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);
    toast.success(`🎉 Quiz Completed! You scored ${calculatedScore}% and earned +50 XP!`);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white p-6 rounded-[12px] shadow-soft-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>AI KNOWLEDGE CHECK</Badge>
          <h1 className="text-2xl font-bold font-heading text-white">
            Interactive AI Quiz Generator
          </h1>
          <p className="text-xs text-slate-400">
            Test your understanding of the lecture. Earn +50 XP for scoring 80% or higher.
          </p>
        </div>

        {isSubmitted && (
          <Button variant="amber" size="md" leftIcon={RefreshCw} onClick={handleRetakeQuiz}>
            Retake Quiz
          </Button>
        )}
      </div>

      {/* Quiz Title & Score Results Banner */}
      {isSubmitted && (
        <Card className="p-6 text-center space-y-3 bg-amber-50/80 border-2 border-amber-300">
          <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <Badge variant="amber" size="md">+50 XP REWARD UNLOCKED</Badge>
          <h2 className="text-2xl font-bold font-heading text-gray-900">Quiz Score: {score}%</h2>
          <p className="text-xs text-gray-600">
            {score >= 80 ? 'Outstanding work! You mastered the key concepts in this module.' : 'Good effort! Review the AI notes and retake the quiz to improve your score.'}
          </p>
        </Card>
      )}

      {/* Quiz Form */}
      <form onSubmit={handleSubmitQuiz} className="space-y-6">
        {MOCK_AI_QUIZ.questions.map((q, qIdx) => {
          const isUserCorrect = selectedAnswers[q.id] === q.correctAnswer;

          return (
            <Card key={q.id} className="p-6 space-y-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-sm font-bold font-heading text-gray-900">
                  Question {qIdx + 1}: {q.question}
                </h3>
                {isSubmitted && (
                  <div>
                    {isUserCorrect ? (
                      <Badge variant="success" size="sm" hasDot>CORRECT</Badge>
                    ) : (
                      <Badge variant="danger" size="sm">INCORRECT</Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[q.id] === optIdx;
                  const isCorrect = q.correctAnswer === optIdx;

                  let optionStyle = 'bg-[#F8F9FC] border-gray-200 hover:bg-gray-100 text-gray-800';
                  if (isSelected && !isSubmitted) {
                    optionStyle = 'bg-[#4F46E5] text-white border-[#4F46E5]';
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-red-50 border-red-300 text-red-900 font-bold';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-[8px] border text-xs transition-colors cursor-pointer flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </Card>
          );
        })}

        {!isSubmitted && (
          <Button type="submit" variant="amber" size="lg" fullWidth leftIcon={CheckCircle2}>
            Submit Quiz & Auto-Grade Answers
          </Button>
        )}
      </form>

    </div>
  );
};

export default AIQuiz;
