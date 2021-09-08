<template>
    <div class="content">
        <router-view></router-view>
        <!-- Aqui em router-view são injetadas as telas que o router monitora e aplica em content      -->
    </div>
</template>

<script>
export default {
    name: 'Content'
}
</script>

<style>
    .content {
        grid-area: content;
        background-color: #efefef;
        padding: 20px;
    }
</style>
