<template>
    <div>
        <div v-if="game">
            <button @click="turn">Take Turn</button>
        </div>
        <h2>Pile</h2>
        <div>
            <ul class="card-group">
                <li v-for="card in discardPileCards" :key="card">
                    <PlayingCard :card="card.card" :suite="card.suite" />
                </li>
            </ul>
        </div>
        <h2>Hands</h2>
        <div v-if="game?.players">
            <div v-for="player in game.players" :key="player">
                <h3>{{ player.name }}</h3>
                <ul class="card-group">
                    <li v-for="card in player.hand" :key="card">
                        <PlayingCard :card="card.card" :suite="card.suite" />
                    </li>
                </ul>
            </div>
            
        </div>
        <h2>Sets</h2>
        <div v-if="game?.sets">
            <div v-for="(set, i) in game.sets" :key="set">
                <h3>Set {{ i }}</h3>
                <ul class="card-group">
                    <li v-for="card in set" :key="card">
                        <PlayingCard :card="card.card" :suite="card.suite" />
                    </li>
                </ul>
            </div>
            
        </div>
    </div>
</template>

<script>
import RummyGame from '@/classes/RummyGame'
import PlayingCard from './PlayingCard.vue';
export default {
    components: {
        PlayingCard,
    },
    data () {
        return {
            game: null
        };
    },
    mounted () {
        this.game = new RummyGame();
        this.game.pointMatrix = { 1: 3, 10: 2, 11: 2, 12: 2, 13: 2 };
        this.game.initialize();
        console.log(this.game.deck);
        console.log(this.game.players);
    },
    computed: {
        discardPileCards () {
            return this.game ? this.game.discardPile : [];
        },
    },
    methods: {
        turn () {
            this.game.turnAction();
            // console.log(this.game.getCurrentPlayer().name);
            // console.log('matchables');
            // console.log(this.game.getMatchables([...this.game.getCurrentPlayer().hand, ...this.game.discardPile]));
            // console.log(this.game.getRunnables([...this.game.getCurrentPlayer().hand, ...this.game.discardPile]));
            // console.log(this.game.getSetOptions([...this.game.getCurrentPlayer().hand, ...this.game.discardPile]))

            this.game.createSets([...this.game.getCurrentPlayer().hand, ...this.game.discardPile])
        }
    }

}
</script>

<style>
.card-group{
    display: flex;
    margin: 8px;
    padding: 0;
}
.card-group li{
    display: block;
    padding: 0;
    margin: 2px;
}
</style>