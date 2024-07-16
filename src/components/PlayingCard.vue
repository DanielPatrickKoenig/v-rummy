<template>
    <div
        class="playing-card"
        :class="`playing-card-${suite}`"
    >
        {{ card }}
    </div>
</template>

<script>
export default {
    props: {
        card: {
            required: true,
            type: Number,
        },
        suite: {
            required: true,
            type: Number,
        }
    }
}
</script>

<style scoped>
.playing-card{
    display: flex;
    width: 30px;
    height: 50px;
    justify-content: center;
    align-items: center;
    font-size: 20px;
}
.playing-card-1{
    background-color: red;
}
.playing-card-2{
    background-color: blue;
}
.playing-card-3{
    background-color: green;
}
.playing-card-4{
    background-color: yellow;
}
</style>