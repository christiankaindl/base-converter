var ergebnis = '';
var addedCharacter = "";

var isComma = false;
var selectedBase = 10;
var elem = document.getElementById('number');
var base = document.getElementById('base');
document.onload = base.value = 10;
base.addEventListener("change", function updateBase(e) {
    selectedBase = this.value;
    elem.value = "";
    elem.placeholder = "Use digits 0-" + getDigitCharacter(selectedBase - 1);
});
elem.addEventListener("paste", function paste(e) {
    e.preventDefault();
    var pastedData = e.clipboardData.getData('text');

    if (validateNumber(pastedData, selectedBase) != -1) {
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
    e.preventDefault(); // Does not work :(
    e.stopPropagation();
    // NOTE: In future it is possible to use InputEvent.data to get the added character, so it would not be necessary to use an keypress eventlistener
    let digit = addedCharacter;
    console.log("addedCharacter: " + addedCharacter);

    if (validateNumber(digit, selectedBase) != -1) {
        /* Convert and insert the values*/
        var baseTen = toBaseTen(this.value, selectedBase);
        for (var i = 2; i <= 16; i++) {
            let sum = 0;

            if (selectedBase == 10) {
                sum = fromBaseTen(this.value, i);
            } else {
                sum = fromBaseTen(baseTen, i);
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
    var split = number.split(",");

    for (var i = 0; i < split[0].length; i++) {
        sum += getDigitValue(split[0][i]) * Math.pow(base, split[0].length - 1 - i);
    }

    if (split[1]) {
        sum += ',';
        var temp = 0;
        for (var i = 0; i < split[1].length; i++) {
            temp += getDigitValue(split[1][i]) * Math.pow(base, -(i + 1));
        }
        sum += temp.toString().substring(2);
    }

    return sum.toString();
}

function fromBaseTen(number, base) {
    var potenzen = [],
        rest = '',
        ergebnis = '';

    console.log("number: " + number);
    var split = number.toString().split(","),
        digits = number.toString().split('');

    potenzen = _makePowers(split[0], base);

    // If given number is a number with a comma then loop loop twice. One time for 'body' and one time for the 'comma'
    rest = split[0];
    for (var i = potenzen.length - 1; i >= 0; i--) {
        if (rest == 0 || (rest - potenzen[i] < 0)) {
            ergebnis += '0';
        } else {
            help = Math.floor(rest / potenzen[i]);
            ergebnis += getDigitCharacter(help).toString();
            rest = rest % potenzen[i];
        }
    }

    // calculates the comma
    if (split[1]) {
        ergebnis += ","
        rest = Number('0.' + split[1]);
        for (var i = 1; i <= 8; i++) {
            if (rest == 0 || (rest - Math.pow(base, -i) < 0)) {
                ergebnis += '0';
            } else {
                help = Math.floor(rest / Math.pow(base, -i));
                ergebnis += getDigitCharacter(help).toString();
                rest = rest % Math.pow(base, -i);
            }
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
        if (elem.value.indexOf(",") == -1) {
            isComma = false;
        }
        return false;
    }

    var digits = number.split("");
    for (var i = 0; i < digits.length; i++) {
        if (digits[i] == "," && isComma == false) {
            isComma = true;
            return true;
        } else if (digits[i] == "," && isComma == true) {
            return -1;
        }

        let digitValue = getDigitValue(digits[i]);

        if (digitValue >= selectedBase || digitValue == -1) {
            return -1;
        }
    }
    return number;
}
