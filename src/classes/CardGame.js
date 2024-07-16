import { shuffle, flatten, uniq } from 'lodash';
const PlayerTypes = {
    COMPUTER: 'computer',
    HUMAN: 'human'
};
export default class CardGame {
    constructor(){
        this.handSize = 5;
        this.suiteSize = 13;
        this.suiteCount = 4;
        this.pointDefault = 1;
        this.pointMatrix = {};
        this.suites = [];
        this.types = []
        this.deck = []
        this.playerTypes = [PlayerTypes.COMPUTER, PlayerTypes.HUMAN];
        this.players = [];
        this.playerIndex = 0;
    }
    initialize(){
        this.suites = [...new Array(this.suiteSize).keys().map(item => item + 1)];
        this.types = [...new Array(this.suiteCount).keys().map(item => item + 1)];
        const cardDeck = flatten(this.types.map(item => {
            return this.suites.map(_item => ({ card: _item, suite: item, points: this.pointMatrix[_item] ? this.pointMatrix[_item]: this.pointDefault }));
        }));
        this.deck = shuffle(cardDeck);
        this.deck_template = [...this.deck];
        
        this.players = this.playerTypes
            .map((item, index) => (
                {
                    type: item,
                    hand: [...new Array(this.handSize).keys()].map(item => {
                        return this.drawCard();
                    }),
                    name: `p${index}` 
                }
            ));
    }
    drawCard(){
        const pullData = this.pullItemFromCardList(this.deck);
        this.deck = pullData.list;
        return pullData.card;
    }
    pullItemFromCardList(list, index = 0){
        const returnedData = { list };
        if (list[index]) {
            returnedData.card = list[index];
            returnedData.list = list.filter((item, i) => index != i);
        }
        return returnedData;
    }
    getCardIndexInList(list, { card, suite }){
        const foundCard = list.map((item, index) => ({ card: item, index })).find(item => item.card.card === card && item.card.suite === suite)
        return foundCard ? foundCard.index : -1;
    }
    uniqueList(list){
        return uniq(list);
    }
    getCurrentPlayer(){
       return this.players[this.playerIndex];
    }
    turnAction(){

    }
    endTurn(){
        this.playerIndex++;
        if(this.playerIndex >= this.players.length){
            this.playerIndex = 0;
        }
    }

    getMasterCardIndex(card){
        return this.getCardIndexInList(this.deck_template, { card: card.card, suite: card.suite });
    }
}