import React from 'react';
import { connect, useSelector } from 'react-redux';
import LGMaz from './LGMaz.js';
import { getLGList } from '../store/store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/LG.css';

function ListLGs (props){
    var lgs = []
    var lglist = useSelector(getLGList)
    //console.log("ListLGs");
    if( props.lgs.length > 0 && lglist.length > 0 ){
        lgs = props.lgs.map(lg=>{
            return(
                <LGMaz
                    key={lg.id}
                    LGList={lglist}
                    LG={lg}
                    />
            )
        })
    }
    return (
        <div className="containerList">
            {lgs}
        </div>
    )
}

function mapStateToProps (state){
    return {
        lgs: state.lgs,
    }
}

export default connect(
    mapStateToProps
)(ListLGs)
