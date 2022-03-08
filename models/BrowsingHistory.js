class BrowsingHistory {
    constructor(history = []) {
        this.history = history
    }

    addNewHistory(historyTitle) {
        this.history = [{name:historyTitle},...this.history].splice(0,6)
    }

    get getHistory() {
        return this.history
    }
}

module.exports = BrowsingHistory