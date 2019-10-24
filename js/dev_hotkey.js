/* eslint-disable strict */
let KonamiSolved = false;
let Konamistate = 0;

const KeyCodes = {
  enter: 13,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  a: 65,
  b: 66,
  13: 'enter',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  65: 'a',
  66: 'b',
};

const KonamiCode = [
  KeyCodes.up,
  KeyCodes.up,
  KeyCodes.down,
  KeyCodes.down,
  KeyCodes.left,
  KeyCodes.right,
  KeyCodes.left,
  KeyCodes.right,
  KeyCodes.b,
  KeyCodes.a,
  KeyCodes.enter,
];

function storeKonami(newVal) {
  try {
    KonamiSolved = newVal;
    localStorage.setItem('PowerOfGlasses', JSON.stringify(newVal));
    document.dispatchEvent(
      new CustomEvent('nerdModeToggle', { detail: newVal })
    );
  } catch (err) {
    //
  }
}

function toggleKonami() {
  storeKonami(!KonamiSolved);
  konamiEffect(KonamiSolved);
}

function successfullKonami() {
  toggleKonami();
  console.log('successfullKonami - NewState:', KonamiSolved);
}

function getKonamiStored() {
  try {
    return JSON.parse(localStorage.getItem('PowerOfGlasses'));
  } catch (err) {
    return false;
  }
}

// Event Feeding
function onKeyUp(event) {
  if (event.type === 'keyup' && event.keyCode in KeyCodes) {
    KonamiStateMachine(event.keyCode);
  }
}

// Up Up Down Down Left Right Left Right B A Enter
function KonamiStateMachine(key) {
  if (KonamiCode[Konamistate] === key) {
    // console.log('KonamiStateMachine STEP - Got:', KeyCodes[key], 'Step:', Konamistate);
    Konamistate++;
    if (Konamistate >= KonamiCode.length) {
      Konamistate = 0;
      successfullKonami();
    }
  } else if (Konamistate !== 0) {
    // console.log('KonamiStateMachine RESET - Got:', KeyCodes[key], 'Expected:', KeyCodes[KonamiCode[Konamistate]], 'Step:', Konamistate);
    Konamistate = 0;
  }
}

let devInterfaceInterval;
function konamiEffect(solved) {
  if (solved) {
    devInterfaceInterval = setInterval(() => {
      createDeveloperInterface();
    }, 1000);
    createDeveloperInterface();
  } else {
    clearInterval(devInterfaceInterval);
    removeDeveloperInterface();
  }
}

try {
  document.addEventListener('keyup', onKeyUp, {
    capture: false,
    passive: true,
  });
  KonamiSolved = getKonamiStored();
  konamiEffect(KonamiSolved);
} catch (err) {
  // console.warn('Error:', err);
}
