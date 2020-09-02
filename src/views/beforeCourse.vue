<template>
    <div class="containers">
        <div class="prompts_content">
            <div class="prompts_cell">
                <div class="prompts_title cx_color_white">PPT 教案</div>
                <div class="prompts_text cx_color_white">投屏已开启，PPT等相关学习资源将自动投上大屏幕</div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.containers{
  width: 100%;
  height: 100%;
  background-color: #1B1A39;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
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
</style>