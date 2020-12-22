import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        t: 0,
        flag: 0,
        scheduleId: 0,
        username: '',
        token: ''
    },
    mutations: {
        updatet(state, t) {
            state.t = t
        },
        updateFlag(state, flag) {
            state.flag = flag
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
        initSocket() {
            
        }
    }
});