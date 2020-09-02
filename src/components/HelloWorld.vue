<template>
  <div class="container"  v-loading="loading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <img  class="logo" src="../assets/imgs/logo.png"/>
    <div class="prompts_content" v-show="!showContainer">
        <div class="prompts_cell">
            <div class="prompts_title cx_color_white">PPT 教案</div>
            <div class="prompts_text cx_color_white">投屏已开启，PPT等相关学习资源将自动投上大屏幕</div>
        </div>
    </div>
    <div class="center" v-show="showContainer">
       <h2>请输入手机上的投屏码</h2>
       <ul class="clearfix">
         <li :class="code=='code1'?'current':''">
           <input type="text" v-model="code1" ref="code1"/>
         </li>
         <li :class="code=='code2'?'current':''">
           <input type="text" v-model="code2" ref="code2"/>
         </li>
         <li :class="code=='code3'?'current':''">
           <input type="text" v-model="code3" ref="code3"/>
         </li>
         <li :class="code=='code4'?'current':''">
           <input type="text" v-model="code4" ref="code4"/>
         </li>
       </ul>
       <div class="codes_error" v-show="show">
          投屏码无效
       </div>
       
    </div>
    <div class="sign"  v-show="showContainer">
      <img  src="../assets/imgs/sign.png"/>
      <span class="ppt">上传PPT</span>
       <input id="pptfile" type="file" @change="getUploadFile" class="upload" accept=".ppt,.pptx"/>
    </div>
    <div class="qrcodeBox" v-show="showContainer">
         <img class="qrcode" src="../assets/imgs/qrcode.png" />
         <span>移动端入口</span>
    </div>

  </div>
</template>

<script>

export default {
  name: "HelloWorld",
  data() {
    return {
      loadingText:'正在上传，请稍后',
      loading:false,
      previewPPT:false,
      code1:'',
      code2:'',
      code3:'',
      code4:'',
      code:'code1',
      websocket:null,
      randomCode:'',
      show:false,
      showContainer:true
    }
  },
  watch:{
    code1(newVal,oldVal){
        if(newVal){
          this.$nextTick(()=>{
            this.$refs.code2.focus()
            this.code='code2'
          })
        }
    },
    code2(newVal,oldVal){
        if(newVal){
          this.$nextTick(()=>{
            this.$refs.code3.focus()
            this.code='code3'
          })
        }
    },
    code3(newVal,oldVal){
        if(newVal){
          this.$nextTick(()=>{
            this.$refs.code4.focus()
            this.code='code4'
            
          })
        }
    },
    code4(newVal,oldVal){
        if(newVal){
          this.$nextTick(()=>{
            this.goLogin()
          })
        }
    },

  },
  methods:{
    clearCode(){
        this.code= 'code1'
        this.$refs.code1.focus()
        this.code1=''
        this.code2=''
        this.code3=''
        this.code4=''
        
    },
    goLogin(){
      let {code1,code2,code3,code4}=this
      let str = code1+code2+code3+code4
      
      this.websocketsend({cmd:'sendCodeToPhone',value:str})
    
    },
    lookPPT(){
      this.$router.push({path:'/lookPPT'})
    },
    getUploadFile(){
      let formData = new window.FormData()
      let pptfile = document.querySelector("input[id='pptfile']").files[0]
      
      formData.append('file', pptfile)
      this.loading = true
      this.$htp.post_('/our/upload/UploadTransPPT',formData,true).then(res=>{
          
          if(res.status == '1'){
             this.$message({
              message: '上传成功',
              type: 'success'
            });
            this.previewPPT=true
          }else{
            this.$message.error('上传失败，请重试');
          }
          this.loading = false
      }).catch(res=>{
         this.$message.error('上传失败，请重试');
        this.loading = false
      })
    },
    //接收信息
    websocketonmessage(e) {
      console.log(111)
      let data = JSON.parse(e.data);
      console.log(data)
      if (data.textMessage) {
        let arr = JSON.parse(data.textMessage);
        if (arr.cmd == "sendCode") {
          console.log(arr.value)
          this.randomCode = arr.value
        }
        if(arr.cmd =='startSceen'){

          this.loadingText = '正在打开PPT,请稍后'
          this.loading = true
          let load = setTimeout(()=>{
            this.loading = false
            clearTimeout(load)
            this.$router.push({path:'/lookPPT'})
          },2000)
        }
        if(arr.cmd == 'closeSceen'){
          this.showContainer=true
          this.clearCode()
        }
        if(arr.cmd == 'vertifyCode'){
          if(arr.value == true){
              this.loadingText = '正在投屏，请稍后'
              this.loading = true
              let load = setTimeout(()=>{
                this.websocketsend({cmd:'codeSucc'})
                this.loading = false
                clearTimeout(load)
                this.showContainer=false
                
              },2000)
          }else{
               this.show = true
              this.clearCode()
              this.websocketsend({cmd:'codeError'}) 
          }
        }

      }
    },
    //发送信息
    websocketsend(msg) {
      let data = { message: msg, usrId: "phone", to: "phone" };
      this.$globalWs.ws.send(JSON.stringify(data));
    },
  },
  created(){
    this.$globalWs.ws.onmessage = (res) =>{
      this.websocketonmessage(res)
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.$refs.code1.focus()
    })
  },
};
</script>
<style lang="scss" scoped>

.container{
  width: 100%;
  height: 100%;
  background-color: #1B1A39;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .center{
    width: 600px;
    height: 400px;
 
    h2{
      font-size: 38px;
    line-height: 54px;
    color: #ECEAFF;
    text-align: center;
    }
  }
}
.logo{
  position: absolute;
  top: 20px;
  left: 20px;
  width: 240px;
  height: 70px;
}

.el-button{
  position: relative;
    .upload{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 37px;
    opacity: 0;
  }
}
@mixin wh($value){
  width: $value;
  height: $value;
}
.clearfix{
  display: flex;
  justify-content: space-around;
}
.clearfix li{
    @include wh(100px);
    background: #FFF;
    font-size: 0.6rem;
    border-radius: 0.1rem;
    display: -webkit-box;
    -webkit-box-align: center;
    -webkit-box-pack: center;
    margin: 0 20px;
    display: inline-block;
    vertical-align: top;
    line-height:100px;
    outline: none;
    &.current{
      color: #ffa800;
      border: 1px solid #ffab00;
      font-weight: bold;
      box-shadow: rgba(255,191,0, 1.0) 0 0 6px 6px;
    }
    input{
          color: #333;
          text-shadow: 0 0 0 #333;
          @include wh(100px);
          line-height: 100px;
          display: block;
          border: 0 none;
          background: none;
          font-size: 36px;
          font-weight: bold;
          text-align: center;
          vertical-align: middle;
          outline: none;
          resize: none;
    }
}
.codes_error{
  text-align: center;
  font-size: 28px;
  color: #ff3b30;
  margin-top: 40px;
}
.login{
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #B1AEFA;
  font-size: 26px;
  cursor: pointer;
}
.prompts_content{
    width:1030px;
    height: 477px;
    border: solid #B5A191 12px;
    background-color: #2D6B66;
    border-radius: 10px;
    margin: 0 auto;
}
.prompts_title{
    line-height: 50px;
    font-size:50px;
    padding-top: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
    color: #fff;
}
.prompts_text {
    text-align: center;
    line-height: 50px;
    font-size: 30px;
    opacity: 0.6;
    margin: 60px 0px 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    
}
.sign{
  position: absolute;
  bottom: 20px;
  left: 0px;
  position: absolute;
  color: #fff;
  cursor: pointer;
  img{
    width: 160px;
    height: 40px;
  }
  .ppt{
    position: absolute;
    top: 8px;
    left: 40px;
  }
  #pptfile{
     position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 37px;
    opacity: 0;
  }
}
.qrcodeBox{
    position: absolute;
    left:20px;
    top: calc(50% - 100px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    flex-direction: column;
    span{
      margin-top: 10px;
    }
  .qrcode{
   
    width: 200px;
    height: 200px;
    }
}

</style>
