


function clone (stateObject) {
    let newObj = Object.assign({}, stateObject);
    return newObj;
    // this doesn't do a deep clone
    // and that is exactly what we want
}

const initState = {
    dosage : 0,
    halfLife : 0
}

export function drugSteadyStateReducer (state, action) {
    let newState;
    if (typeof state === "undefined") {
        return Object.freeze(clone(initState));
    }
    newState = clone(state);
    switch(action.type) {
        case "HALF_LIFE_UPDATE":
            newState.halfLife = action.value;
            break;
        case "DOSAGE_UPDATE":
            newState.dosage = action.value;
            break;
        default:
            break;
    }
    return Object.freeze(newState);
}