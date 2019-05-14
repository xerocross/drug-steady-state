


function clone (stateObject) {
    let newObj = Object.assign({}, stateObject);
    return newObj;
    // this doesn't do a deep clone
    // and that is exactly what we want
}

// const initState = {
//     dosage : 0,
//     dosageValid : false,
//     halfLife : 0,
//     halfLifeValid : false,
//     numDays: 20
// }

export const initState = {
    dosage: 0,
    halfLife : 0,
    halfLifeValid : false,
    halfLifeDirty : false,
    numDays : 20,
    threshhold : 0.05,
    dosageValid : false,
    dosageDirty : false
};

export function drugSteadyStateReducer (state, action) {
    let newState;
    if (typeof state === "undefined") {
        return Object.freeze(clone(initState));
    }
    newState = clone(state);
    switch(action.type) {
        case "HALF_LIFE_UPDATE":
            newState.halfLifeDirty = true;
            if (isNaN(action.value) || action.value < 0) {
                newState.halfLifeValid = false;
                
            } else {
                newState.halfLifeValid = true;
                newState.halfLife = action.value;
                
            }
            break;
        case "DOSAGE_UPDATE":
            newState.dosageDirty = true;
            if (isNaN(action.value) || action.value < 0) {
                newState.dosageValid = false;
                
            } else {
                newState.dosageValid = true;
                newState.dosage = action.value;
            }
            break;
        case "NUMDAYS_UPDATE":
            newState.numDays = action.value;
            break;
        default:
            break;
    }
    return Object.freeze(newState);
}