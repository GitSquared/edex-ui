const sqlite = require("sqlite3").verbose();

class SqliteInterface{
    constructor(path) {
        this.history = [];
        this.db = new sqlite.Database(path);
        const results = document.getElementById("results");
        const tableList = document.getElementById("tables");
        const runButton = document.getElementById("run");
        const query = document.getElementById("query");

        run.addEventListener("click", () => {
            const sql = query.value;
            this.clearResults();

            this.execute(sql);
            query.value = "";
        });

        document.addEventListener("keypress", (e) => {
            // only detect the enter key.
            if (e.keyCode === 13) {
                run.click();
            }
        });

        this.db.each("SELECT name FROM sqlite_master WHERE type = \"table\"", (err, row) => {
            if (err) {
                console.log(err);
            } else {
                const el = document.createElement("li");
                el.textContent = row.name;
                el.classList.add("clickable");
                tableList.appendChild(el);
                el.addEventListener("click", () => {
                    const sql = `SELECT * FROM ${row.name};`;

                    this.execute(sql);
                    // this.clearResults();

                    // this.db.each(sql, this.showResults);
                });
            }
        });
        query.focus();
    }

    execute(sql) {
        this.clearResults();
        this.db.each(sql, this.showResults);
        this.addToHistory(sql);
    }

    refreshHistory() {
        const historyList = document.getElementById("history");
        while (historyList.firstChild) {
            historyList.removeChild(historyList.lastChild);
        }

        for (let i = this.history.length - 1; i >= 0; i--) {
            let el = document.createElement("li");
            const sql = this.history[i];
            el.textContent = sql.length > 20 ? `${sql.slice(0, 20)}\u2026` : sql;
            el.classList.add("clickable");
            el.title = sql;
            el.addEventListener("click", () => {
                this.execute(sql);
            });

            historyList.appendChild(el);
        }
    }

    addToHistory(sql) {
        // avoid duplicate items in history.
        if (this.history[this.history.length - 1] !== sql) {
            this.history.push(sql);
            this.refreshHistory();
        }
    }

    clearResults() {
        while (results.firstChild){
            results.removeChild(results.lastChild);
        }
    }

    showResults(err, row) {
        if (err) {
            console.log(err);
        } else {
            let header = document.getElementById("resultHeader");
            if (!header) {
                header = document.createElement("thead");
                header.id = "resultHeader";
                let rowEl = document.createElement("tr");
                for (let header in row) {
                    let el = document.createElement("th");
                    el.textContent = header;
                    rowEl.appendChild(el);
                }
                header.appendChild(rowEl);
                results.appendChild(header);
            }

            let rowEl = document.createElement("tr");
            for (let item in row) {
                let el = document.createElement("td");
                el.textContent = row[item];
                rowEl.appendChild(el);
            }
            results.appendChild(rowEl);
        }
    }
}

module.exports = {
    SqliteInterface
};
