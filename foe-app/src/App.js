// std imports
import React from 'react';
import { connect } from 'react-redux';

// own imports
import { addLGList, addLG, changeNick } from './store/store.js'
import ListLGs from './comp/ListLGs.js';

// database
import {LG} from './source/gdz_db.js'

function saveData(lgs, nick){
    // save LGs

    var time = new Date();
    time.setTime(time.getTime() + (30*24*60*60*1000));
    var save = "";
    if(lgs.length > 0){
        save = "lgs:";
        for(var L of lgs){
            save = save.concat(L.name,",",L.stufe.toString(),",",L.faktor.toString(),":")
        }
    }
    save = save.concat(nick)
    var cooksave = save + ";" +
                "expires=" + time.toUTCString() + ";" +
                "path=/";
    //console.log("Unmount",cooksave);
    document.cookie = cooksave;
}

class App extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            loaded: false
        }
        this.clickHandler = this.clickHandler.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }


    componentDidMount(){
        //console.log("Mount");
        var L = [];
        var tmp = [];

        for(L of LG){
            var name = L[0].substr(0,L[0].length-4);
            if( name !== tmp[tmp.length-1]) {
                tmp.push(name)
            }
        }

        this.props.addLGList(tmp);

        // load LGs and nick from cookies

        var cookload = decodeURIComponent(document.cookie).split(':');
        var tmp2 = {};

        if(cookload[0].length===3){
            for(var i=1;i<cookload.length-1;i++){
                tmp2=cookload[i].split(',');
                this.props.addLG({
                    name: tmp2[0],
                    stufe: (tmp2[1] === "NaN" ? 10 : parseInt(tmp2[1])),
                    faktor: (tmp2[2] === "NaN" ? 1.9 : parseFloat(tmp2[2]))
                })
            }
        }

        this.props.changeNick(cookload[cookload.length-1]);

        this.setState({
            loaded: true
        })
    }

    clickHandler(event){
        var {id} = event.target;
        if( id === "1"){
            this.props.addLG()
        }
    }

    changeHandler(event){
        var {id, value} = event.target;
        if( id === "Nick" ){
            this.props.changeNick(value)
        }
    }

    render(){
        if(this.state.loaded){
            saveData(this.props.lgs, this.props.nick)
        }
        return (
            <div>
                <button
                    id="1"
                    onClick={this.clickHandler}>
                    Add LG
                </button>
                <label> Nick: </label>
                <input
                    type="text"
                    id="Nick"
                    onChange={this.changeHandler}
                    value={this.props.nick}
                    />
                <ListLGs />
            </div>
        )
    }
}

function updateProps(state) {
    return {
        nick: state.nick,
        lgs: state.lgs
    }
}

export default connect(
    updateProps,
    { addLGList, addLG, changeNick }
)(App);
