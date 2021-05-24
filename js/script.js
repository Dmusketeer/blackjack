// ----------------------------------------------------
// VARIABLES
// ----------------------------------------------------

// DOM variables
let banner = document.getElementById('banner'),
    backdrop = document.getElementById('backdrop'),
    welcomeCards = document.getElementById('welcome-cards'),
    bannerTitle = document.getElementById('banner-title'),
    bannerText = document.getElementById('banner-text'),
    gamblingTable = document.getElementById('gambling-table'),
    dealerCards = document.getElementById('dealer-cards'),
    playerCards = document.getElementById('player-cards'),
    dealerScore = document.getElementById('dealer-score'),
    playerScore = document.getElementById('player-score'),
    newButton = document.getElementById('new-button'),
    hitButton = document.getElementById('hit-button'),
    standButton = document.getElementById('stand-button');

// card variables
// values must follow specific order to enable score calculation in createDeck()
let suits = ['spade', 'heart', 'diamond', 'club'],
    values = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven',
        'eight', 'nine', 'ten', 'jake', 'queen', 'king'];

// first deal status (to hide first card of dealer)
let firstDeal = true;



// ----------------------------------------------------
// OBJECTS
// ----------------------------------------------------

// dealer and player
// score is a function to return sum of card array
let dealer = {
    cards: [],
    score: function () {
        let count = 0;
        for (let i = 0; i < this.cards.length; i++) {
            count = count + this.cards[i].score;
            if (this.cards[i].score === 1 && count <= 11) {
                count = count + 10; // ace is 11 points if total is <= 21
            }
        };
        return count;
    }
}

let player = {
    cards: [],
    score: function () {
        let count = 0;
        for (let i = 0; i < this.cards.length; i++) {
            count = count + this.cards[i].score;
            if (this.cards[i].score === 1 && count <= 11) {
                count = count + 10; // ace is 11 points if total is <= 21
            }
        }
        return count;
    }
}



// ----------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------

// create deck
let deck = [];

function createDeck() {
    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let scoreTmp = valueIdx + 1; // variable to calculate score
            if (scoreTmp > 10) {
                scoreTmp = 10; // limit score to 10 for jake, queen, king
            };
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx],
                score: scoreTmp
            };
            deck.push(card);
        }
    }
    return deck;
}

// shuffle deck
function shuffleDeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }
}

// get next card from deck
function getNextCard() {
    return deck.shift();
}

// calculate score
function calculateScore(agent) {
    switch (agent) {
        case dealer:
            dealerScore.innerText = dealer.score();
            if (firstDeal === true) { // if dealers first card is hidden
                dealerScore.innerText = dealer.score() - dealer.cards[0].score;
            }
            break;
        case player:
            playerScore.innerText = player.score();
            break;
    }
}

// deal cards
function dealNewCard(agent, cardCount) {
    let targetForCards = dealerCards;
    if (agent === player) {
        targetForCards = playerCards;
    };

    // generate DOM elements by looping through agent cards
    for (let i = 0; i < cardCount; i++) {
        agent.cards.push(getNextCard());

        var newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.classList.add(agent.cards[agent.cards.length - 1].suit);
        newCard.classList.add(agent.cards[agent.cards.length - 1].value);

        // hide first card of dealer
        if (agent === dealer && dealer.cards.length === 1) {
            newCard.classList.add('hidden');
        };

        // insert to DOM
        targetForCards.appendChild(newCard);

        // call score calculation
        calculateScore(agent);
    }
}

// show game status as message
function gameStatus() {
    let message;

    // rules while player gets new cards by "hit" button
    if (firstDeal === true) {
        // player exceed 21 points
        if (player.score() > 21) {
            message = 0;
        }
    }

    // rules when player clicks "stand" button
    if (firstDeal === false) {
        // player exceed 21 points
        if (dealer.score() > 21) {
            message = 1;
        }
        // dealer has higher score
        if (dealer.score() <= 21 && dealer.score() > player.score()) {
            message = 0;
        }
        // player has higher score
        if (dealer.score() <= 21 && dealer.score() < player.score()) {
            message = 1;
        }
        // tie
        if (dealer.score() <= 21 && dealer.score() === player.score()) {
            message = 2;
        }
    }

    // show banner in DOM if message is called
    function showBanner() {
        backdrop.classList.remove('hidden');
        banner.classList.remove('hidden');
    };
    switch (message) {
        case 0:
            bannerText.innerHTML = 'Dealer wins';
            showBanner();
            break;
        case 1:
            bannerText.innerHTML = 'Player wins';
            showBanner();
            break;
        case 2:
            bannerText.innerHTML = 'Tie';
            showBanner();
            break;
    }
}







// ----------------------------------------------------
// UI INTERACTION: new game
// ----------------------------------------------------

newButton.addEventListener('click', function () {

    // remove start screen UI
    banner.classList.add('hidden');
    backdrop.classList.add('hidden');
    welcomeCards.style.display = 'none';
    bannerTitle.style.display = 'none';

    // clear data of previous Game
    deck = [];
    dealer.cards = [];
    dealerCards.innerHTML = '';
    player.cards = [];
    playerCards.innerHTML = '';
    firstDeal = true;

    // show and animate gambling table
    if (gamblingTable.className === 'hidden') {
        setTimeout(function () {
            gamblingTable.classList.remove('hidden');
        }, 500);
    } else {
        gamblingTable.classList.add('hidden');
        setTimeout(function () {
            // start new game here
            gamblingTable.classList.remove('hidden');
        }, 500);
    };

    // create and shuffle deck
    deck = createDeck();
    shuffleDeck(deck);

    // deal cards to DOM
    dealNewCard(dealer, 2);
    dealNewCard(player, 2);
});



// ----------------------------------------------------
// UI INTERACTION: hit
// ----------------------------------------------------

hitButton.addEventListener('click', function () {
    // get another card and check status of game
    dealNewCard(player, 1);
    gameStatus();
});



// ----------------------------------------------------
// UI INTERACTION: stand
// ----------------------------------------------------

standButton.addEventListener('click', function () {
    // dealer shows hidden card
    firstDeal = false;
    hiddenCard = document.querySelector('#dealer-cards .card:first-of-type');
    hiddenCard.classList.remove('hidden');
    dealerScore.innerText = dealer.score();

    // dealer must stand on 17 and must draw to 16
    while (dealer.score() < 17 && dealer.score() < player.score()) {
        dealNewCard(dealer, 1);
    }

    gameStatus();
});
