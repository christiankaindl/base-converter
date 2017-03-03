var ergebnis = '';
var addedCharacter = "";

var totallyLegitGlobalBaseVariable = 10;
var elem = document.getElementById('number');
var base = document.getElementById('base');

base.addEventListener("change", function updateBase(e) {
    totallyLegitGlobalBaseVariable = this.value;
    elem.value = "";
});
elem.addEventListener("paste", function paste(e) {
    e.preventDefault();
    var pastedData = e.clipboardData.getData('text');

    if (validateNumber(pastedData, totallyLegitGlobalBaseVariable) != -1) {
        this.value = this.value + pastedData;
    } else {
        console.error("The pasted data does not match with the selected base!");
    }

});

elem.addEventListener("keypress", function char(e) {
    if (e.charCode == 0) {
        addedCharacter = -1;
    } else {
        addedCharacter = String.fromCharCode(e.charCode);
    }
});
elem.addEventListener("input", function calculate(e) {
    e.preventDefault(); // Does not work :()
    e.stopPropagation();
    // NOTE: In future it is possible to use InputEvent.data to get the added character
    let digit = addedCharacter;

    if (validateNumber(digit, totallyLegitGlobalBaseVariable) != -1) {
        /* Convert and insert the values*/
        for (var i = 2; i <= 16; i++) {
            let sum = 0;

            if (totallyLegitGlobalBaseVariable == 10) {
                sum = fromBaseTen(this.value, i);
            } else {
                sum = toBaseTen(this.value, totallyLegitGlobalBaseVariable);
                sum = fromBaseTen(sum, i);
            }

            document.getElementsByClassName('result')[i - 2].innerHTML = sum;
        }
    } else {
        var v = this.value.split("");
        v.splice(this.selectionEnd - 1, 1);
        this.value = v.join("");
    }
});


/**
This function receives a number and the base from which the number comes from.
It then chops the received number apart and multiplies the value of the digit with the place value to produce the base ten result.
*/
function toBaseTen(number, base) {
    var digits = [],
        sum = 0;

    digits = number.toString().split('');

    for (var i = 0; i < digits.length; i++) {
        sum += getDigitValue(digits[digits.length - i-1]) * Math.pow(base, i);
    }

    return sum;
}

function fromBaseTen(number, base) {
    var potenzen = [],
        rest = number,
        ergebnis = '';

    potenzen = _makePowers(number, base);

    for (var i = potenzen.length - 1; i >= 0; i--) {
        if (rest == 0 || (rest - potenzen[i] < 0)) {
            ergebnis += '0';
        } else {
            help = Math.floor(rest / potenzen[i]);
            ergebnis += getDigitCharacter(help).toString();
            rest = rest % potenzen[i];
        }
    }

    // Rechnet die nötigen Potenzen der Basis, welche für die Umrechnung von nöten sind aus.
    function _makePowers(number, base) {
        var i = 0,
            powerArr = [];

        do {
            powerArr.push(Math.pow(base, i));
            i++;
        } while (Math.pow(base, i) <= number);

        return powerArr;
    }

    return ergebnis;
}

/** This function gets a base 10 number and return the corresponding digit to that value.
 * E.g. 'E' for 14
 */
function getDigitCharacter(number) {
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    return digits[number];
}

function getDigitValue(digit) {
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    return digits.indexOf(digit.toUpperCase());
}

function validateNumber(number, base) {
    if (number == -1) {
        return 0;
    }
    var digits = number.split("");

    for (var i = 0; i < digits.length; i++) {
      console.log(digits);
        let digitValue = getDigitValue(digits[i]);
        if (digitValue >= totallyLegitGlobalBaseVariable || digitValue == -1) {
            return -1;
        } else {
            return number;
        }
    }
}
