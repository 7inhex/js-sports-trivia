// !!FYI i ran beautify on this so the formatting might be different from provided code :heart:

// import the utility functions "decodeHtml" and "shuffle"
import {
	decodeHtml,
	shuffle
} from './utils.js';

// get the elements from the DOM
const questionElement = document.querySelector('#question')
const answersElement = document.querySelector('#answers')
const nextQuestionElement = document.querySelector('#nextQuestion')

// IIFE (so we can use async/await)
;
(async () => {
	async function getNextQuestion() {
		// fetch a question from the API
		const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple')
		if (!response.ok) throw new Error(`failed: ${response.status} ${response.statusText}`)
		const json = await response.json()
		const questionData = json.results[0]
		const {
			question,
			correct_answer: correct,
			incorrect_answers: incorrect
		} = questionData
		const answers = shuffle([...incorrect, correct])
		return {
			question,
			answers,
			correct
		}
	}

	async function renderQuestion(questionData) {
		const { question, answers, correct } = questionData
		questionElement.textContent = decodeHtml(question)
		answersElement.innerHTML = ''
		answers.forEach(currentAnswer => {
			const button = document.createElement('button')
			button.textContent = decodeHtml(currentAnswer)
			button.addEventListener('click', () => {
				if (currentAnswer === correct) {
					button.classList.add('correct')
					answersElement.querySelectorAll('button').forEach(b => b.disabled = true)
					alert('Correct!')
				} else {
					button.disabled = true
					alert('Incorrect!')
				}
			})
			answersElement.appendChild(button)
		})
	}

	const button = document.querySelector('#nextQuestion')
	button.addEventListener('click', async () => {
		renderQuestion(await getNextQuestion())
		nextQuestionElement.disabled = true
		setTimeout(() => nextQuestionElement.disabled = false, 10000)
	})
	renderQuestion(await getNextQuestion())
})()

// mimic a click on the "nextQuestion" button to show the first question
// nextQuestionElement.click()  // commented out since we call renderQuestion directly