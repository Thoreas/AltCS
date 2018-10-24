/* TODO
 * prevent input of invalid characters
 * prevent recalculation of everything for non-alphanumeric keys (like TAB)
 *
 *
 *
 */


// Discard any "Enter" or "Return" key pressed anywhere on the page/app
document.addEventListener("keypress", (function(e) {
	if ( e.which == 13 ) {
		e.preventDefault();
	}
	return true;
}));

// Add listener event for changing character level
document.getElementById('characterLevel').addEventListener("focusout", recalculateCharacterSkills);

// Add listener event for changing character stats
document.getElementById('characterStr').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('characterInt').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('characterAgi').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('characterFoc').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('characterVit').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('characterPer').addEventListener("focusout", recalculateCharacterSkills);

// Add listener event for changing skill levels
document.getElementById('academicsLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('acrobaticsLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('armortrainingLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('athleticsLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('awarenessLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('coercionLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('computerLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('cultureLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('deceptionLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('drivingLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('dodgeLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('empathyLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('enduranceLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('energyweaponLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('engineeringLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('extremesportsLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('firearmLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('handtohandLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('heavyweaponLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('influenceLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('mechanicsLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('medicineLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('meleeLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('misdirectionLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('performanceLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('pilotingLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('primitivewpnLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('professionLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('resilienceLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('scienceLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('securityLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('stealthLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('survivalLevel').addEventListener("focusout", recalculateCharacterSkills);
document.getElementById('willpowerLevel').addEventListener("focusout", recalculateCharacterSkills);

function recalculateCharacterSkills(e) {
	console.log(e.cancelable);
	// Allow only numbers, backspace, delete, tab, left arrow and right arrow keys; discard everything else
	if ( e.which != 0 && e.which != 8 && e.which != 9 && e.which != 37 && e.which != 39 && e.which != 46 && !(e.which >= 48 && e.which <= 57) ) {
		e.preventDefault();
		return;
	}

	// Get value of stats input fields
	var characterStats = {
		characterStr: parseInt(document.getElementById('characterStr').innerHTML),
		characterInt: parseInt(document.getElementById('characterInt').innerHTML),
		characterAgi: parseInt(document.getElementById('characterAgi').innerHTML),
		characterFoc: parseInt(document.getElementById('characterFoc').innerHTML),
		characterVit: parseInt(document.getElementById('characterVit').innerHTML),
		characterPer: parseInt(document.getElementById('characterPer').innerHTML)
	};

	// Create skill-to-stat(s) dependency object
	var characterSkills = {
		academics: ["characterInt"],
		acrobatics: ["characterAgi"],
		armortraining: ["characterStr","characterInt"],
		athletics: ["characterStr"],
		awareness: ["characterFoc"],
		coercion: ["characterPer"],
		computer: ["characterInt"],
		culture: ["characterPer"],
		deception: ["characterPer"],
		driving: ["characterAgi"],
		dodge: ["characterAgi"],
		empathy: ["characterFoc","characterPer"],
		endurance: ["characterVit"],
		energyweapon: ["characterAgi","characterFoc"],
		engineering: ["characterInt"],
		extremesports: ["characterAgi","characterVit"],
		firearm: ["characterAgi","characterFoc"],
		handtohand: ["characterStr","characterAgi"],
		heavyweapon: ["characterStr","characterInt"],
		influence: ["characterPer"],
		mechanics: ["characterInt"],
		medicine: ["characterInt"],
		melee: ["characterStr","characterAgi"],
		misdirection: ["characterPer"],
		performance: ["characterPer"],
		piloting: ["characterAgi","characterInt"],
		primitivewpn: ["characterAgi","characterFoc"],
		profession: ["characterStr","characterInt","characterAgi","characterFoc","characterVit","characterPer"],
		resilience: ["characterVit"],
		science: ["characterInt"],
		security: ["characterAgi","characterInt"],
		stealth: ["characterAgi", "characterFoc"],
		survival: ["characterVit","characterFoc"],
		willpower: ["characterFoc"]
	};

	// Declare helper functions
	var maxOfTwo = function(p1, p2) {
		return p1 > p2 ? p1 : p2;
	}

	// Check and correct the range of input values; if any correcting was done then restart
	var cleanPass = true;
	for (var characterStat in characterStats) {
		if ( characterStats[characterStat] < 1 ) {
			document.getElementById(characterStat).innerHTML = "1";
			characterStats[characterStat] = 1;
			cleanPass = false;
		} else if ( characterStats[characterStat] > 10 ) {
			document.getElementById(characterStat).innerHTML = "10";
			characterStats[characterStat] = 10;
			cleanPass = false;
		}
	}
	if ( !cleanPass ) {
		recalculateCharacterSkills(e);
		return;
	}

	// Update related skills
	// For one-stat skills: skillLow = 20 - (relevantStat + skillLevel)
	// For two-stat skills: skillLow = 20 - ( max(relevantStat1,relevantStat2,...) + skillLevel)
	for (var characterSkill in characterSkills) {
		// Enforce minimum and maximum values for skill rank
		var skillLevel = parseInt(document.getElementById(characterSkill + "Level").innerHTML);
		skillLevel = ( skillLevel > 0 ? skillLevel : 0 );
		if ( skillLevel < 1 ) {
			skillLevel = 0;
			document.getElementById(characterSkill + "Level").innerHTML = "";
		} else if ( skillLevel > 5 ) {
			if ( parseInt(document.getElementById("characterLevel").innerHTML) == 1 ) {
				skillLevel = 5;
				document.getElementById(characterSkill + "Level").innerHTML = "5";
			} else if ( skillLevel > 10 ) {
				skillLevel = 10;
				document.getElementById(characterSkill + "Level").innerHTML = "10";
			}
		}
		// Select the greatest stat value out of all relevant stats for a given skill
		var relevantStatValue = 0;
		for (var characterStat in characterSkills[characterSkill]) {
			if ( characterStats[characterSkills[characterSkill][characterStat]] > relevantStatValue ) {
				relevantStatValue = characterStats[characterSkills[characterSkill][characterStat]];
			}
		}
		// If relevant stat(s) or skill level is not input, cleanup the output
		if ( relevantStatValue == 0 || skillLevel == 0 ) {
			document.getElementById(characterSkill + "Low").innerHTML = "";
			document.getElementById(characterSkill + "Mid").innerHTML = "";
			document.getElementById(characterSkill + "High").innerHTML = "";
		} else {
			var baseSkill = 20 - (relevantStatValue + skillLevel);
			document.getElementById(characterSkill + "Low").innerHTML = baseSkill;
			document.getElementById(characterSkill + "Mid").innerHTML = baseSkill + 5;
			document.getElementById(characterSkill + "High").innerHTML = baseSkill + 10;
		}

	}
};
