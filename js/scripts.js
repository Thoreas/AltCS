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
document.getElementById('characterLevel').addEventListener("keyup", refreshCharacterSheet);

// Add listener event for changing character stats
document.getElementById('characterStr').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('characterInt').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('characterAgi').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('characterFoc').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('characterVit').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('characterPer').addEventListener("keyup", refreshCharacterSheet);

// Add listener event for changing skill levels
document.getElementById('academicsLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('acrobaticsLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('armortrainingLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('athleticsLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('awarenessLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('coercionLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('computerLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('cultureLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('deceptionLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('drivingLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('dodgeLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('empathyLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('enduranceLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('energyweaponLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('engineeringLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('extremesportsLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('firearmLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('handtohandLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('heavyweaponLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('influenceLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('mechanicsLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('medicineLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('meleeLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('misdirectionLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('performanceLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('pilotingLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('primitivewpnLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('professionLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('resilienceLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('scienceLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('securityLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('stealthLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('survivalLevel').addEventListener("keyup", refreshCharacterSheet);
document.getElementById('willpowerLevel').addEventListener("keyup", refreshCharacterSheet);

// Refresh all calculated values
function refreshCharacterSheet(e) {
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
		refreshCharacterSheet();
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
