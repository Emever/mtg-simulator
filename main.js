console.log("[main.js script file snippet invoked]");

var deck = new CardGroup();
var hand = new CardGroup();

function generateDeck() {
    let txt = document.getElementById("library").value;
    var lines = txt.split('\n');

    deck.reset();
    hand.reset();

    var nextCardId = 0;
    lines.forEach(function(line) {
        if (line == "") { return }

        var nCard = 0;
        var name = "";
        
        if (isNaN(parseInt(line[0]))) {
            nCard = 1;
            name = line;

        } else {
            if (line[1] == " ") {
                nCard = line[0];
                name = line.substring(2);

            } else if (line[1] != "") {
                nCard = parseInt(line[0] + line[1]);
                name = line.substring(3);
            }
        }

        for (var n=0; n<nCard; n++) {
            deck.push(new DeckCard(nextCardId++, name));
        }
    })

    shuffle();
    draw(0);

    log("deck updated and shuffled, hand now empty");
    loadDeckImages();   // through the API manager
}

function shuffle() {
    var currentIndex = deck.size();

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [deck.cards[currentIndex], deck.cards[randomIndex]] = [deck.cards[randomIndex], deck.cards[currentIndex]];
    }
}

function draw(nCards) {
    if (nCards > deck.size()) { // check if you can draw as many cards as requested
        log("you can't draw that many cards...");
        
    } else { // if so >>
        for (var i=0; i<nCards; i++) {
            hand.push(deck.pop());
        }
        
        updateHandDisplay();
        log("drawn " + nCards + " cards (" + deck.size() + " remaining).");
    }
}

function removeCard(cardLi, cardId) {
    cardLi.remove();

    const i = hand.getIndexForCardId(cardId)
    // only splice array when item is found (!= -1):
    if (i > -1) { hand.cards.splice(i, 1); } // 2nd parameter means remove one item only

    updateHandDisplay();
}

function updateHandDisplay() {
    const element = document.getElementById("hand");
    while (element.firstChild) { element.removeChild(element.lastChild); }
    hand.cards.forEach(card => {
        element.insertAdjacentHTML("beforeend", "<li onclick=\"removeCard(this, " + card.id + ")\" onmouseover=\"updateCurrentCardImage(" + card.id + ")\" onmouseleave=\"updateCurrentCardImage(-1)\">"+card.name+"</li>");
    });
}

function updateCurrentCardImage(id) {
    let htmlIMG = document.getElementById("hoverCardIMG");
    if (htmlIMG == null) return

    // if there was an error, print default Magic card backface
    if (id < 0) {
        htmlIMG.src = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=0&type=card";
        
    } else { // if 'id' is valid, update the current image display
        let currentCard = hand.getCardWithId(id);
        if (currentCard != null) {
            htmlIMG.src = currentCard.imageURL;
        }
    }
}

function log(msg) {
    document.getElementById("log").innerText = msg;
}

function loadDeckImages() {
    this.deck.cards.forEach(card => {

        // try to obtain the card image with magicthegathering.io API
        APIprovider.getCardData(APIprovider.mtgioURL, card.name, function(responseJSON) {
            if (!APIprovider.obtainCardImageFromMTGIOjson(card, responseJSON.cards)) {

                // if error / image not found, try with scryfall API:
                APIprovider.getCardData(APIprovider.scryfallURL, card.name, function(responseJSON) {
                    if (!APIprovider.obtainCardImageFromSCRYFALLjson(card, responseJSON)) {

                        // error logging if both apis failed...
                        log("Couldn't retrieve image for \"" + card.name + "\"");
                    }
                });
            }
        })
    });
}
