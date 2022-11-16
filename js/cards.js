let current = 0;
let phrases =  [
    { ru: 'Привычка - вторая натура', eng: 'Consuetudo est altera natura' },
    { ru: 'Заметьте хорошо!', eng: 'Nota bene' },
    { ru: 'Беда не приходит одна', eng: 'Nulla calamitas sola' },
    { ru: 'Через тернии к звёздам', eng: 'Per aspera ad astra' },
];

const phrasesContainer = document.querySelector('.phrases__container');
const controlsContainer = document.querySelector('.phrases__buttons');
const engPhrases = phrasesContainer.querySelector('.eng__phrases');
const changedPhrases = phrasesContainer.querySelector('.changed__phrases');
const ruPhrases = phrasesContainer.querySelector('.ru__phrases');
const addButton = controlsContainer.querySelector('.add');
const recolorButton = controlsContainer.querySelector('.recolor');


const parentChildHeightDiff = (parent, element) => {
    const parentTop = parent.getBoundingClientRect().top;
    const elementTop = element.getBoundingClientRect().top;

    return elementTop - parentTop;
}

function cssVariableValue(name, value) {
    document.documentElement.style.setProperty(name, value);
}

const add = () => {
    const phraseText = `${current + 1} ${phrases[current]?.ru}`;
    if (current === phrases.length) return;

    current += 1;

    const phrase = document.createElement('li');
    phrase.classList.add('phrase');
    phrase.textContent = phraseText;

    ruPhrases.appendChild(phrase);
    phrase.addEventListener('click', ruToEng);

    return phrase;
}

function recolor() {
    if (engPhrases.classList.contains('recolored')) {
        engPhrases.classList.remove('recolored');
    } else {
        engPhrases.classList.add('recolored');
    }
}

const ruToEng = (event) => {
    const phrase = event.target;
    const temp = phrase.cloneNode(true);
    const selected = phrase.cloneNode(temp);

    const index = Number(phrase.innerHTML.split(' ')[0]);
    const engText = phrases[index - 1].eng;
    selected.innerHTML = `${index} ${engText}`;

    const height = phrase.offsetHeight;
    const offsetFrom = parentChildHeightDiff(phrasesContainer, phrase);
    const offsetTo = parentChildHeightDiff(phrasesContainer, engPhrases);

    cssVariableValue('--calculated-height', `${height}px`);
    cssVariableValue('--changed-from', `${offsetFrom}px`);
    cssVariableValue('--changed-to', `${offsetTo}px`);
    changedPhrases.prepend(temp);
    changedPhrases.classList.add('select');

    phrase.classList.add('hide');

    setTimeout(() => {
        engPhrases.prepend(selected);
        selected.addEventListener('click', engToRu);

        ruPhrases.removeChild(phrase);
        changedPhrases.removeChild(temp);
        changedPhrases.classList.remove('select');
    }, 1000);
}

const engToRu = (event) => {
    const phrase = event.target;
    const temp = phrase.cloneNode(true);
    const ru = phrase.cloneNode(temp);

    const index = Number(phrase.innerHTML.split(' ')[0]);
    const ruText = phrases[index - 1].ru;
    ru.innerHTML = `${index} ${ruText}`;

    const height = phrase.offsetHeight;
    const offsetFrom = parentChildHeightDiff(phrasesContainer, phrase);
    const offsetTo = parentChildHeightDiff(phrasesContainer, engPhrases);

    cssVariableValue('--calculated-height', `${height}px`);
    cssVariableValue('--changed-from', `${offsetFrom}px`);
    cssVariableValue('--changed-to', `${offsetTo}px`);
    changedPhrases.appendChild(temp);
    changedPhrases.classList.add('unselect');


    phrase.classList.add('hide');

    setTimeout(() => {
        engPhrases.removeChild(phrase);
        ruPhrases.appendChild(ru);
        ru.addEventListener('click', ruToEng);

        changedPhrases.removeChild(temp);
        changedPhrases.classList.remove('unselect');

        ru.classList.add('reduce');
        setTimeout(() => ru.classList.remove('reduce'), 1000);
    }, 1000);
}

addButton.addEventListener('click', add);

recolorButton.addEventListener('click', recolor)