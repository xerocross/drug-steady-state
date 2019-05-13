
export function getHalfLifeUpdate (newText) {
    return {
        type: "HALF_LIFE_UPDATE",
        value: newText
    }
}

export function getDosageUpdate (newText) {
    return {
        type: "DOSAGE_UPDATE",
        value: newText
    }
}