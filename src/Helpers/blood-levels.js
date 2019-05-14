export default {
    getStartDrugBloodLevel (state, day) {
        let rate = this.getRate(state);
        const dayMultiplier = Math.exp(24*rate);
        let sum = 0;
        for (let i = 0; i <= day; i++) {
            sum += state.dosage*((dayMultiplier)**i);
        }
        return sum;
    },
    getDailyDrugBloodLevel (state) {
        let arr = [];
        for (let i = 0; i < state.numDays; i++) {
            arr.push(this.getStartDrugBloodLevel(state, i));
        }
        return arr;
    },
    getRate (state) {
        return -Math.log(2)/state.halfLife;
    }
}