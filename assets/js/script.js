var initialTime = 60;
var penaltyTime = 10;

if (!localStorage.getItem("scores")) {
  localStorage.setItem("scores", "[]");
}

var qs = [
  {
    question: "Arrays in javascript can be used to store ____",
    answers: [
      "Objects",
      "Arrays",
      "Strings",
      "all of the above"
    ],
    correct: 3
  },
  {
    question: "Commonly used data types DO NOT include ____",
    answers: [
      "strings",
      "booleans",
      "alerts",
      "numbers"
    ],
    correct: 2
  },
  {
    question: "The condition in an if statement must be enclosed in ____",
    answers: [
      "parentheses",
      "quotes",
      "curly braces",
      "square brackets"
    ],
    correct: 0
  },
  {
    question: "String values must be enclosed in ____",
    answers: [
      "Double quotes",
      "Single quotes",
      "Either of the above",
      "none of the above"
    ],
    correct: 2
  },
  {
    question: "The worst case time complexity of quicksort is ____",
    answers: [
      "O(n)",
      "O(n^2)",
      "O(n*log(n))",
      "O(2^n)"
    ],
    correct: 1
  },
]

var pages = [
  instructions,
  quiz_body,
  score_saver,
  scores
];

function show_page(page) {
  for (var p of pages)
    if (p === page)
      p.hidden = false;
    else
      p.hidden = true;
}

show_page(instructions);

var countdown = -1;
var current_q = -1;

function startQuiz(e) {
  e.preventDefault();

  show_page(quiz_body);

  timer.textContent = initialTime;
  countdown = setInterval(function() {
    timer.textContent -= 1;
    if (timer.textContent <= 0) {
      clearInterval(countdown);
      countdown = -1;
      showScoreSaver(0);
    }
  }, 1000);

  current_q = 0;
  ask();
}

start_button.onclick=startQuiz;

function aRight() {
  current_q++;
  ask();
}
function aWrong() {
  timer.textContent -= penaltyTime;
  if (timer.textContent <= 0) {
    clearInterval(countdown);
    showScoreSaver(0);
  }
  current_q++;
  ask();
}

function ask() {
  console.log(`ask question ${current_q}`);
  if (current_q >= qs.length) {
    clearInterval(countdown);
    showScoreSaver(timer.textContent);
    return;
  }

  var q = qs[current_q];
  question.textContent = q.question;
  answers.innerHTML = '';
  for (var i = 0; i < q.answers.length; i++) {
    console.log(q.answers[i]);
    var a = document.createElement('li');
    a.textContent = q.answers[i];
    a.onclick = (i===q.correct)?aRight:aWrong;
    answers.appendChild(a);
  }
}

function showScoreSaver(score) {
  show_page(score_saver);

  score_message.textContent = `Your final score is: ${score}`;

  score_button.onclick = function(e) {
    e.preventDefault();
    if (initials.value === '') return;
    console.log(initials.value);

    var res = {initials: initials.value, score};
    initials.value = '';

    var scorelist = JSON.parse(localStorage.getItem("scores")) || [];
    console.log(scorelist);

    if (scorelist.length === 0) {
      scorelist = [res];
    } else {
      var i;
      for (i = 0; i < scorelist.length; i++) {
        if (scorelist[i].score < score) {
          scorelist.splice(i, 0, res);
          break;
        }
      }
      if (i === scorelist.length) {
        scorelist.push(res);
      }
    }


    localStorage.setItem("scores", JSON.stringify(scorelist));

    showScoreBoard();
  };
}

function showScoreBoard() {
  console.log('called showScoreBoard');
  show_page(scores);

  score_list.innerHTML = '';
  var list = JSON.parse(localStorage.getItem("scores"));
  for (var i = 0; i < list.length; i++) {
    var c = document.createElement('li');
    c.textContent = `${i}: ${list[i].initials} | ${list[i].score}`;
    score_list.appendChild(c);
  }
}

score_link.onclick = showScoreBoard;

clear_scores.onclick = function(e) {
  e.preventDefault();
  localStorage.setItem("scores", "[]");
  showScoreBoard();
}

restart.onclick = function(e) {
  e.preventDefault();
  show_page(instructions);
}

