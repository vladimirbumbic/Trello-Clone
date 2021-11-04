const dropZones = document.querySelectorAll('.dropzone');
const colors = {
    backlog: 'cyan',
    progress: 'green',
    complete: 'blue',
    onhold: 'yellow',
};

document.addEventListener('click', (elem) => {
    e = elem.target;
    if (e.classList.contains('delete')) {
        deleteCard(e);
    }
});

document.addEventListener('submit', (elem) => {
    elem.preventDefault();
    e = elem.target;
    let text = e.querySelector('input').value;
    text = Array.prototype.every.call(text, (letter) => letter == ' ');
    if (e.querySelector('input').value.length > 0 && !text) {
        createElement(e);
        e.querySelector('input').value = '';
    }
});

function createCardDrag() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
    });
}

function dragStart() {
    dropZones.forEach((dropzone) => dropzone.classList.add('drop'));
    this.classList.add('drag');
}

function dragEnd() {
    dropZones.forEach((dropzone) => dropzone.classList.remove('drop'));
    this.classList.remove('drag');
}

dropZones.forEach((dropzone) => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('dragleave', dragLeave);
    dropzone.addEventListener('drop', drop);
});

function dragOver(event) {
    this.classList.add('over');
    const child = recreateCard();
    let target = event.target;
    if (child && target != this) {
        this.insertBefore(child, target);
    } else if (child) {
        this.appendChild(child);
    }
    event.preventDefault();
    saveCards();
}

function recreateCard() {
    const card = document.querySelector('.drag');
    const color = card.parentElement.classList[1];
    card.style.border = '1px solid ' + colors[color];
    return card;
}

function dragLeave() {
    this.classList.remove('over');
    saveCards();
}

function drop() {
    this.classList.remove('over');
}

function createElement(elem) {
    const column = elem.parentNode.parentNode.parentNode;
    const dropzone = column.querySelector('.dropzone');
    const input = elem.querySelector('input').value;
    if (dropzone.classList.contains('backlog')) {
        newCard = createCard(input, 'backlog');
    }
    if (dropzone.classList.contains('progress')) {
        newCard = createCard(input, 'progress');
    }
    if (dropzone.classList.contains('complete')) {
        newCard = createCard(input, 'complete');
    }
    if (dropzone.classList.contains('onhold')) {
        newCard = createCard(input, 'onhold');
    }
    dropzone.appendChild(newCard);
    createCardDrag();
    saveCards();
}

function createCard(text, type) {
    const card = createModelCard(type);
    const content = createContent(text);
    const button = createButtonDelete();

    card.appendChild(content);
    card.appendChild(button);
    return card;
}

function createModelCard(color) {
    const card = document.createElement('div');
    card.setAttribute('draggable', 'true');
    card.setAttribute('class', 'card');
    card.style.border = '1px solid ' + colors[color];
    return card;
}

function createContent(text) {
    const content = document.createElement('div');
    content.setAttribute('class', 'content');
    const txt = document.createTextNode(text);
    content.appendChild(txt);
    return content;
}

function createButtonDelete() {
    const button = document.createElement('button');
    button.setAttribute('class', 'delete');
    button.setAttribute('title', 'delete');
    const txt = document.createTextNode('delete');
    button.appendChild(txt);
    return button;
}

function deleteCard(e) {
    e.parentNode.remove();
    saveCards();
}

function saveCards() {
    const cardsBacklog = document.querySelectorAll('.backlog>.backlog>.card');
    const cardsProgress = document.querySelectorAll(
        '.progress>.progress>.card'
    );
    const cardsComplete = document.querySelectorAll(
        '.complete>.complete>.card'
    );
    const cardsOnhold = document.querySelectorAll('.onhold>.onhold>.card');
    const listBacklog = [];
    const listProgress = [];
    const listComplete = [];
    const listOnhold = [];
    cardsBacklog.forEach((card) => {
        listBacklog.push(formatText(card));
    });
    cardsProgress.forEach((card) => {
        listProgress.push(formatText(card));
    });
    cardsComplete.forEach((card) => {
        listComplete.push(formatText(card));
    });
    cardsOnhold.forEach((card) => {
        listOnhold.push(formatText(card));
    });
    localStorage.setItem('cardsBacklog', formatJSON(listBacklog));
    localStorage.setItem('cardsProgress', formatJSON(listProgress));
    localStorage.setItem('cardsComplete', formatJSON(listComplete));
    localStorage.setItem('cardsOnhold', formatJSON(listOnhold));
}

function formatText(text) {
    let txt = text.innerText;
    const del = txt.indexOf('delete');
    return txt.slice(0, del).trim();
}

function formatJSON(array) {
    const json = JSON.stringify(array);
    return json;
}

function restoreFromJSON(item) {
    return localStorage.getItem(item);
}

function restoreCards() {
    const cardsBacklog = JSON.parse(restoreFromJSON('cardsBacklog'));
    const cardsProgress = JSON.parse(restoreFromJSON('cardsProgress'));
    const cardsComplete = JSON.parse(restoreFromJSON('cardsComplete'));
    const cardsOnhold = JSON.parse(restoreFromJSON('cardsOnhold'));

    cardsBacklog.forEach((card) => {
        dropZones[0].appendChild(createCard(card, 'backlog'));
        createCardDrag();
        saveCards();
    });
    cardsProgress.forEach((card) => {
        dropZones[1].appendChild(createCard(card, 'progress'));
        createCardDrag();
        saveCards();
    });
    cardsComplete.forEach((card) => {
        dropZones[2].appendChild(createCard(card, 'complete'));
        createCardDrag();
        saveCards();
    });
    cardsOnhold.forEach((card) => {
        dropZones[3].appendChild(createCard(card, 'onhold'));
        createCardDrag();
        saveCards();
    });
}
restoreCards();
