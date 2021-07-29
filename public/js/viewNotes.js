let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUser = user;
        getNotes(user.uid);
    } else {
        window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

function getNotes(userId) {
    const notesRef = firebase.database().ref(`users/${userId}`);
    notesRef.on('value', (db) => {
        const data = db.val();
        renderData(data);
    });
}

function renderData(data) {
    let html = '';
    for (const dataKey in data) {
        const note = data[dataKey];
        const cardHtml = renderCard(note);
        html += cardHtml;
    }
    document.querySelector('#app').innerHTML = html;
}

function renderCard(note) {
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
    `;
}

// Try refactoring the code using different DOM methods, 
// to dynamically build the Bulma Cards.