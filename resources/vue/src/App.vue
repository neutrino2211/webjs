<template>
  <div id="app">
    <img src="./assets/logo.png" class="logo">
    <img src="./assets/favicon.png" class="logo"> 
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo{
  width:100px;
  display:inline-block;
  margin: 20px;
}
</style>
