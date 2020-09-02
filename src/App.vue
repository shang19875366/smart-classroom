<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    this.localSocket()
  },
  methods:{
    onopen(){
      console.log('长连接连接成功')
    },
    localSocket(){
         if("WebSocket" in window){
            let host = this.$htp.host.replace("http", "");
            const wsuri = "ws" + host + "/our/connectWebSocket/computer";
            this.ws = new WebSocket(wsuri);
            this.$globalWs.setWs(this.ws)
            this.ws.onopen = this.onopen()
            this.ws.onclose = ()=>{
                // 关闭 websocket
                console.log("连接已关闭...");
                setTimeout(() => {
                  this.localSocket();
                }, 2000);
            }
         }else{
            console.log("您的浏览器不支持 WebSocket!");  // 浏览器不支持 WebSocket
         }
    }
  }
}
</script>

<style>
body,html,#app{
 width: 100%;
 height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
}
</style>
