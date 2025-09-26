        document.addEventListener('DOMContentLoaded', function() {
            const userNumbersInput = document.getElementById('userNumbers');
            const startBtn = document.getElementById('startBtn');
            const drawBtn = document.getElementById('drawBtn');
            const userBallsContainer = document.getElementById('userBalls');
            const drawnBallsContainer = document.getElementById('drawnBalls');
            const resultDiv = document.getElementById('result');
            const matchedCountSpan = document.getElementById('matchedCount');
            const prizeDiv = document.getElementById('prize');
            
            let userNumbers = [];
            let drawnNumbers = [];
            
            // Начало игры - валидация введенных чисел
            startBtn.addEventListener('click', function() {
                const input = userNumbersInput.value.trim();
                const numbers = input.split(',').map(num => parseInt(num.trim()));
                
                // Проверка ввода
                if (numbers.length !== 5 || numbers.some(isNaN) || 
                    numbers.some(num => num < 1 || num > 25) ||
                    new Set(numbers).size !== numbers.length) {
                    alert('Пожалуйста, введите 5 уникальных чисел от 1 до 25, разделенных запятыми');
                    return;
                }
                
                userNumbers = numbers.sort((a, b) => a - b);
                renderUserBalls();
                startBtn.disabled = true;
                drawBtn.disabled = false;
                resultDiv.style.display = 'none';
            });
            
            // Отрисовка выбранных пользователем шаров
            function renderUserBalls() {
                userBallsContainer.innerHTML = '';
                userNumbers.forEach(num => {
                    const ball = document.createElement('div');
                    ball.className = 'ball';
                    ball.textContent = num;
                    userBallsContainer.appendChild(ball);
                });
            }
            
            // Розыгрыш случайных чисел
            drawBtn.addEventListener('click', function() {
                drawBtn.disabled = true;
                drawnNumbers = [];
                drawnBallsContainer.innerHTML = '';
                resultDiv.style.display = 'none';
                
                // Генерация 5 уникальных случайных чисел
                const allNumbers = Array.from({length: 25}, (_, i) => i + 1);
                for (let i = 0; i < 5; i++) {
                    const randomIndex = Math.floor(Math.random() * allNumbers.length);
                    drawnNumbers.push(allNumbers[randomIndex]);
                    allNumbers.splice(randomIndex, 1);
                }
                drawnNumbers.sort((a, b) => a - b);
                
                // Анимация выпадения шаров
                animateDraw();
            });
            
            // Анимация выпадения шаров
            function animateDraw() {
                let delay = 0;
                drawnNumbers.forEach((num, index) => {
                    setTimeout(() => {
                        const ball = document.createElement('div');
                        ball.className = 'ball draw-animation';
                        ball.textContent = num;
                        drawnBallsContainer.appendChild(ball);
                        
                        // После завершения анимации всех шаров - подсчет результатов
                        if (index === drawnNumbers.length - 1) {
                            setTimeout(calculateResults, 1000);
                        }
                    }, delay);
                    delay += 800; // Задержка между шарами
                });
            }
            
            // Подсчет результатов и призов
            function calculateResults() {
                // Находим совпадения
                const matched = userNumbers.filter(num => drawnNumbers.includes(num));
                const matchedCount = matched.length;
                
                // Подсвечиваем совпавшие шары
                document.querySelectorAll('#userBalls .ball').forEach(ball => {
                    if (matched.includes(parseInt(ball.textContent))) {
                        ball.classList.add('matched');
                    }
                });
                
                document.querySelectorAll('#drawnBalls .ball').forEach(ball => {
                    if (matched.includes(parseInt(ball.textContent))) {
                        ball.classList.add('matched');
                    }
                });
                
                // Показываем результаты
                matchedCountSpan.textContent = matchedCount;
                resultDiv.style.display = 'block';
                
                // Определяем приз
                let prize = '';
                switch(matchedCount) {
                    case 5: prize = '🏆 ДЖЕКПОТ! 1 000 000 рублей!'; break;
                    case 4: prize = '🎉 Отличный результат! 10 000 рублей!'; break;
                    case 3: prize = '👍 Хорошо! 1 000 рублей!'; break;
                    case 2: prize = '🍀 Неплохо! 100 рублей!'; break;
                    default: prize = '😢 К сожалению, вы ничего не выиграли. Попробуйте еще раз!';
                }
                
                prizeDiv.textContent = prize;
                startBtn.disabled = false;
            }
        });