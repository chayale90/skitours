import React from "react";
import {Link} from 'react-router-dom';

export default function Steps(props){
    return (
        <div className="container small-container steps-container d-md-flex justify-content-center align-items-center my-5">
            <div className="progresses">
                <Link to="/">
                <div className={props.step1 ? 'steps active' : 'steps'}>
                    <span>1</span>
                </div>
                </Link>
                <span className="line"></span>
                <Link to="/step2">
                <div className={props.step2 ? 'steps active' : 'steps'}>
                    <span>2</span>
                </div>
                </Link>
                <span className="line"></span>
                <Link to="/step3">
                <div className={props.step3 ? 'steps active' : 'steps'}>
                    <span>3</span>
                </div>
                </Link>
                <span className="line"></span>
                <Link to="/step4">
                <div className={props.step4 ? 'steps active' : 'steps'}>
                    <span>4</span>
                </div>
                </Link>
                <span className="line"></span>
                <Link to="/step5">
                <div className={props.step5 ? 'steps active' : 'steps'}>
                    <span>5</span>
                </div>
                </Link>
            </div>
        </div>
    )
}