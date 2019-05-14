import React, {Component}  from 'react';
import { createStore } from 'redux'
import './DrugSteadyState.css';
import {getHalfLifeUpdate, getDosageUpdate, getNumDaysUpdate} from "./actions";
import { drugSteadyStateReducer, initState } from "./reducers";
import BloodLevels from "../Helpers/blood-levels";


class  DrugSteadyState extends Component {
    constructor() {
        super();
        this.store = createStore(drugSteadyStateReducer);
        this.store.subscribe(() => {
            let state = this.store.getState();
            this.setState(()=> {return {
                halfLife : state.halfLife,
                halfLifeValid : state.halfLifeValid,
                dosage: state.dosage,
                dosageValid : state.dosageValid,
                numDays : state.numDays,
                dosageDirty : state.dosageDirty,
                halfLifeDirty : state.halfLifeDirty
            }});
        });
        this.state = initState;
        this.handleHalfLifeChange = this.handleHalfLifeChange.bind(this);
        this.handleDosageChange = this.handleDosageChange.bind(this);
        this.increaseNumDays = this.increaseNumDays.bind(this);
    }

    handleHalfLifeChange (event) {
        this.store.dispatch(getHalfLifeUpdate(parseFloat(event.target.value)));
    }

    handleDosageChange (event) {
        this.store.dispatch(getDosageUpdate(parseFloat(event.target.value)));
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
                    in references such as Wikipedia.  If they give a range instead 
                    of a specific number, just choose something in the middle.
                </p>
                <form>
                    <div className = {"form-group"}>
                        <label>Drug Half Life (in hours)</label>
                        <input 
                            className = {"form-control half-life-input " + (this.state.halfLifeDirty && !this.state.halfLifeValid ? 'has-error' : '')} 
                            data-testid="half-life-input"
                            type="number" 
                            onChange = {this.handleHalfLifeChange} 
                            required
                        />
                        <label>Dosage per day (in milligrams)</label>
                        <input 
                            className = {"form-control dosage-input " + (this.state.dosageDirty && !this.state.dosageValid ? 'has-error' : "")}
                            data-testid="dosage-input"
                            type="number" 
                            onChange = {this.handleDosageChange} 
                            required
                        />
                    </div>
                </form>

                { this.state.halfLifeValid && this.state.dosageValid &&
                    <div 
                        className = "drug-level-table-outer"
                        data-testid = "drug-level-table-outer"
                    >
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
                            after which you see only small daily changes.  For longer half-life 
                            it will take longer to reach a steady state.
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
                                    { BloodLevels.getDailyDrugBloodLevel(this.state).map(function(val, index){
                                        return (
                                            <tr key={ index }
                                                data-testid = "drug-level-on-day"
                                            >
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
                                className = "btn btn-secondary more-button"
                                data-testid = "more-days-button"
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
