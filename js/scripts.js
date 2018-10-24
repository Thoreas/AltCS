// Discard any "Enter" or "Return" key pressed anywhere on the page/app
document.addEventListener("keypress", (function(e) {
	if ( e.which == 13 ) {
		e.preventDefault();
	}
	return true;
}));

// List of ID's relevant to calculating character skills
var idsRelevantForCalculatingCharacterSkills = [    "characterLevel",
                                                    "characterStr",
                                                    "characterInt",
                                                    "characterAgi",
                                                    "characterFoc",
                                                    "characterVit",
                                                    "characterPer",
                                                    "academicsLevel",
                                                    "acrobaticsLevel",
                                                    "armortrainingLevel",
                                                    "athleticsLevel",
                                                    "awarenessLevel",
                                                    "coercionLevel",
                                                    "computerLevel",
                                                    "cultureLevel",
                                                    "deceptionLevel",
                                                    "drivingLevel",
                                                    "dodgeLevel",
                                                    "empathyLevel",
                                                    "enduranceLevel",
                                                    "energyweaponLevel",
                                                    "engineeringLevel",
                                                    "extremesportsLevel",
                                                    "firearmLevel",
                                                    "handtohandLevel",
                                                    "heavyweaponLevel",
                                                    "influenceLevel",
                                                    "mechanicsLevel",
                                                    "medicineLevel",
                                                    "meleeLevel",
                                                    "misdirectionLevel",
                                                    "performanceLevel",
                                                    "pilotingLevel",
                                                    "primitivewpnLevel",
                                                    "professionLevel",
                                                    "resilienceLevel",
                                                    "scienceLevel",
                                                    "securityLevel",
                                                    "stealthLevel",
                                                    "survivalLevel",
                                                    "willpowerLevel"];
// Bind all relevant functions to every ID in previous list
for ( id in idsRelevantForCalculatingCharacterSkills ) {
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("keypress", discardInvalidKeysForSkills);
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("focusout", recalculateCharacterSkills);
}

// Bind function which adjust available wound points to character's VIT
document.getElementById("characterVit").addEventListener("focusout", adjustWounds);

// Adjust available wound points
function adjustWounds(e) {
	var characterVit = parseInt(document.getElementById('characterVit').innerHTML);
	for (var i = 1; i <= 10; i++) {
		if ( i <= characterVit || isNaN(characterVit) ) {
			document.getElementById("vit-" + i).style.display = "initial";
		} else {
			document.getElementById("vit-" + i).style.display = "none";
		}
	}
}

// Discard invalid keys for skills
function discardInvalidKeysForSkills(e) {
	// Allow only numbers, backspace, delete, tab, left arrow and right arrow keys; discard everything else
	if ( e.which != 0 && e.which != 8 && e.which != 9 && e.which != 37 && e.which != 39 && e.which != 46 && !(e.which >= 48 && e.which <= 57) ) {
		e.preventDefault();
		return;
	}
}

// Recalculate character skills
function recalculateCharacterSkills(e) {

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
