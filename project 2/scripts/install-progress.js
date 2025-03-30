const readline = require('node:readline');
const { spawn } = require('node:child_process');

class ProgressBar {
  constructor() {
    this.total = 100;
    this.current = 0;
    this.barLength = 30;
  }

  draw(message = '') {
    const percentage = ((this.current / this.total) * 100).toFixed(0);
    const filledLength = Math.floor((this.barLength * this.current) / this.total);
    const filled = '='.repeat(filledLength);
    const empty = ' '.repeat(this.barLength - filledLength);
    const bar = `[${filled}>${empty}] ${percentage}%`;
    
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${bar} ${message}`);
  }

  update(current, message) {
    this.current = Math.min(current, this.total);
    this.draw(message);
  }
}

function runInstall() {
  const progress = new ProgressBar();
  const npmInstall = spawn('npm', ['install'], { 
    stdio: ['inherit', 'pipe', 'pipe']
  });

  let packageCount = 0;
  let currentPackage = '';

  npmInstall.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('idealTree')) {
      packageCount++;
      progress.update(
        Math.min((packageCount / 100) * 100, 100),
        `Instalando dependencias... ${currentPackage}`
      );
    }
    
    const packageMatch = output.match(/(?:added|removed|changed)\s+(\d+)\s+package/);
    if (packageMatch) {
      currentPackage = output.trim();
    }
  });

  npmInstall.stderr.on('data', (data) => {
    const error = data.toString();
    if (error.includes('npm ERR!')) {
      console.error('\nError durante la instalación:', error);
    }
  });

  npmInstall.on('close', (code) => {
    progress.update(100, 'Instalación completada!');
    console.log('\n');
    process.exit(code);
  });
}

runInstall();