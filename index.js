const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type = checkbox]");
const symbols = '~`!@#$%^&*()_"-+=[{]}|;:,.<>?/'

// by default values
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set strength circle color to gray
setIndicator("#ccc")



// handle slider -- set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

// set indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0 0 8px 5px color";
}

// random integer
function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}
function generateSymbol(){
    let randomNumber = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomNumber);
}

// Strength indicator
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator('#ff0')
    }
    else{
        setIndicator('#f00');
    }
}

// to copy password on clipboard
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "failed"
    }

    // to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


// shuffle password by --- Fisher Yates Method
function shufflePassword(array){
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});


function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
        // special condition
        if(passwordLength < checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
    })
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})



// generate button to generate password
generateBtn.addEventListener('click', ()=>{
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";


    // array function
    let funcArray = [];
    if(uppercaseCheck.checked){
        funcArray.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArray.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArray.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArray.push(generateSymbol);
    }

    // compulsary condition
    for(let i = 0; i<funcArray.length; i++){
        password += funcArray[i]();
    }
    // remaining condition 
    for(let i = 0; i<passwordLength-funcArray.length; i++){
        let randomIndex = getRandomInteger(0, funcArray.length);
        password += funcArray[randomIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in ui
    passwordDisplay.value = password;
    calcStrength();
});