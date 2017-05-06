'use strict';

var BaseConverter = {};

BaseConverter.convert = function(from, to, number) {
    var isComma = isComma || false;
    var results = [];

    to = Array.isArray(to) ? to : [to];
    if (BaseConverter.validateNumber(number, from)) {
        if (from == 10) {
            for (var i = 0; i < to.length; i++) {
                results[i] = fromBaseTen(number, to[i]);
            }
        } else {
            let baseTenNumber = toBaseTen(number, from);

            for (var i = 0; i < to.length; i++) {
                results[i] = fromBaseTen(baseTenNumber, to[i]);
            }
        }
    } else {
        return false;
    }
    return results;

    function toBaseTen(number, base) {
        var digits = [],
            sum = 0;
        var split = number.split(",");

        for (var i = 0; i < split[0].length; i++) {
            sum += BaseConverter.getDigitValue(split[0][i]) * Math.pow(base, split[0].length - 1 - i);
        }

        if (split[1]) {
            sum += ',';
            var temp = 0;
            for (var i = 0; i < split[1].length; i++) {
                temp += BaseConverter.getDigitValue(split[1][i]) * Math.pow(base, -(i + 1));
            }
            sum += temp.toString().substring(2);
        }

        return sum.toString();
    }

    function fromBaseTen(number, base) {
        var rest = '',
            result = '',
            split = number.toString().split(",");

        // Calculate the natural number part of received number.
        // e.g. 123 from 123,7482
        rest = split[0];
        rest = Number(rest);
        while (rest != 0) {
            result = BaseConverter.getDigitCharacter(rest%base) + result;
            rest = Math.floor(rest/base);
        }

        // calculates the comma of received number if any
        // e.g. 0,7482 from 123,7482
        if (split[1]) {
          var help = 0;
            ergebnis += ",";
            rest = Number('0.' + split[1]);
            for (var i = 1; i <= 8; i++) {
                if (rest == 0 || (rest - Math.pow(base, -i) < 0)) {
                    ergebnis += '0';
                } else {
                    help = Math.floor(rest / Math.pow(base, -i));
                    ergebnis += BaseConverter.getDigitCharacter(help).toString();
                    rest = rest % Math.pow(base, -i);
                }
            }
        }

        return result;
    }
};

/** This function gets a base 10 number and return the corresponding digit to that value.
 * E.g. 'E' for 14
 */
BaseConverter.getDigitCharacter = function(number) {
    return BaseConverter.digits[number];
};

BaseConverter.getDigitValue = function(digit) {
    return BaseConverter.digits.indexOf(digit.toUpperCase());
}

BaseConverter.validateNumber = function(number, base) {
    var isComma = isComma || false;
    var digits = number.split("");

    // When the backspace key is pressed...
    if (number == '-1') {
        // ...test if comma was deleted
        if (inputField.value.indexOf(",") == -1) {
            isComma = false;
        }
        return true;
    }

    // Loop throught the received number and check every digit for its validness
    for (var i = 0; i < digits.length; i++) {
        if (digits[i] == "," && isComma == false) {
            isComma = true;
            return true;
        } else if (digits[i] == "," && isComma == true) {
            return false;
        }

        // IDEA: Use foreach() and declare this variable outside of the for loop
        let digitValue = BaseConverter.getDigitValue(digits[i]);

        if (digitValue >= selectedBase || digitValue == -1) {
            return false;
        }
    }
    return true;
};

// Array that maps all the digits from bases 2-36
BaseConverter.digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
