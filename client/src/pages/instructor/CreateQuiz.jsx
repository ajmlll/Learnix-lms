import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, Save } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

export const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState('React 19 Server Actions & Hooks Quiz');
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      questionText: 'Which React 19 hook manages server action pending state?',
      options: ['useFormStatus', 'useActionState', 'useTransition', 'useServerState'],
      correctOption: 1,
    },
  ]);

  const handleAddQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      questionText: '',
      options: ['', '', '', ''],
      correctOption: 0,
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveQuiz = (e) => {
    e.preventDefault();
    toast.success(`🎉 Quiz "${quizTitle}" saved and assigned to course!`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[12px] border border-gray-200 shadow-soft">
        <div className="space-y-1">
          <Badge variant="amber" size="sm" hasDot>QUIZ BUILDER STUDIO</Badge>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Create MCQ Quiz
          </h1>
          <p className="text-xs text-gray-500">
            Design multiple-choice questions for automated student evaluation and XP rewards.
          </p>
        </div>

        <Button variant="primary" size="md" leftIcon={Save} onClick={handleSaveQuiz}>
          Save Quiz
        </Button>
      </div>

      <Card className="p-6 space-y-6 shadow-soft">
        <Input
          label="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          isRequired
        />

        {/* Questions Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-sm font-bold font-heading text-gray-900">
              Questions List ({questions.length})
            </h3>
            <Button variant="amber" size="sm" leftIcon={Plus} onClick={handleAddQuestion}>
              Add Question Field
            </Button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={q.id} className="p-4 bg-[#F8F9FC] border border-gray-200 rounded-[12px] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4F46E5] font-mono">Question {qIdx + 1}</span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>

              <Input
                placeholder="Enter question prompt..."
                value={q.questionText}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[qIdx].questionText = e.target.value;
                  setQuestions(updated);
                }}
              />

              {/* Options & Radio correct selector */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase font-heading">
                  Answer Options (Select correct radio button)
                </label>

                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct_${q.id}`}
                      checked={q.correctOption === optIdx}
                      onChange={() => {
                        const updated = [...questions];
                        updated[qIdx].correctOption = optIdx;
                        setQuestions(updated);
                      }}
                      className="accent-[#F59E0B] cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[qIdx].options[optIdx] = e.target.value;
                        setQuestions(updated);
                      }}
                      className="flex-1 bg-white border border-gray-200 rounded-[6px] px-3 py-1.5 text-xs outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};

export default CreateQuiz;
