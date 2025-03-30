console.log("[api-manager.js script file snippet invoked]");


class APIprovider {

    static mtgioURL = "https://api.magicthegathering.io/v1/cards";
    static scryfallURL = "https://api.scryfall.com/cards";
    
    static apiGET(url, onCompletion) {
        return (fetch(url, { method: "GET" })
            .then((response) => response.json())
            .then((json) => onCompletion(json)));
    }

    static getCardData(url, cardName, onSuccess)  {
        var fullURL = url;

        if (url == this.mtgioURL) {
            fullURL += "?name=";
        } else {
            fullURL += "/search?q=";
        }

        fullURL += cardName;
        console.log("API call >>> \"" + fullURL + "\"")
        this.apiGET(fullURL, onSuccess)
    }


    // custom parsers for both APIs
    static obtainCardImageFromMTGIOjson(currentCard, cardList) {
        var iCard = 0;
        while (iCard < cardList.length) {
            if (currentCard.setImageURL(cardList[iCard]["imageUrl"])) return true;
            else iCard++;
        }
        return false;
    }

    static obtainCardImageFromSCRYFALLjson(currentCard, jsonResponse) {
        var iCard = 0;
        while (iCard < jsonResponse["total_cards"]) {
            if (currentCard.setImageURL(jsonResponse["data"][iCard]["image_uris"]["png"])) return true;
            else iCard++;
        }
        return false;
    }

}