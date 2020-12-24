import Vue from 'vue';
import Vuex, { Store } from "vuex";
import htp from '@/utils/axios.js'
import PubSub from 'pubsub-js'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        t: 0,//时间戳
        scheduleId: 0,
        username: '',
        token: '',
        ws:null,
        heartCheck: {
            timeout:3000,
            timeoutObj: null,
            serverTimeoutObj: null,
            reset:function(ws,t) {
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
                // console.log(this.serverTimeoutObj)
                this.start(ws,t);
            },
            start:function(ws,t) {
                // console.log('start',ws);
                var self = this;
                this.timeoutObj = setTimeout(function() {
                    //这里发送一个心跳，后端收到后，返回一个心跳消息
                    let msg = {
                        cmd:"ping"
                    }
                    let data = {
                        message: msg, 
                        scheduleId: "computer", 
                        username: "computer" + t 
                    }
                    ws.send(JSON.stringify(data));
                    self.serverTimeoutObj = setTimeout(function() {
                        ws.close();
                    }, self.timeout);
                }, this.timeout)
            }
        },
        lockReconnect: false,//避免重复连接
        timeInterval:null,
    },
    mutations: {
        updatet(state, t) {
            state.t = t
        },
        updateScheduleId(state, scheduleId) {
            state.scheduleId = scheduleId
        },
        updateUsername(state, username) {
            state.username = username
        },
        updateToken(state, token) {
            state.token = token
        },
        createWebSocket(state) {
            let host = htp.host.replace("http", "");
            let t = new Date().getTime();
            this.commit("updatet", t);
            const wsuri = "ws" + host + "/mhys/connectWebSocket/computer,computer" + t;
            try {
                state.ws = new WebSocket(wsuri);
                this.commit("init");
            } catch (e) {
                console.log('catch');
                this.commit("reconnect");
            }
        },
        init(state) {
            var self = this
            state.ws.onclose = function() {
                console.log('链接关闭');
                self.commit("reconnect");
            };
            state.ws.onerror = function() {
                console.log('发生异常了');
                self.commit("reconnect");
            };
            state.ws.onopen = function() {
                //心跳检测重置
                state.heartCheck.start(state.ws,state.t);
            };
            state.ws.onmessage = function(e) {
                // console.log('接收到消息');
                var self = this
                let data = JSON.parse(e.data);
                if (data.textMessage) {
                    let arr = JSON.parse(data.textMessage);
                    if(arr.cmd == "ping") {
                        state.heartCheck.reset(state.ws, state.t);
                    }
                    if (arr.cmd == 'vertifyCode') {
                        PubSub.publish("vertifyCode", arr)
                    }
                    if (arr.cmd == "startSceen") {
                        PubSub.publish("startSceen", arr)
                    }
                    if (arr.cmd == 'closeSceen') {
                        PubSub.publish("closeSceen", arr)
                    }
                    if (arr.cmd == 'pptAddress') {
                        PubSub.publish("pptAddress", arr)
                    }
                    if (arr.cmd == "changePage") {
                        PubSub.publish("changePage", arr)
                    }
                    if (arr.cmd == "getAcc") {
                        PubSub.publish("getAcc", arr)
                    }
                    if (arr.cmd == "endAcc") {
                        PubSub.publish("endAcc", arr)
                    }
                    if (arr.cmd == "movestart") {
                        PubSub.publish("movestart", arr)
                    }
                    if (arr.cmd == "closeSceen") {
                        PubSub.publish("closeSceen", arr)
                    }
                    if (arr.cmd == "boradToScreen") {
                        PubSub.publish("boradToScreen", arr)
                    }
                    if (arr.cmd == "clearPPT") {
                        PubSub.publish("clearPPT", arr)
                    }
                    if (arr.cmd == "pointShow") {
                        PubSub.publish("pointShow", arr)
                    }
                    if (arr.cmd == "checkIn") {
                        PubSub.publish("checkIn", arr)
                    }
                    if (arr.cmd == "vote") {
                        PubSub.publish("vote", arr)
                    }
                    if (arr.cmd == "closeCheckIn") {
                        PubSub.publish("closeCheckIn", arr)
                    }
                    if (arr.cmd == "refresh_check_list") {
                        PubSub.publish("refresh_check_list", arr)
                    }
                    if (arr.cmd == "endCheckIn") {
                        PubSub.publish("endCheckIn", arr)
                    }
                    if (arr.cmd == "closeVote") {
                        PubSub.publish("closeVote", arr)
                    }
                    if (arr.cmd == "refresh_vote_list") {
                        PubSub.publish("refresh_vote_list", arr)
                    }
                }
            }
        },
        reconnect(state) {
            if (state.lockReconnect) {
                return;
            }
            state.lockReconnect = true
            state.timeInterval && clearTimeout(state.timeInterval);
            state.timeInterval = setTimeout(()=>{
                this.commit("createWebSocket")
                state.lockReconnect = false
            },4000);
        },
        sendMsg(state,data) {
            state.ws.send(JSON.stringify(data))
        }
    }
});