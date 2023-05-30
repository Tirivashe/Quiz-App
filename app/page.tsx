'use client'

import { useState } from 'react';
import data from "@/app/data.json"
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import styles from "./page.module.scss"

export default function Home() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null)
  const [isQuizEnd, setIsQuizEnd] = useState(false)
  const [results, setScore] = useState({
    correctAnswers: 0,
    wrongAnswers: 0
  })
  let { questions } = data
  const { options, prompt, answer } = questions[currentQuestionIdx]

  const selectAnswer = (selected: string, idx: number) => {
    setSelectedAnswer(selected)
    setSelectedAnswerIdx(idx)
  }

  function scrambleArray<T extends Question[] | string[]>(arr: T) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const goNext = () => {
    if(selectedAnswer === answer) {
      setScore(prevState => ({ ...prevState, correctAnswers: prevState.correctAnswers + 1 }))
    } else {
      setScore(prevState => ({ ...prevState, wrongAnswers: prevState.wrongAnswers + 1 }))
    }

    setSelectedAnswer("")
    setSelectedAnswerIdx(null)

    if(currentQuestionIdx === questions.length - 1) {
      setIsQuizEnd(true)
    } else {
      setCurrentQuestionIdx(prev => prev + 1)
    }
  }

  const restart = () => {
    setCurrentQuestionIdx(0)
    setSelectedAnswer("")
    setSelectedAnswerIdx(null)
    setIsQuizEnd(false)
    setScore({ correctAnswers: 0, wrongAnswers: 0 })
    questions = scrambleArray(questions)
    questions.forEach(question => {
      question.options = scrambleArray(question.options)
    })
  }


  return (
    <main className={styles.main}>
      {!isQuizEnd && (
        <Stack gap="sm" mt="sm" align='center' w={{ base: "90%", xl: "30%", lg: "50%", md: "65%", sm: "80%", xs: "90%" }}>
          <Title order={2}>Its Quiz Time</Title>
          <Group justify='center' align='center' gap="xs">
            <Title order={5}>Q{currentQuestionIdx+1}/{questions.length}:</Title>
            <Title style={{ textAlign: "center" }} order={5}>{prompt}</Title>
          </Group>
          <Stack w="100%" gap="sm">
            {options.map((option, idx) => (
              <Text onClick={() => selectAnswer(option, idx)} className={ selectedAnswerIdx === idx ? styles.selected : styles.option} key={idx}>{option}</Text>
            ))}
          </Stack>
          <Button onClick={goNext} fullWidth disabled={!selectedAnswer}>Next</Button>
      </Stack>
      )}
      {isQuizEnd && (
        <Stack>
          <Title>End Of Quiz</Title>
          <Text>Score: {Math.round((results.correctAnswers / questions.length) * 100)}%</Text>
          <Text>Correct Answers: {results.correctAnswers}</Text>
          <Text>Wrong Answers: {results.wrongAnswers}</Text>
          <Button fullWidth onClick={restart}>Restart</Button>
        </Stack>
      )}
    </main>
  )
}
