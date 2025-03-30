console.log("[board-data.js script file snippet invoked]");

class DeckCard {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.imageURL = "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=884&type=card";
    }

    setImageURL(url) {
        if (url == null) return false;
        this.imageURL = url;
        return true;
    }
}

class CardGroup {

    constructor() {
        this.cards = [];
    }

    getCardWithId(id) {
        for (var i=0; i < this.size(); i++) {
            if (this.cards[i].id == id) return this.cards[i];
        }
        return null;
    }

    cardAt(index) {
        if (index < this.size()) {
            return this.cards[index];
        } else {
            return null;
        }
    }

    getIndexForCardId(cardId) {
        for(var n=0; n<this.size(); n++) {
            if (this.cardAt(n).id == cardId) return n;
        }
        return -1;
    }

    size() { return this.cards.length; }
    push(card) { this.cards.push(card); }
    pop() { return this.cards.pop(); }
    reset() { this.cards = []; }

    log() { console.log(newCard); }

};