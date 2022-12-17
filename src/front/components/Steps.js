import React from "react";
import {Link} from 'react-router-dom';
import useApp from "front/hooks/useApp";
import { useNavigate } from "react-router-dom";

export default function Steps(props){
    const {steps} = useApp();
    const navigate = useNavigate();
    const handleStepChange = function(e){
        const title = e.currentTarget.dataset.title;
        const selectedStep = steps.find((step)=>step.title === title)
        if(selectedStep.visited){
            console.log(selectedStep.title)
            if(selectedStep.title == 'step1'){
                navigate('/');
                return
            }
            navigate(`/${selectedStep.title}`);
        }
    }
    const renderClasses = function(step){
        const stepsObj = {}
        steps.forEach((step)=>{stepsObj[step.title] = step.visited})
        switch (step) {
            case 'step1':
                return props.step1 ? 'steps active' : (stepsObj[step] ? 'steps visited' : 'steps');
            case 'step2':
                return props.step2 ? 'steps active' : (stepsObj[step] ? 'steps visited' : 'steps');
            case 'step3':
                return props.step3 ? 'steps active' : (stepsObj[step] ? 'steps visited' : 'steps');
            case 'step4':
                return props.step4 ? 'steps active' : (stepsObj[step] ? 'steps visited' : 'steps');
            case 'step5':
                return props.step5 ? 'steps active' : (stepsObj[step] ? 'steps visited' : 'steps');
            default:
                return 'steps';
        }
    }
    return (
        <div className="container small-container steps-container d-md-flex justify-content-center align-items-center my-5">
            <div className="progresses">
                <div className={renderClasses('step1')} onClick={(e)=>handleStepChange(e)} data-title="step1">
                    <span>1</span>
                </div>
                <span className="line"></span>
                <div className={renderClasses('step2')} onClick={(e)=>handleStepChange(e)} data-title="step2">
                    <span>2</span>
                </div>
                <span className="line"></span>
                <div className={renderClasses('step3')} onClick={(e)=>handleStepChange(e)} data-title="step3">
                    <span>3</span>
                </div>
                <span className="line"></span>
                <div className={renderClasses('step4')} onClick={(e)=>handleStepChange(e)} data-title="step4">
                    <span>4</span>
                </div>
                <span className="line"></span>
                <div className={renderClasses('step5')} onClick={(e)=>handleStepChange(e)} data-title="step5">
                    <span>5</span>
                </div>
            </div>
        </div>
    )
}