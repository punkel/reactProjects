import { createStore } from 'redux';

// action types
export const ADD_LGLIST = "ADD_LGLIST"
export const ADD_LG = "ADD_LG";
export const DEL_LG = "DEL_LG";
export const CHANGE_LG = "CHANGE_LG"
export const CHANGE_NICK = "CHANGE_NICK"

// actions
export function addLGList(list){
    return {
        type: ADD_LGLIST,
        payload: {
            list
        }
    }
}

let nextLGId = 0;
const defaultLG = {name: "Die Arche", stufe: 10, faktor: 1.9}

// input: {name: "Die Arche", stufe: 10, faktor: 1.9}
export function addLG(lg = defaultLG){
    return {
        type: ADD_LG,
        payload: {
            id: ++nextLGId,
            lg
        }
    }
}

// input: {id: 1}
export function delLG(id){
    return {
        type: DEL_LG,
        payload: id
    }
}

// input: {id: 1, name: "Die Arche", stufe: 10, faktor: 1.9}
export function changeLG(lg){
    return {
        type: CHANGE_LG,
        payload: lg
    }
}

// input: {nick: "nick"}
export function changeNick(nick){
    return {
        type: CHANGE_NICK,
        payload: nick
    }
}

// selectors
export const getLGList = store => store.lgList
export const getLGs = store => store.lgs

// reducer
function lgListReducer(state, action){
    //console.log("lgListReducer", state, action);
    // init
    if(state === undefined ){
        return []
    }
    if( action.type === ADD_LGLIST ){
        return action.payload.list
    } else {
        return state
    }
}

function lgsReducer(state, action){
    //console.log("lgsReducer", state, action);
    if(state === undefined){
        return []
    }
    var tmp = []
    switch (action.type) {
        case ADD_LG:
            var {id, lg} = action.payload
            state.push({
                id: id,
                name: lg.name,
                stufe: lg.stufe,
                faktor: lg.faktor
            })
            state.forEach(lg => {
                tmp.push(lg)
            });
            return tmp;
        case DEL_LG:
            tmp = state.filter(lg => {
                return lg.id !== action.payload
            })
            return tmp;
        case CHANGE_LG:
            var lg = action.payload
            state.forEach(tmpLG => {
                if(tmpLG.id === lg.id){
                    tmpLG.name = lg.name;
                    tmpLG.stufe = lg.stufe;
                    tmpLG.faktor = lg.faktor;
                }
            });
            state.forEach(lg => {
                tmp.push(lg)
            });
            return tmp;
        default:
            return state;
    }
}

function nickReducer(state, action){
    switch (action.type) {
        case CHANGE_NICK:
            return action.payload;
        default:
            return state;
    }
}

const initStore = {
    nick: "",
    lgList: [],
    lgs: []
}

export function rootReducer(state = initStore, action) {
    return {
        nick: nickReducer(state.nick,action),
        lgList: lgListReducer(state.lgList,action),
        lgs: lgsReducer(state.lgs,action)
    }
}

// store
export const store = createStore(rootReducer)
