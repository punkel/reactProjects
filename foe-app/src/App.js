// std imports
import React from 'react';
import { connect } from 'react-redux';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

// own imports
import { addLGList, addLG, changeNick } from './store/store.js'
import ListLGs from './comp/ListLGs.js';

// styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';

// database
import {LG} from './source/gdz_db.js'

const saveLGCookieName = 'LGs';
const saveNickCookieName = 'name';

class App extends React.Component {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props){
        super(props);
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

        var loadedLgs = this.props.cookies.get(saveLGCookieName);
        if(loadedLgs != null){
            var tmpI = "";
            for(tmpI of loadedLgs) {
                this.props.addLG({
                    name:tmpI.name,
                    stufe:tmpI.stufe,
                    faktor:tmpI.faktor
                })
            }
        }

        this.props.changeNick(this.props.cookies.get(saveNickCookieName));
    }

    componentDidUpdate(nextProps){
        if(nextProps.lgs !== this.props.lgs){
            this.props.cookies.set(saveLGCookieName, this.props.lgs, { path: '/', secure: true });
        }
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
            this.props.cookies.set(saveNickCookieName, value, { path: '/', secure: true  });
            this.props.changeNick(value)
        }
    }

    render(){
        return (
            <div>
                <div className="defaultSettings">
                    <button
                        type="button"
                        className="btn btn-secondary"
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
                </div>
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

export default withCookies(
    connect(
        updateProps,
        { addLGList, addLG, changeNick }
    )(App)
);
