module.exports = function (start = () => { }, reverse = () => { }, stop = () => { }, addMessage = () => { }, callerName) {
    let timeout
    let timeoutStop
    let attempts = 0;
    const maxAttempts = 3
    // start motor 
    function startMotor() {
        clearJamTimeout()
        console.log("starMotors called")
        if (attempts >= maxAttempts) {
            console.log(`Max attempts, ${callerName} Out of coins or jammed`, 'error')
            addMessage(`Max attempts, ${callerName} Out of coins or jammed`, 'error')
            stop()
            return
        }
        start()
        // stop motor after some time if no event has happened 
        timeout = setTimeout(() => {
            addMessage(`Jam / no coins in ${callerName}`, 'error')
            reverse()
            attempts = attempts + 1
            timeoutStop = setTimeout(() => {
                addMessage("press play again, If problem continues call for help.")
                stop()
            }, 1700)
        }, 2000);
    }

    function clearJamTimeout(shouldClearAttemps = false) {
        clearTimeout(timeout)
        timeout = null
        clearTimeout(timeoutStop)
        timeoutStop = null
        if (shouldClearAttemps) {
            attempts = 0
        }
    }
    return {
        startMotor,
        clearJamTimeout
    }
}