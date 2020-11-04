import { Question } from './question';
import { createModal, isValid } from './utils';
import { authWithEmailAndPassword, getAuthForm } from './auth';
import './styles.css';

const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.querySelector('#modal-btn');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value);
});
modalBtn.addEventListener('click', openModal);

function submitFormHandler(e) {
  e.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;

    Question.create(question).then(() => {
      input.value = '';
      input.className = '';
      submitBtn.disabled = false;
    });
  }
}

function authFormHandler(e) {
  e.preventDefault();

  const button = e.target.querySelector('button');
  const email = e.target.querySelector('#email').value;
  const password = e.target.querySelector('#password').value;

  button.disabled = true;
  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => (button.disabled = false));
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('Error!', content);
  } else {
    createModal('List of Questions', Question.listToHTML(content));
  }
}

function openModal() {
  createModal('Authoritzation', getAuthForm());

  document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true });
}
