import CardGame from "./CardGame";
import {flatten, uniq} from 'lodash';
export default class RummyGame extends CardGame{
    constructor(){
        super();
        this.handSize = 7;
        this.discardPile = [];
        this.sets = [];
        this.seenCards = [];
        this.cardsTakenByOtherPlayers = [];
        this.cardsNeverSeen = [];
        this.minMatchCount = 3;
    }
    turnAction(){
        const drawnCard = this.drawCard();
        this.getCurrentPlayer().hand.push(drawnCard);
        this.discard(0);
        this.endTurn();
    }

    discard(index=-1){
        if (index < 0) {
            // add ai logic
        }
        else {
            const pulledCardData = this.pullItemFromCardList(this.getCurrentPlayer().hand, index);
            this.getCurrentPlayer().hand = pulledCardData.list;
            this.discardPile.push(pulledCardData.card);
        }
    }

    getMatchables(list){
        const matchMap = this.suites.map((item, index) => {
            const matches = list.filter(_item => _item.card === item);
            const count = matches.length;
            return { match: item, count };
        }).filter(item => item.count >= this.minMatchCount);

        return matchMap.map(item => list.filter(_item => _item.card === item.match));

    }

    getRunnables(list){
        const typeGroups = this.types.map(item => {
            return list.filter(_item => _item.suite === item).sort((a, b) => a.card - b.card);
        });

        const runGroups = typeGroups.map(item => {
            const runs = [];
            item.forEach((_item, index) => {
                if(runs.length === 0){
                    runs.push([])
                }
                if(_item.card === item[index - 1]?.card + 1 || runs[runs.length-1].length === 0){
                    runs[runs.length-1].push(_item);
                }
                else{
                    runs.push([]);
                }
            });
            return runs.filter(run => run.length >= this.minMatchCount);

        });

        // console.log(typeGroups);
        let allRuns = [];
        runGroups.forEach(item => {
            allRuns = [...allRuns, ...item];
        });

        return allRuns;
    }

    getSetOptions(list){
        const options = [...this.getMatchables(list), ...this.getRunnables(list)];
        const sortedOptions = options.map(item => {
            const cards = item;
            let totalPoints = 0;
            item.forEach(_item => {
                totalPoints += _item.points;
            });
            return { cards, totalPoints, discardIndexes: item.map(_item => this.getCardIndexInList(this.discardPile, _item)).filter(_item => _item > 0) };
        }).sort((a, b) => b.totalPoints - a.totalPoints);
        
        const uniqueCardsInOptions = uniq(flatten(sortedOptions.map(item => item.cards.map(_item => this.getMasterCardIndex(_item))))).map(item => this.deck_template[item]);
        return { sortedOptions, uniqueCardsInOptions };
    }

    createSets(list){
        const { sortedOptions, uniqueCardsInOptions } = this.getSetOptions(list);
        const uniqueOptionsWithFlag = uniqueCardsInOptions.map(item => ({ ...item, used: false, played: false }));
        const setList = [];
        sortedOptions.forEach(item => {
            const cardsForSet = [...item.cards.filter(_item => !uniqueOptionsWithFlag[this.getCardIndexInList(uniqueOptionsWithFlag, _item)].used)]
            const currentSet = { player: this.getCurrentPlayer().name, cards: cardsForSet, totalCount: item.cards.reduce((a, b) => a.points + b.points) };
            const validCardCount = cardsForSet.length >= this.minMatchCount;
            if (validCardCount) {
                setList.push(currentSet);
            }
            currentSet.cards.forEach(_item => {
                const cardIndex = this.getCardIndexInList(uniqueOptionsWithFlag, _item);
                uniqueOptionsWithFlag[cardIndex].used = true;
            });
        });
        const usedCards = uniqueOptionsWithFlag.filter(item => item.used);
        const indexesInDiscardPile = usedCards.map(item => this.getCardIndexInList(this.discardPile, item)).filter(item => item >= 0).sort((a, b) => a - b);
        const firstIndexInDiscardPile = indexesInDiscardPile.length ? indexesInDiscardPile[0] : -1;
        if (firstIndexInDiscardPile >= 0){
            const discardPileLength = this.discardPile.length;
            for(let i = discardPileLength - 1; i >= firstIndexInDiscardPile; i--){
                const { card, list } = this.pullItemFromCardList(this.discardPile);
                this.discardPile = list;
                this.getCurrentPlayer().hand.push(card);
            }
            
        }
        // console.log(setList);
        // console.log(uniqueOptionsWithFlag);
        // console.log(indexesInDiscardPile);
        // console.log(this.discardPile.length);

        const newSets = setList.map(item => item.cards.map(_item => ({ ..._item, player: this.getCurrentPlayer().player })))
        this.sets = [...this.sets, ...newSets];

        this.sets.forEach(item => {
            item.forEach(_item => {
                const cardIndex = this.getCardIndexInList(this.getCurrentPlayer().hand, _item);
                const { list } = this.pullItemFromCardList(this.getCurrentPlayer().hand, cardIndex);
                this.setPlayerHand(this.getCurrentPlayer().name, list);
            });
        });
        // console.log(this.sets);
        // const newHand = this.getCurrentPlayer().hand.filter(item => this.getCardIndexInList(uniqueOptionsWithFlag, item) < 0);
        // if(newHand.join) {
        //     this.setPlayerHand(this.getCurrentPlayer().name, newHand);
        // }
        // console.log(this.getCurrentPlayer().hand);
    }
}
