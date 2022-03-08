class BrowsingHistory {
    constructor(history = []) {
        this.history = history
    }

    addNewHistory(historyTitle) {
        let index = this.history.indexOf(historyTitle)
        if(index >= 0) this.history.splice(index,1)

        this.history = [historyTitle,...this.history].splice(0,6)
    }

    get getHistory() {
        return this.history
    }
}

module.exports = BrowsingHistory