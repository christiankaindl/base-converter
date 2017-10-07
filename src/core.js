'use strict';

var Base = {
	convert (from, targetBase, number) {
		var isComma = isComma || false;
		var results = [];
		// Convert targetBase to array if it is not yet
		targetBase = Array.isArray(targetBase) ? targetBase : [targetBase];

		if (number === "" || number === "0") {
			for (let i in targetBase) {
				results[i] = "0";
			}
			return results;
		}

		if (!Base.validateNumber(number, from))
      return false;

	  if (from !== 10)
	    number = toBaseTen(number, from);

	  for (let i in targetBase)
	    results[i] = fromBaseTen(number, targetBase[i]);

		return results;

		function toBaseTen(number, base) {
	    var digits = [],
	        sum = 0;

      calcIntegerPart();

      if (number.toString().split(",")[1])
        calcFractionPart();

      return sum.toString();

      function calcIntegerPart() {
      	var numberIntDigits = number.toString().split(",")[0].split("");

        for (let i in numberIntDigits)
	        sum += Base.getDigitValue(numberIntDigits[i]) * Math.pow(base, numberIntDigits.length - 1 - i);
      }

      function calcFractionPart() {
        var numberFractionDigits = number.split(",")[1].split(""),
            temp = 0;

        for (let i in numberFractionDigits)
          temp += Base.getDigitValue(numberFractionDigits[i]) * Math.pow(base, -(i + 1));

        sum += `,${temp.toString()}`;
      }
		}

		function fromBaseTen(number, base) {
      var rest = '',
          result = '',
          numberSplit = number.toString().split(",");

      calcIntegerPart();

      // calculates the comma of received number if any
      // e.g. 0,7482 from 123,7482
      if (numberSplit[1]) {
        calcFractionPart();
		  }

		  return result;

		  function calcIntegerPart() {
      	// Calculate the natural number part of received number.
        // e.g. 123 from 123,7482
        rest = numberSplit[0];
        rest = Number(rest);
        while (rest != 0) {
          result = Base.getNumberCharacter(rest%base) + result;
          rest = Math.floor(rest/base);
        }
      }

      function calcFractionPart() {
        var help = 0;
        ergebnis += ",";
        rest = Number('0.' + numberSplit[1]);
        for (var i = 1; i <= 8; i++) {
          if (rest == 0 || (rest - Math.pow(base, -i) < 0)) {
            ergebnis += '0';
          } else {
            help = Math.floor(rest / Math.pow(base, -i));
            ergebnis += Base.getNumberCharacter(help).toString();
            rest = rest % Math.pow(base, -i);
          }
		    }
      }
    }
  },

	/** This function gets a base 10 number and returns the character that corresponds to that value
	 * E.g. 14 returns 'E'; 8 returns '8'
	 */
	getNumberCharacter (number) {
    return Base.digits[number];
	},

  /** This function gets a digit (from whatever base) and returns the corresponding value as base 10
	 * E.g. 'E' returns 14; '8' returns 8
	 */
	getDigitValue (digit) {
	  var digitValue = Base.digits.indexOf(digit.toUpperCase());

	  if (digitValue === -1)
	    return false;

    // Return true if number is 0 so the call-site can make safe boolean checks
    return digitValue;
	},

  /** Takes a number and validates it
	 * Returns true if argument is a number in the corresponding base, false if not
	 */
	validateNumber (number, base = 10) {
		var isComma = false;
		var digits = number.toString().split("");

		// Loop throught the received number and check every digit for its validness
		for (let i in digits) {
		  let digitValue = Base.getDigitValue(digits[i]);

	    if (digits[i] === "," && isComma === false)
        isComma = true;

	    if (digits[i] === "," && isComma === true)
	      return false;

      if (digitValue === -1 || digitValue >= base)
	      return false;
		}

    // Return true if number is 0 so the call-site can make safe boolean checks
		return (number ? number : true);
	},

	// Array that maps all the digits from base 2 to 36
	digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
};
