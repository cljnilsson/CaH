import Mongo from "../MongoDB/mongo";

/* From https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

class Deck {
	private backup = [];
	private cards = [];

    async getCards() {
        this.cards = await Mongo.getAllWhiteCards();
        this.cards = shuffle(this.cards);
    }

    static async create() {
        let deck = new Deck();

        await deck.getCards();

        return deck;
    }

    drawX(num : number) {
        let arr = [];
        for(let i = 0; i < num; i++) {
            arr.push(this.draw());
        }
        return arr;
    }

    draw() {
        /*
            Draw cards, move drawn card to backup
        */
        let top = this.cards.pop();
        this.backup.push(top);
        if(this.cards.length === 0) {
            console.log("Shuffling deck");
            this.shuffle();
        }

        return top;
    }

    shuffle() {
        /*
            Shuffle backup, then make copy of backup to cards. Make sure to reset backup
        */
       this.backup = shuffle(this.backup);
       this.cards = this.backup.slice(0);
       this.backup = [];
    }
}

export default Deck;