import React, {Component}  from 'react';
import { createStore } from 'redux'
import './DrugSteadyState.css';
import {getHalfLifeUpdate, getDosageUpdate, getNumDaysUpdate} from "./actions";
import { drugSteadyStateReducer} from "./reducers";

class  DrugSteadyState extends Component {
    

    constructor() {
        super();
        this.store = createStore(drugSteadyStateReducer);
        this.store.subscribe(() => {
            let state = this.store.getState();
            console.log(state);
            let rate = this.getRate(state.halfLife);
            console.log("rate " + rate);
            this.setState(()=> {return {
                dosage: state.dosage,
                halfLife : state.halfLife,
                halfLifeValid : state.halfLifeValid,
                dosageValid : state.dosageValid,
                rate : rate,
                numDays : state.numDays
            }});
        });
        this.state = {
            dosage: 0,
            halfLife : 0,
            rate : 0,
            halfLifeValid : false,
            numDays : 20,
            threshhold : 0.05,
            dosageValid : false
        }

        this.handleHalfLifeChange = this.handleHalfLifeChange.bind(this);
        this.handleDosageChange = this.handleDosageChange.bind(this);
        this.getRate = this.getRate.bind(this);
        this.increaseNumDays = this.increaseNumDays.bind(this);
        this.getDailyConcentrations = this.getDailyConcentrations.bind(this);
    }

    handleHalfLifeChange (event) {
        console.log("half-life: " + event.target.value);
        this.store.dispatch(getHalfLifeUpdate(parseFloat(event.target.value)));
    }

    handleDosageChange (event) {
        console.log("dosage: " + event.target.value);
        this.store.dispatch(getDosageUpdate(parseFloat(event.target.value)));
    }

    getRate (halfLife) {
        return -Math.log(2)/halfLife;
    }

    getStartBloodConcentration (state, day) {
        const dayMultiplier = Math.exp(24*state.rate);
        let sum = 0;
        for (let i = 0; i <= day; i++) {
            sum += state.dosage*((dayMultiplier)**i);
        }
        return sum;
    }

    getDailyConcentrations (state) {
        let arr = [];
        for (let i = 0; i < state.numDays; i++) {
            arr.push(this.getStartBloodConcentration(state, i));
        }
        return arr;
    }

    increaseNumDays (state) {
        let numDays = state.numDays + 10;
        this.store.dispatch(getNumDaysUpdate(numDays));
    }

    render () { 
        return (
            <div className="DrugSteadyState">
                <p className = "info"> 
                    This widget is for information purposes only.
                </p>
                <p className = "info">
                    You can typically find the elimination half-life of a drug 
                    in references such as Wikipedia.  If they give a rage instead 
                    of a specific number, just choose something in the middle.
                </p>
                <form>
                    <div className = {"form-group"}>
                        <label>Drug Half Life (in hours)</label>
                        <input 
                            className = {"form-control"} 
                            type="number" 
                            onChange = {this.handleHalfLifeChange} 
                            required
                        />
                        <label>Dosage per day (in milligrams)</label>
                        <input 
                            className = {"form-control"} 
                            type="number" 
                            onChange = {this.handleDosageChange} 
                            required
                        />
                    </div>
                </form>

                { this.state.halfLifeValid && this.state.dosageValid &&
                    <div>
                        <p className = "info">
                            So the individual is taking <strong>{this.state.dosage} mg</strong> of a drug
                            having an elimination half-life of <strong>{this.state.halfLife} hours</strong>.
                        </p>
                        <p className = "info">
                            Below we see approximate total blood content of the drug remaining 
                            at the beginning of each day, immediately after taking that day's dose 
                            of the drug.
                        </p>
                        <p className = "info">
                            Typically it takes only a few days for the numbers to level out, 
                            after which you see only small daily changes.
                        </p>
                        <h2>Daily Blood Levels</h2>
                        <div className = "blood-levels-outer">
                            <table className="table table-striped blood-levels">
                                <thead>
                                    <tr>
                                        <th scope="col">Day</th>
                                        <th scope="col">Blood level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.getDailyConcentrations(this.state).map(function(val, index){
                                        return (
                                            <tr key={ index }>
                                                <th scope="row">{index}</th>
                                                <td>{val.toFixed(3)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className = "text-center more-button-div center">
                            <button 
                                className = "btn btn-default more-button"
                                onClick = {()=> this.increaseNumDays(this.state)}
                            >
                                compute more days
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default DrugSteadyState;
