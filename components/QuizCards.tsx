'use client';

import { cn } from '@/lib/utils'
import { Chapter, Question } from '@prisma/client'
import { FC, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

interface QuizCardsProps {
    chapter: Chapter & {
        questions: Question[]
    }
}

const QuizCards: FC<QuizCardsProps> = ({
    chapter
}) => {

    const [answers, setAnswers] = useState<Record<string, string>>({});

    return (
        <div className='flex-[1] mt-16 ml-8'>
            <h1 className='text-2xl font-bold'>Concept Check</h1>
            <div className='mt-2'>
                {chapter.questions.map((question) => {
                    const options = JSON.parse(question.options) as string[];

                    return (
                        <div key={question.id}
                            className={cn('p-3 mt-4 border border-secondary rounded-lg')}>
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
        </div>
    )
}

export default QuizCards