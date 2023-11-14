/* eslint-disable */
const exec = require('node:child_process').exec;
const exit = require('process').exit;

if(process.env.DASHBOARD_SKIP_POSTINSTALL) {
    console.log('Skipping post-install...');
    exit(0)
}

if(process.env.DASHBOARD_INSTALL_ICONS == '1' || process.env.DASHBOARD_INSTALL_ICONS == 'true'){
    console.log('Installing all icons in JSON format.')
    exec('npm install @iconify/json', (err, stdout) => {
        if (err) {
            console.error(`Error: ${err}`);
            return;
        }
        console.log(stdout);
    });
} else {
    console.log('Not installing local icons.')
}
