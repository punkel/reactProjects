// std imports
import React from 'react';
import { connect } from 'react-redux';

// style imports
import 'bootstrap/dist/css/bootstrap.css';
import '../style/LG.css';

// own imports
import { delLG, changeLG } from '../store/store.js';

// database
import {LG} from '../source/gdz_db.js';

function mround(num, near) {
    var remain = num % near;
    return (remain >= near / 2) ? (num - remain + near) : (num - remain);
}

function round2(num) {
    //console.log("round2",num);
    return(
        parseFloat(parseInt(num * 100) / 100)
    )
}

class LGMaz extends React.Component {

    constructor(props){
        super()
        this.state = {
            LG_Name: props.LGList,
            id: props.LG.id,
            name: props.LG.name,
            stufe: props.LG.stufe,
            showStufe: props.LG.stufe.toString(),
            faktor: props.LG.faktor,
            showFaktor: props.LG.faktor.toString(),
            ausgabe: [
                //name: "P0",   // Name
                //earn: 0,      // mezaenbelohnung
                //cost: 0,      // Eigenanteil
                //costAkku: 0,  // Eigenanteil akkumuliert
                //show: true    // Show
            ]
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
        this.findLGAndClac = this.findLGAndClac.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
    }

    /* return: this.state.ausgabe like array
     */

    findLGAndClac(name=this.state.name, stufe=this.state.stufe, faktor=this.state.faktor){
        //console.log("find",name,stufe);
        var maze = []; // mezaen belohnung
        var eA = []; // Eigenanteil
        var eAA = []; // Eigenanteil
        var foundLG = LG.find((value, index, array) =>{
            var search = name + " " + (stufe < 10 ? ("00" + stufe):(stufe < 100 ? ("0" + stufe):stufe))
            return value[0] === (search);
        });

        var ret = []

        if(foundLG !== undefined) {

            maze[0] = foundLG[1];
            maze[1] = foundLG[3];

            let tmp = 0;   // helper var
            let i = 0;     // loop var

            // brechnet grund belohnungen
            for(i=2; i<6; i++){
                maze[i] = mround(maze[i-1]/i,5);
            }

            // berechnet belohnungen * faktor
            for(i=1; i<6; i++){
                tmp = maze[i] * faktor;
                maze[i] = (tmp === 0 ? 1 : Math.round(tmp));
            };

            // berechnet Eigenanteil
            tmp = 0;
            eA[0] = maze[0];
            eAA[0] = 0;
            for(i=1; i<6; i++){
                eA[0] -= maze[i];
                eA[i] = ((2*maze[i] < (maze[0] - tmp)) ? (maze[0] - tmp - (2*maze[i])) : 0); // berechnung Eigenanteil
                eAA[i] = eA[i] + eAA[i-1];
                tmp += maze[i] + eA[i];
            };

            // erstellt rueckgabe array
            for(i=0;i<6;i++){
                ret[i] = {
                    name: (this.state.ausgabe[i] === undefined ? ( i === 0 ? "Alle" : ("P"+i.toString()) ) : this.state.ausgabe[i].name),
                    earn: maze[i],
                    cost: eA[i],
                    costAkku: eAA[i],
                    show: (this.state.ausgabe[i] === undefined ? true : this.state.ausgabe[i].show)
                }
            }

        }
        return ret;
    }

    doUpdate(stufe, faktor=this.state.faktor, name=this.state.name){
        //console.log("doUpdate",stufe, faktor, name);
        faktor = round2(faktor);
        let tmp = this.findLGAndClac(name, stufe, faktor)
        //console.log("tmp",tmp);
        if(tmp.length > 0 ){
            this.props.changeLG({
                id: this.state.id,
                name: name,
                stufe: stufe,
                faktor: faktor
            })
            this.setState({
                name: name,
                stufe: stufe,
                showStufe: stufe.toString(),
                faktor: faktor,
                showFaktor: faktor.toString(),
                ausgabe: tmp
            })
        }
    }

    componentDidMount(){
        this.setState({
            ausgabe: this.findLGAndClac()
        })
    }

    clickHandler(event){
        //console.log("clickHandler",event.target);
        var { id, innerHTML } = event.target;
        if(id === "delLG") {
            this.props.delLG(this.state.id)
            return;
        }
        if(id === "stufe") {
            let stufe = this.state.stufe;
            if( innerHTML === "+"){
                stufe += 1
            }
            if( innerHTML === "-"){
                stufe -= (this.state.stufe < 2 ? 0 : 1)
            }
            this.doUpdate(stufe);
            return;
        }
        if(id === "faktor") {
            let faktor = this.state.faktor;
            if( innerHTML === "+"){
                faktor += 0.01
            }
            if( innerHTML === "-"){
                faktor -= (this.state.faktor < 1.01 ? 0 : 0.01)
            }
            this.doUpdate(this.state.stufe,faktor);
            return;
        }
    }

    changeHandler(event){
        var {id, value, type} = event.target;
        //console.log("changeHandler",id,value,type, event);
        if(id === "LG_Stufe") {
            let {_reactName, keyCode } = event;
            if(_reactName === "onKeyUp" && keyCode === 13 ){
                //console.log(parseInt(value));
                this.doUpdate(parseInt(value))
                return;
            }
            if(_reactName === "onBlur"){
                this.doUpdate(parseInt(value))
                return;
            }
            this.setState({
                showStufe: value
            })
        }
        if(id === "faktor") {
            let {_reactName, keyCode } = event;
            if(_reactName === "onKeyUp" && keyCode === 13 ){
                //console.log(parseFloat(value));
                this.doUpdate(this.state.stufe, parseFloat(value.replace(',', '.')))
                return;
            }
            if(_reactName === "onBlur"){
                this.doUpdate(this.state.stufe, parseFloat(value.replace(',', '.')))
                return;
            }
            this.setState({
                showFaktor: value
            })
        }
        if(type === "select-one") {
            this.doUpdate(this.state.stufe, this.state.faktor, value)
        }
        if(type === "checkbox") {
            let tmp = this.state.ausgabe.map(a => {
                if(id === this.state.ausgabe[0].name){
                    a.show = event.target.checked
                } else if(a.name === id){
                    a.show = !a.show;
                }
                return a
            })
            this.setState({
                ausgabe: tmp
            })
        }
    }

    render() {
        //console.log(this.state);

        // don't render if this.state.ausgabe[0] undefined
        // case initial
        if(this.state.ausgabe[0] === undefined){
            return ""
        }

        // creat LGname List
        var name_list = "";
        if(this.state.LG_Name.length > 0) {
            name_list = this.state.LG_Name.map(name => {
                    return(
                        <option key={name} value={name}>{name}</option>
                    )
                }
            );
        }

        // create checkboxs
        var checkbox = this.state.ausgabe.map(a => {
            return(
                    <label
                        className="form-check-label formLGCheckbox"
                        key={a.name} >
                        <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={this.changeHandler}
                            id={a.name}
                            checked={a.show} />
                        {a.name}
                    </label>
            )
        })

        // creat table entries
        // Kosten, Eigenanteil, Eigenanteil gesamt
        var calcs = this.state.ausgabe.map(a => {
            if(a.name !== this.state.ausgabe[0].name){
                return(
                    <tr key={a.name} ><td>{a.earn}</td><td>{a.cost === 0 ? "Sicher" : "+ " + a.cost.toString()}</td><td>{a.cost === 0 ? "-" : a.costAkku.toString()}</td></tr>
                )}
            return (<tr key="dummy"></tr>)
        })

        // creat Output outText
        // nick LGname P?(?) ...
        var outTextStd = (this.props.nick ? this.props.nick + " " : "")
        outTextStd += this.state.name
        var outTextP   = [];
        for(var i=5;i>0;i--){
            if(this.state.ausgabe[i].show)
                outTextP.push(" "+this.state.ausgabe[i].name+"("+this.state.ausgabe[i].earn+")");
        }
        var outText = outTextStd + outTextP.join('');

        // render method
        return (
            <div className="LG" >
                <form className="formLG form-group mb-3">
                    <select
                        className="form-control"
                        onChange={this.changeHandler}
                        value={this.state.name}
                        id="LG_Name">
                        {name_list}
                    </select>
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={this.clickHandler}
                        id="delLG"
                        >remove LG</button>
                    <br />
                    <br />
                    <div class="mb-3 formLGSetting">
                        <label>Stufe: </label>
                        <br />
                        <button
                            className="btn btn-secondary"
                            onClick={this.clickHandler}
                            id="stufe"
                            type="button">
                            +
                        </button>
                        <input
                            className="form-control"
                            id="LG_Stufe"
                            type="text"
                            onChange={this.changeHandler}
                            value={this.state.showStufe}
                            onBlur={this.changeHandler}
                            onKeyUp={this.changeHandler}
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={this.clickHandler}
                            id="stufe"
                            type="button">
                            -
                        </button>
                    </div>
                    <div class="mb-3 formLGSetting">
                        <label>Faktor: </label>
                        <br />
                        <button
                            className="btn btn-secondary"
                            onClick={this.clickHandler}
                            id="faktor"
                            type="button">
                            +
                        </button>
                        <input
                            className="formLGSetting  form-control"
                            id="faktor"
                            type="text"
                            onChange={this.changeHandler}
                            value={this.state.showFaktor}
                            onBlur={this.changeHandler}
                            onKeyUp={this.changeHandler}
                            />
                        <button
                            className="btn btn-secondary"
                            onClick={this.clickHandler}
                            id="faktor"
                            type="button">
                            -
                        </button>
                    </div>
                    <div className="formLGTable">
                        FP Gesamt: {this.state.ausgabe[0].earn} | Eigenanteil Gesamt: {this.state.ausgabe[0].cost}
                        <br />
                        <br />
                        <table>
                            <tr>
                                <th>Kosten</th>
                                <th>Eigenanteil</th>
                                <th>Eigenanteil gesamt</th>
                            </tr>
                            <tbody>
                                {calcs}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-3 inputOutputText">
                        <label className="form-label">Output: </label>
                        <br />
                        <input
                            className="form-control"
                            type="text"
                            value={outText}
                            onChange={()=>{}}
                            />
                    </div>
                    <div className="form-check">
                        {checkbox}
                    </div>
                </form>
            </div>
    )}

}

function updateProps(state){
    return {
        nick: state.nick
    }
}

export default connect(
    updateProps,
    { delLG, changeLG }
)(LGMaz);
