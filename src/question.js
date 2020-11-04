export class Question {
  static create(question) {
    return fetch('https://questions-app-81bc3.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(addToLocalStorage)
      .then(Question.renderList);
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">You haven`t token</p>');
    }
    console.log(token);
    return fetch(`https://questions-app-81bc3.firebaseio.com/questions.json?auth=${token}`)
      .then((response) => response.json())
      .then((response) => {
        if (response && response.error) {
          return `<p class="error">${response.error}</p>`;
        }

        return response
          ? Object.keys(response).map((key) => ({
              ...response[key],
              id: key,
            }))
          : [];
      });
  }

  static renderList() {
    const question = getQuestionsFromLocalStorage();

    const html = question.length
      ? question.map(toCard).join('')
      : `<div class="mui--text-headline">You haven't asked anything yet</div>`;

    const list = document.getElementById('list');

    list.innerHTML = html;
  }

  static listToHTML(questions) {
    console.log(questions);
    return questions.length
      ? `<ol>${questions.map((q) => `<li>${q.text}</li>`).join('')}</ol>`
      : '<p>No questions</p>';
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage();
  all.push(question);
  localStorage.setItem('questions', JSON.stringify(all));
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>
      ${question.text}
    </div>
    <br />
  `;
}
