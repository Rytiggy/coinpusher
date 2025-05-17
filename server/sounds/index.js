// const { spawn } = require('child_process');


// module.exports = {
//     playSound: function (soundFile) {
//         // const play = spawn('aplay', ['-D', 'sysdefault:CARD=Headphones', soundFile]);
//         // To repeat this play cmd does the job
//         const play = spawn('bash', ['-c', `while true; do aplay -D sysdefault:CARD=Headphones ${soundFile}; done`]);
//         play.stdout.on('data', (data) => {
//             console.log(`stdout: ${data}`);
//         });

//         play.stderr.on('data', (data) => {
//             console.error(`stderr: ${data}`);
//         });

//         play.on('close', (code) => {
//             console.log(`aplay exited with code ${code}`);
//         });

//     }
// }




const { spawn } = require('child_process');


// module.exports = {
module.exports = function (soundFile) {
    let isPaused = false;
    let isStopped = false;
    let currentProcess = null;

    return {
        isStopped,
        playSound: function () {
            isPaused = false;
            isStopped = false;

            async function loopPlay() {
                while (!isStopped) {
                    if (isPaused) {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        continue;
                    }

                    await new Promise((resolve) => {
                        currentProcess = spawn('aplay', ['-D', 'sysdefault:CARD=Headphones', soundFile]);

                        currentProcess.stdout.on('data', (data) => {
                            console.log(`stdout: ${data}`);
                        });

                        currentProcess.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });

                        currentProcess.on('exit', (code) => {
                            console.log(`aplay exited with code ${code}`);
                            currentProcess = null;
                            resolve();
                        });
                    });
                }
            }

            loopPlay();
        },
        getStatus() {
            return { isStopped }
        },

        pause: function () {
            console.log('Paused');
            isPaused = true;
        },

        resume: function () {
            console.log('Resumed');
            isPaused = false;
        },

        stop: function () {
            console.log('Stopped');
            isStopped = true;
            if (currentProcess) {
                currentProcess.kill();
            }
        }
    }
}
