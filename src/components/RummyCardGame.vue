<template>
    <div>
        <div v-if="game">
            <button @click="turn">Take Turn</button>
        </div>
    </div>
</template>

<script>
import RummyGame from '@/classes/RummyGame'
export default {
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

</style>