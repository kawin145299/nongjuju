const words = {
    1: ["ありがとう", "こんにちは", "さようなら"],
    2: ["勉強", "試験", "成功"],
    3: ["複雑", "経済", "哲学"]
};

let correctAnswers = 0;
let incorrectAnswers = 0;

let currentLevel = 1;
let currentIndex = 0;

function startQuiz(level) {
    currentLevel = level;
    currentIndex = 0;
    document.getElementById('quiz-section').style.display = 'block';
    showWord();
}

function showWord() {
    if (words[currentLevel].length === 0) {
        alert("No words left in this level.");
        document.getElementById('quiz-section').style.display = 'none';
        return;
    }
    document.getElementById('current-word').textContent = words[currentLevel][currentIndex];
}

function handleAnswer(isCorrect) {
    const word = words[currentLevel][currentIndex];

    if (isCorrect) {
        moveToNextLevel(word);
        correctAnswers++;
    } else {
        moveToPreviousLevel(word);
        incorrectAnswers++;
    }

    words[currentLevel].splice(currentIndex, 1);

    if (words[currentLevel].length === 0) {
        document.getElementById('quiz-section').style.display = 'none';
        alert("No words left in this level.");
        return;
    }

    currentIndex = currentIndex % words[currentLevel].length;
    showWord();
}

function moveToNextLevel(word) {
    if (currentLevel < 3) {
        words[currentLevel + 1].push(word);
    }
}

function moveToPreviousLevel(word) {
    if (currentLevel > 1) {
        words[currentLevel - 1].push(word);
    }
}

function addWord() {
    const newWord = document.getElementById('new-word').value.trim();
    const selectedLevel = parseInt(document.getElementById('word-level').value);

    if (newWord) {
        words[selectedLevel].push(newWord);
        document.getElementById('new-word').value = '';
        alert(`Word "${newWord}" added to Level ${selectedLevel}`);
    } else {
        alert("Please enter a word.");
    }
}

function showStatistics() {
    document.getElementById('statisticsChart').style.display = 'block';
    const ctx = document.getElementById('statisticsChart').getContext('2d');

    const data = {
        labels: ['Correct', 'Incorrect'],
        datasets: [{
            label: 'Answer Statistics',
            data: [correctAnswers, incorrectAnswers],
            backgroundColor: ['#4CAF50', '#F44336'],
            borderColor: ['#388E3C', '#D32F2F'],
            borderWidth: 1
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    new Chart(ctx, config);
}
function deleteAllWords() {
    const level = prompt("กรุณาใส่ระดับที่ต้องการลบ (1, 2, หรือ 3):");
    const levelNumber = parseInt(level);

    if (levelNumber >= 1 && levelNumber <= 3) {
        if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำศัพท์ทั้งหมดในระดับ ${levelNumber}?`)) {
            words[levelNumber] = []; // ลบคำศัพท์ทั้งหมดในระดับที่เลือก
            updateVocabularyTable(); // อัปเดตตาราง
            alert(`คำศัพท์ทั้งหมดในระดับ ${levelNumber} ถูกลบแล้ว.`);
        }
    } else {
        alert("ระดับไม่ถูกต้อง กรุณาใส่ระดับที่ถูกต้อง (1, 2, หรือ 3).");
    }
}

function updateVocabularyTable() {
    const tableBody = document.getElementById('vocabulary-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // ล้างแถวที่มีอยู่

    for (let level in words) {
        words[level].forEach((word, index) => {
            const row = tableBody.insertRow();
            const cellLevel = row.insertCell(0);
            const cellWord = row.insertCell(1);
            const cellActions = row.insertCell(2);

            cellLevel.textContent = `ระดับ ${level}`;
            cellWord.textContent = word;

            // สร้างปุ่มลบ
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'ลบ';
            deleteButton.onclick = function() {
                deleteWord(level, index);
            };
            cellActions.appendChild(deleteButton);
        });
    }
}

function deleteWord(level, index) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำว่า "${words[level][index]}"?`)) {
        words[level].splice(index, 1);
        updateVocabularyTable(); // อัปเดตตาราง
    }
}

// เรียกใช้งาน updateVocabularyTable เมื่อลงหน้าเว็บ
window.onload = updateVocabularyTable;
