import React, {Component}  from 'react';
import { createStore } from 'redux'
import './DrugSteadyState.css';
import {getHalfLifeUpdate, getDosageUpdate} from "./actions";
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
                rate : rate
            }});
        });
        this.state = {
            dosage: 0,
            halfLife : 0,
            rate : 0,
            numDays : 20
        }

        this.handleHalfLifeChange = this.handleHalfLifeChange.bind(this);
        this.handleDosageChange = this.handleDosageChange.bind(this);
        this.getRate = this.getRate.bind(this);
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
        const numDays = 48;
        let arr = [];
        for (let i = 0; i < numDays; i++) {
            arr.push(this.getStartBloodConcentration(state, i));
        }
        return arr;
    }

    render () { 
        return (
            <div className="DrugSteadyState">
                <p className = "info"> 
                    This app is for information purposes only.
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
                <p className = "info">
                    So the individual is taking <strong>{this.state.dosage} mg</strong> of a drug
                    having an elimination half-life of <strong>{this.state.halfLife} hours</strong>.
                </p>
                <p>
                    Below we see approximate total blood content of the drug remaining 
                    at the beginning of each day, immediately after taking that day's dose 
                    of the drug.
                </p>
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
                                        <td>{val}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default DrugSteadyState;
