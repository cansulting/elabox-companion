class Log {
    constructor(initialValue = {}) {
        this.log = initialValue
    }
    toObject() {
        return this.log
    }
    toString() {
        return JSON.stringify(this.log)
    }
    addProperty(key = "", value) {
        this.log[key] = value
        return this
    }
    addCategory(category = "") {
        return this.addProperty("category", category)
    }
    addPackage(pkg = "") {
        return this.addProperty("package", pkg)
    }
    addStack() {
        const err = this.log["error"] 
        if (err !== null && 
            typeof( err) === typeof(new Error())) {
            this.addProperty("stack", err.stack)
        }
        return this
    }
    // add caller and line number
    addCaller() {
        var e = new Error();
        if (!e.stack) {
            try {
                // IE requires the Error to actually be thrown or else the 
                // Error's 'stack' property is undefined.
                throw e;
            } catch (e) {
                if (!e.stack) {
                    //return 0; // IE < 10, likely
                }
            }
        }
        var stack = e.stack.toString().split(/\r\n|\n/);
        this.addProperty("caller", stack[2]);       
        return this
    }
    _addLevel(msg, level) {
        this.addProperty("level", level)
        const date = new Date( Date.now())
        const isoDate = date.toISOString()
        this.addProperty("time", isoDate)
        if (msg != "")
            this.addProperty("message", msg)
        return this
    }
    debug(msg = "") {
        return this._addLevel(msg, "debug")
    }
    error(msg = "", err = null) {
        this._addLevel(msg, "error")
        if (err != null)
            this.addProperty("error", err)
        return this
    }
    warn(msg = "") {
        return this._addLevel(msg, "warn")
    }
    info(msg = "") {
        return this._addLevel(msg, "info")
    }
}

module.exports = Log 