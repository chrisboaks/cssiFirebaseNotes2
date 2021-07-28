let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const getNotes = () => {
    console.log('getting notes for', googleUser.uid);
    const label = document.querySelector('#labelInput').value;

    const notesRef = firebase.database().ref(`users/${googleUser.uid}`)
    // https://stackoverflow.com/questions/40471284/firebase-search-by-child-value
    notesRef.orderByChild('label').equalTo(label).on('value', (db) => {
        const data = db.val();
        renderData(data);
    })
}

const renderData = (data) => {
    console.log(data);
    // let html = '';
    for (const dataId in data) {
        const note = data[dataId];
        const columnEl = dynamicRenderCard(note);
        document.querySelector('#app').appendChild(columnEl)
        // const cardHtml = renderCard(note);
        // html += cardHtml;
    }
    // document.querySelector('#app').innerHTML = html;
    // add html to the page
}

const renderCard = (note) => {
    // convert a note to html and return it
    return `
        <div class="column is-one-quarter">
            <div class="card">
                <header class="card-header">
                    <span class="card-header-title">${ note.title }</span>
                </header>
                <div class="card-content">
                    <div class="content">${ note.text }</div>
                </div>
            </div>
        </div>
    `
}

const dynamicRenderCard = (note) => {
    const columnEl = document.createElement('div')
    columnEl.className = 'column is-one-quarter'
    
    const cardEl = document.createElement('div')
    cardEl.className = 'card'

    // Header element
    const headerEl = document.createElement('header')
    headerEl.className = 'card-header'
    const spanEl = document.createElement('span')
    spanEl.className = 'card-header-title'
    spanEl.innerText = note.title
    headerEl.appendChild(spanEl)

    // Content element
    const cardContentEl = document.createElement('div')
    cardContentEl.className = 'card-content'
    const contentEl = document.createElement('div')
    contentEl.className = 'content'
    contentEl.innerText = note.text
    cardContentEl.appendChild(contentEl)

    // Footer element
    const cardFooterEl = document.createElement('footer')
    cardFooterEl.className = 'card-footer'
    const nameSpan = document.createElement('span')
    nameSpan.className = 'card-footer-item'
    nameSpan.innerText = googleUser.displayName
    const emailSpan = document.createElement('span')
    emailSpan.className = 'card-footer-item'
    emailSpan.innerText = googleUser.email
    cardFooterEl.appendChild(nameSpan)
    cardFooterEl.appendChild(emailSpan)

    cardEl.appendChild(headerEl)
    cardEl.appendChild(cardContentEl)
    cardEl.appendChild(cardFooterEl)
    columnEl.appendChild(cardEl)

    return cardEl;
}