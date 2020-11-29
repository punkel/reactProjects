import React from 'react';
import { connect, useSelector } from 'react-redux';
import LGMaz from './LGMaz.js'
import { getLGList } from '../store/store.js'

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
        <div>
            {lgs}
        </div>
    )
}

function mapStateToProps (state){
    //console.log("mapStateToProps", state);
    return {
        lgs: state.lgs,
    }
}

export default connect(
    mapStateToProps
)(ListLGs)
