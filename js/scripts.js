// Discard any "Enter" or "Return" key pressed anywhere on the page/app
document.addEventListener("keypress", (function(e) {
	if ( e.which == 13 ) {
		e.preventDefault();
	}
	return true;
}));

// Set minimal and maximal values for character's stats
var minStatValue = {
	characterStr: 1,
	characterInt: 1,
	characterAgi: 1,
	characterFoc: 1,
	characterVit: 1,
	characterPer: 1
};
var maxStatValue = {
	characterStr: 10,
	characterInt: 10,
	characterAgi: 10,
	characterFoc: 10,
	characterVit: 10,
	characterPer: 10
};

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
// Bind all relevant functions for calculating character skills
for ( id in idsRelevantForCalculatingCharacterSkills ) {
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("keypress", discardInvalidKeysForSkills);
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("focusout", recalculateCharacterSkills);
}

// Bind function which adjusts available wound points to character's VIT
document.getElementById("characterVit").addEventListener("focusout", adjustWounds);

// Bind function which adjusts required minimum and maximum values for stats depending on species selected
document.getElementById("selectedSpecies").addEventListener("focusout", adjustMinMaxForSpecies);

// Bind function which calculates character's encumbrance
document.getElementById("characterStr").addEventListener("focusout", calculateEncumbrance);
document.getElementById("characterVit").addEventListener("focusout", calculateEncumbrance);

// Bind function which calculates character's initiative
document.getElementById("characterAgi").addEventListener("focusout", calculateInitiative);
document.getElementById("characterFoc").addEventListener("focusout", calculateInitiative);

// Adjust required minimum and maximum values for stats depending on species selected
function adjustMinMaxForSpecies(e) {
	console.log("Ello...?");
	var selectedSpecies = document.getElementById("selectedSpecies").value.toLowerCase();
	switch(selectedSpecies) {
		case 'human (elaphromorph)':
			minStatValue["characterAgi"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = 3;
			maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
		case 'human (baromorph)':
			minStatValue["characterStr"] = 4;
			minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterAgi"] = 3;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
		case 'android':
			minStatValue["characterVit"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterPer"] = 4;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = 10;
			break;
		case 'briith':
			minStatValue["characterStr"] = 4;
			minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterAgi"] = 4;
			maxStatValue["characterInt"] = 5;
			maxStatValue["characterStr"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
		case 'nesh':
			minStatValue["characterFoc"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = 4;
			maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
		case 'xayon':
			minStatValue["characterAgi"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterFoc"] = 4;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
		default:
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			break;
	}
	recalculateCharacterSkills(e);
}

// Adjust available wound points
function adjustWounds(e) {
	var characterVit = parseInt(document.getElementById("characterVit").value);
	for (var i = 1; i <= 10; i++) {
		if ( i <= characterVit || isNaN(characterVit) ) {
			document.getElementById("vit-" + i).style.display = "initial";
		} else {
			document.getElementById("vit-" + i).style.display = "none";
		}
	}
}

// Calculate character's encumbrance value
function calculateEncumbrance(e) {
	var characterStr = parseInt(document.getElementById("characterStr").value);
	var characterVit = parseInt(document.getElementById("characterVit").value);
	if ( isNaN(characterStr) || isNaN(characterVit) ) {
		document.getElementById("characterEncumbrance").value = "";
	} else {
		document.getElementById("characterEncumbrance").value = 10 + 2 * ( characterStr - 3 > 0 ? characterStr - 3 : 0 ) + 2 * ( characterVit - 3 > 0 ? characterVit - 3 : 0 );
	}
}

// Calculate character's initiative
function calculateInitiative(e) {
	var characterAgi = parseInt(document.getElementById("characterAgi").value);
	var characterFoc = parseInt(document.getElementById("characterFoc").value);
	if ( isNaN(characterAgi) || isNaN(characterFoc) ) {
		document.getElementById("characterInitiative").value = "";
	} else {
		document.getElementById("characterInitiative").value = 20 - (characterAgi + characterFoc);
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
		characterStr: parseInt(document.getElementById("characterStr").value),
		characterInt: parseInt(document.getElementById("characterInt").value),
		characterAgi: parseInt(document.getElementById("characterAgi").value),
		characterFoc: parseInt(document.getElementById("characterFoc").value),
		characterVit: parseInt(document.getElementById("characterVit").value),
		characterPer: parseInt(document.getElementById("characterPer").value)
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
		if ( characterStats[characterStat] < minStatValue[characterStat] ) {
			document.getElementById(characterStat).value = minStatValue[characterStat];
			characterStats[characterStat] = minStatValue[characterStat];
			cleanPass = false;
		} else if ( characterStats[characterStat] > maxStatValue[characterStat] ) {
			document.getElementById(characterStat).value = maxStatValue[characterStat];
			characterStats[characterStat] = maxStatValue[characterStat];
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
		var skillLevel = parseInt(document.getElementById(characterSkill + "Level").value);
		skillLevel = ( skillLevel > 0 ? skillLevel : 0 );
		if ( skillLevel < 1 ) {
			skillLevel = 0;
			document.getElementById(characterSkill + "Level").value = "";
		} else if ( skillLevel > 5 ) {
			if ( parseInt(document.getElementById("characterLevel").value) == 1 ) {
				skillLevel = 5;
				document.getElementById(characterSkill + "Level").value = "5";
			} else if ( skillLevel > 10 ) {
				skillLevel = 10;
				document.getElementById(characterSkill + "Level").value = "10";
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
			document.getElementById(characterSkill + "Low").value = "";
			document.getElementById(characterSkill + "Mid").value = "";
			document.getElementById(characterSkill + "High").value = "";
		} else {
			var baseSkill = 20 - (relevantStatValue + skillLevel);
			document.getElementById(characterSkill + "Low").value = baseSkill;
			document.getElementById(characterSkill + "Mid").value = baseSkill + 5;
			document.getElementById(characterSkill + "High").value = baseSkill + 10;
		}

	}
};
