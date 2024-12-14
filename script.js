class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizContainer = document.getElementById('quiz-content');
        this.nextBtnContainer = document.getElementById('next-btn-container');
        this.nextBtn = document.getElementById('next-btn');
        this.selectedOption = null;
        this.startScreen = document.getElementById('start-screen');
        this.startBtn = document.getElementById('start-btn');
        this.timerContainer = document.getElementById('timer-container');
        this.timerDisplay = document.getElementById('timer');
        this.totalTime = 45 * 60; 
        this.timer = null;
    }

    startQuiz() {
        this.startScreen.classList.add('hidden');
        this.timerContainer.classList.remove('hidden');
        this.renderQuestion();
        this.startTimer();
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.totalTime--;
            const minutes = Math.floor(this.totalTime / 60);
            const seconds = this.totalTime % 60;
            this.timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (this.totalTime <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    renderQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `${this.currentQuestionIndex + 1}. ${currentQuestion.question}`;
        questionDiv.appendChild(questionTitle);

        currentQuestion.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('option');
            optionDiv.innerHTML = `${String.fromCharCode(97 + index)}) ${option}`;

            optionDiv.addEventListener('click', () => this.selectOption(optionDiv, index));

            questionDiv.appendChild(optionDiv);
        });

        this.quizContainer.innerHTML = '';
        this.quizContainer.appendChild(questionDiv);

        this.nextBtnContainer.classList.add('hidden');
        this.selectedOption = null;
    }

    selectOption(optionElement, selectedIndex) {
        const options = document.querySelectorAll('.option');
        options.forEach(opt => opt.classList.remove('selected'));
        optionElement.classList.add('selected');

        this.selectedOption = selectedIndex;
        this.nextBtnContainer.classList.remove('hidden');
    }

    nextQuestion() {
        if (this.selectedOption === this.questions[this.currentQuestionIndex].correctAnswer) {
            this.score += 2;
        }

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
            this.renderQuestion();
        } else {
            this.endQuiz();
        }
    }

    endQuiz() {
        clearInterval(this.timer);

        const totalScore = this.score;
        const totalQuestions = this.questions.length;
        const correctAnswers = this.score / 2;
        const incorrectAnswers = totalQuestions - correctAnswers;

        this.quizContainer.innerHTML = `
            <div class="result">
                <h2>Sınav Tamamlandı!</h2>
                <p>Toplam Puan: ${totalScore}</p>
                <p>Doğru Sayısı: ${correctAnswers}</p>
                <p>Yanlış Sayısı: ${incorrectAnswers}</p>
                <button class="start-btn" id="restart-btn">Testi Tekrar Başlat</button>
            </div>
        `;

        this.nextBtnContainer.classList.add('hidden');

        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => this.restartQuiz());
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalTime = 45 * 60;
        this.startQuiz();
    }

    start() {
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const quiz = new Quiz(questions);
    quiz.start();
});
