'use client';

import { cn } from '@/lib/utils'
import { Chapter, Question } from '@prisma/client'
import { FC, useCallback, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Button } from './ui/button';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';

interface QuizCardsProps {
    chapter: Chapter & {
        questions: Question[]
    }
}

const QuizCards: FC<QuizCardsProps> = ({
    chapter
}) => {

    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [questionState, setQuestionState] = useState<Record<string, boolean | null>>({});

    const checkAnswers = useCallback(() => {
        const newQuestionStatus = { ...questionState };
        chapter.questions.forEach((question) => {
            const userAnswer = answers[question.id];
            if (!userAnswer) {
                return;
            }
            if (userAnswer === question.answer) {
                newQuestionStatus[question.id] = true;
            } else {
                newQuestionStatus[question.id] = false;
            }
        })

        setQuestionState(newQuestionStatus);

    }, [answers, questionState, chapter.questions]);

    return (
        <div className='flex-[1] mt-16 ml-8'>
            <h1 className='text-2xl font-bold'>Concept Check</h1>
            <div className='mt-2'>
                {chapter.questions.map((question) => {
                    const options = JSON.parse(question.options) as string[];

                    return (
                        <div key={question.id}
                            className={cn('p-3 mt-4 border border-secondary rounded-lg', {
                                'bg-green-700': questionState[question.id] === true,
                                'bg-red-700': questionState[question.id] === false,
                                'bg-secondary': questionState[question.id] === null
                            })}>
                            <h1 className='text-lg font-semibold'>{question.question}</h1>
                            <div className='mt-2'>
                                <RadioGroup onValueChange={(e) => {
                                    setAnswers((prev) => {
                                        return {
                                            ...prev,
                                            [question.id]: e
                                        }
                                    })
                                }}>
                                    {options.map((opt, optIdx) => (
                                        <div key={optIdx} className='flex items-center space-x-2'>
                                            <RadioGroupItem value={opt} id={question.id + optIdx.toString()} />
                                            <Label htmlFor={question.id + optIdx.toString()}>
                                                {opt}
                                            </Label>

                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Button
                className='mt-2 w-full'
                size='lg'
                onClick={checkAnswers}>
                Check Answers
                <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
        </div>
    )
}

export default QuizCards