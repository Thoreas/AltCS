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

// List of IDs relevant to calculating character skills
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
for ( var id in idsRelevantForCalculatingCharacterSkills ) {
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("keypress", discardInvalidKeysForSkills);
	document.getElementById(idsRelevantForCalculatingCharacterSkills[id]).addEventListener("focusout", recalculateCharacterSkills);
}

// Bind function which adjusts available wound points to character's VIT
document.getElementById("characterVit").addEventListener("focusout", adjustWounds);

// Bind function which adjusts required minimum and maximum values for stats depending on species selected
document.getElementById("selectedSpecies").addEventListener("focusout", adjustMinMaxForSpecies);

// Bind function which calculates character's armor
document.getElementById("selectedSpecies").addEventListener("focusout", calculateArmor);
document.getElementById("primaryArmor").addEventListener("focusout", calculateArmor);
document.getElementById("additionalArmor").addEventListener("focusout", calculateArmor);
var idsRelevantToArmorPenalties = ['acrobaticsLevel','armortrainingLevel','athleticsLevel','dodgeLevel','enduranceLevel','extremesportsLevel','stealthLevel'];
for ( var id in idsRelevantToArmorPenalties ) {
	document.getElementById(idsRelevantToArmorPenalties[id]).addEventListener("focusout", calculateArmor);
}

// Bind function which calculates character's encumbrance
document.getElementById("characterStr").addEventListener("focusout", calculateEncumbrance);
document.getElementById("characterVit").addEventListener("focusout", calculateEncumbrance);

// Bind function which calculates character's initiative
document.getElementById("characterAgi").addEventListener("focusout", calculateInitiative);
document.getElementById("characterFoc").addEventListener("focusout", calculateInitiative);

// Bind function which populates character's weapons
for ( var i = 0; i < 6; i++ ) {
	document.getElementById("weaponName" + i).addEventListener("focusout", populateWeapons);
}

// Bind function which makes talent related changes to the character sheet
for ( var i = 0; i < 12; i++ ) {
	document.getElementById("talent" + i).addEventListener("focusout", talents);
}
document.getElementById("clearTalentsButton").addEventListener("click", clearTalents);
talents(null, rebuildMenu = true);

// Bind function which makes changes based on character's level
document.getElementById("characterLevel").addEventListener("focusout", characterLevel);

// Bind functions for saving/loading a character
document.getElementById("saveButton").addEventListener("click", exportCharacter);
document.getElementById("loadButton").addEventListener("click", importCharacter);

// Transfor an integer value for bonus/penalty steps into string equivalent
function stepValueToDie(stepValue) {
	switch(stepValue) {
		case 6:
			return "+2d20";
		case 5:
			return "+d20";
		case 4:
			return "+d12";
		case 3:
			return "+d8";
		case 2:
			return "+d6";
		case 1:
			return "+d4";
		case 0:
			return "";
		case -1:
			return "-d4";
		case -2:
			return "-d6";
		case -3:
			return "-d8";
		case -4:
			return "-d12";
		case -5:
			return "-d20";
		case -6:
			return "-2d20";
	}
}

// Adjust required minimum and maximum values for stats depending on species selected
function adjustMinMaxForSpecies(e) {
	var selectedSpecies = document.getElementById("selectedSpecies").value.toLowerCase();
	var hasDefaulted = false;
	switch(selectedSpecies) {
		case 'human (elaphromorph)':
			minStatValue["characterAgi"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = 3;
			maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "AGI min 4; STR max 3";
			document.getElementById("selectedSpeciesNotes2").value = "Low G: +2 step to Acrobatics";
			document.getElementById("selectedSpeciesNotes3").value = "High/Extreme G: -1 step to all penalties";
			break;
		case 'human (baromorph)':
			minStatValue["characterStr"] = 4;
			minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterAgi"] = 3;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "STR min 4; AGI max 3; Encum. pen. -1 category";
			document.getElementById("selectedSpeciesNotes2").value = "High G: no penalty; Extreme G: reduced 2 steps";
			document.getElementById("selectedSpeciesNotes3").value = "Zero/Low G: -1 step to all penalties";
			break;
		case 'android':
			minStatValue["characterVit"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterPer"] = 4;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "VIT min 4; PER max 4";
			document.getElementById("selectedSpeciesNotes2").value = "Disengage the Safties; Reprogrammable";
			document.getElementById("selectedSpeciesNotes3").value = "Artificial Life; Oblivious; CR29";
			break;
		case 'briith':
			minStatValue["characterStr"] = 4;
			minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterAgi"] = 4;
			maxStatValue["characterInt"] = 5;
			maxStatValue["characterStr"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "STR min 4; AGI max 4; INT max 5";
			document.getElementById("selectedSpeciesNotes2").value = "Natural armor +1; Initiative checks -1 step";
			document.getElementById("selectedSpeciesNotes3").value = "High G: no penalty; Extreme G: reduced 2 steps";
			break;
		case 'nesh':
			minStatValue["characterFoc"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = 4;
			maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "FOC min 4; STR max 4";
			document.getElementById("selectedSpeciesNotes2").value = "Empathy ch. +2 step; Willpower ch. -2 step";
			document.getElementById("selectedSpeciesNotes3").value = "Bright light -1 step; Science (botany) +2 step";
			break;
		case 'xayon':
			minStatValue["characterAgi"] = 4;
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterFoc"] = 4;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			document.getElementById("selectedSpeciesNotes1").value = "AGI min 4; FOC max 4";
			document.getElementById("selectedSpeciesNotes2").value = "Acrobatics +1 step; Evade -1 step to enemies";
			document.getElementById("selectedSpeciesNotes3").value = "Quadruped sprint; Ambidex; Nearsighted; CR37";
			break;
		default:
			minStatValue["characterStr"] = minStatValue["characterInt"] = minStatValue["characterAgi"] = minStatValue["characterFoc"] = minStatValue["characterVit"] = minStatValue["characterPer"] = 1;
			maxStatValue["characterStr"] = maxStatValue["characterInt"] = maxStatValue["characterAgi"] = maxStatValue["characterFoc"] = maxStatValue["characterVit"] = maxStatValue["characterPer"] = 10;
			hasDefaulted = true;
			break;
	}
	if ( hasDefaulted ) {
		document.getElementById("selectedSpeciesNotes1").removeAttribute("readonly");
		document.getElementById("selectedSpeciesNotes2").removeAttribute("readonly");
		document.getElementById("selectedSpeciesNotes3").removeAttribute("readonly");
	} else {
		document.getElementById("selectedSpeciesNotes1").setAttribute("readonly", "true");
		document.getElementById("selectedSpeciesNotes2").setAttribute("readonly", "true");
		document.getElementById("selectedSpeciesNotes3").setAttribute("readonly", "true");
	}
	recalculateCharacterSkills(e);
	talents(e, rebuildMenu = true);
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

// Calculate character's armor
function calculateArmor(e) {
	var characterSpeed = 20;	
	var reductionPhysical = 0;
	var reductionEnergy = 0;
	var stepsPenalty = 0;
	// Briith have a natural bonus of "1"
	var selectedSpecies = document.getElementById("selectedSpecies").value.toLowerCase();
	if ( selectedSpecies == "briith" ) {
		reductionPhysical++;
		reductionEnergy++;
	}
	// Calculate panalty reductions base on Armor Training skill level
	switch(parseInt(document.getElementById("armortrainingLevel").value)) {
		case 1:
			stepsPenalty -= 1;
			break;
		case 2:
			characterSpeed += 2;
			stepsPenalty -= 1;
			break;
		case 3:
			characterSpeed += 2;
			stepsPenalty -= 1;
			break;
		case 4:
			characterSpeed += 2;
			stepsPenalty -= 2;
			break;
		case 5:
			characterSpeed += 4;
			stepsPenalty -= 2;
			break;
		case 6:
			characterSpeed += 4;
			stepsPenalty -= 2;
			break;
		case 7:
			characterSpeed += 4;
			stepsPenalty -= 3;
			break;
		case 8:
			characterSpeed += 6;
			stepsPenalty -= 3;
			break;
		case 9:
			characterSpeed += 6;
			stepsPenalty -= 3;
			break;
		case 10:
			characterSpeed += 6;
			stepsPenalty -= 3;
			break;
		default:
			break;
	}
	// Get primary armor; adjust values
	var primaryArmorWeight = 0;
	var primaryArmor = document.getElementById("primaryArmor").value.toLowerCase();
	var hasDefaultedPrimary = false;
	switch(primaryArmor) {
		case 'hide armor':
			characterSpeed -= 2;
			primaryArmorWeight = 8;
			reductionPhysical += 2;
			reductionEnergy += 0;
			stepsPenalty += 1;
			break;
		case 'bronze cuirass':
			characterSpeed -= 6;
			primaryArmorWeight = 30;
			reductionPhysical += 4;
			reductionEnergy += 0;
			stepsPenalty += 2;
			break;
		case 'shield':
			characterSpeed -= 2;
			primaryArmorWeight = 8;
			stepsPenalty += 1;
			break;
		case 'chain mail':
			characterSpeed -= 6;
			primaryArmorWeight = 25;
			reductionPhysical += 4;
			reductionEnergy += 0;
			stepsPenalty += 3;
			break;
		case 'plate mail':
			characterSpeed -= 6;
			primaryArmorWeight = 30;
			reductionPhysical += 6;
			reductionEnergy += 1;
			stepsPenalty += 2;
			break;
		case 'breastplate':
			characterSpeed -= 4;
			primaryArmorWeight = 10;
			reductionPhysical += 4;
			reductionEnergy += 0;
			stepsPenalty += 2;
			break;
		case 'flak jacket':
			characterSpeed -= 2;
			primaryArmorWeight = 5;
			reductionPhysical += 2;
			reductionEnergy += 0;
			stepsPenalty += 1;
			break;
		case 'police vest':
			primaryArmorWeight = 3;
			reductionPhysical += 3;
			reductionEnergy += 0;
			break;
		case 'riot shield':
			primaryArmorWeight = 5;
			stepsPenalty += 1;
			break;
		case 'tactical armor':
			characterSpeed -= 4;
			primaryArmorWeight = 15;
			reductionPhysical += 5;
			reductionEnergy += 1;
			stepsPenalty += 2;
			break;
		case 'carbon fiber plate':
			characterSpeed -= 4;
			primaryArmorWeight = 12;
			reductionPhysical += 6;
			reductionEnergy += 3;
			stepsPenalty += 2;
			break;
		case 'decelerator belt':
			primaryArmorWeight = 2;
			reductionPhysical += 3;
			reductionEnergy += 1;
			break;
		case 'duraweb coat':
			primaryArmorWeight = 2;
			reductionPhysical += 1;
			reductionEnergy += 3;
			break;
		case 'exoskeleton':
			characterSpeed -= 2;
			primaryArmorWeight = 80;
			reductionPhysical += 5;
			reductionEnergy += 4;
			stepsPenalty += 3;
			break;
		case 'hardmesh uniform':
			primaryArmorWeight = 2;
			reductionPhysical += 2;
			reductionEnergy += 2;
			break;
		case 'polymer mail':
			characterSpeed -= 4;
			primaryArmorWeight = 8;
			reductionPhysical += 4;
			reductionEnergy += 2;
			stepsPenalty += 2;
			break;
		case 'stealthsuit':
			primaryArmorWeight = 15;
			reductionPhysical += 3;
			reductionEnergy += 3;
			break;
		case 'vacuum armor':
			characterSpeed -= 4;
			primaryArmorWeight = 30;
			reductionPhysical += 4;
			reductionEnergy += 3;
			stepsPenalty += 2;
			break;
		case 'battlesuit, assault':
			characterSpeed -= 4;
			primaryArmorWeight = 200;
			reductionPhysical += 9;
			reductionEnergy += 9;
			stepsPenalty += 3;
			break;
		case 'battlesuit, raider':
			characterSpeed -= 2;
			primaryArmorWeight = 120;
			reductionPhysical += 7;
			reductionEnergy += 7;
			stepsPenalty += 3;
			break;
		case 'forcefield':
			primaryArmorWeight = 0;
			break;
		case 'grav deflector':
			primaryArmorWeight = 2;
			break;
		case 'isihlangu':
			primaryArmorWeight = 1;
			break;
		case 'nanoweave suit':
			primaryArmorWeight = 3;
			reductionPhysical += 3;
			reductionEnergy += 3;
			break;
		case 'adamant mesh':
			primaryArmorWeight = 2;
			reductionPhysical += 4;
			reductionEnergy += 4;
			break;
		case 'aegis field':
			primaryArmorWeight = 1;
			reductionPhysical += 2;
			reductionEnergy += 3;
			break;
		case 'displacer unit':
			primaryArmorWeight = 0;
			break;
		case 'warsuit, hussar':
			characterSpeed -= 4;
			primaryArmorWeight = 100;
			reductionPhysical += 10;
			reductionEnergy += 10;
			stepsPenalty += 2;
			break;
		default:
			hasDefaultedPrimary = true;
			break;
	}
	// Get additional armor; adjust values
	var additionalArmorWeight = 0;
	var additionalArmor = document.getElementById("additionalArmor").value.toLowerCase();
	var hasDefaultedAdditional = false;
	switch(additionalArmor) {
		case 'shield':
			characterSpeed -= 2;
			additionalArmorWeight = 8;
			stepsPenalty += 1;
			break;
		case 'riot shield':
			additionalArmorWeight = 5;
			stepsPenalty += 1;
			break;
		case 'decelerator belt':
			additionalArmorWeight = 2;
			reductionPhysical += 3;
			reductionEnergy += 1;
			break;
		case 'forcefield':
			additionalArmorWeight = 0;
			break;
		case 'grav deflector':
			additionalArmorWeight = 2;
			break;
		case 'isihlangu':
			additionalArmorWeight = 1;
			break;
		case 'aegis field':
			additionalArmorWeight = 1;
			reductionPhysical += 2;
			reductionEnergy += 3;
			break;
		case 'displacer unit':
			additionalArmorWeight = 0;
			break;
		default:
			hasDefaultedAdditional = true;
			break;
	}
	// Populate speed
	if ( selectedSpecies != "" ) {
		document.getElementById("characterSpeed").value = ( characterSpeed > 20 ? 20 : characterSpeed );
	}
	// Populate total
	if ( reductionPhysical == 0 && reductionEnergy == 0 ) {
		document.getElementById("reductionPhysical").removeAttribute("readonly");
		document.getElementById("reductionEnergy").removeAttribute("readonly");
		document.getElementById("reductionPhysical").value = "";
		document.getElementById("reductionEnergy").value = "";
	} else if ( !hasDefaultedPrimary && !hasDefaultedAdditional || ( hasDefaultedPrimary && primaryArmor == "" || hasDefaultedAdditional && additionalArmor == "" ) ) {
		document.getElementById("reductionPhysical").setAttribute("readonly", "true");
		document.getElementById("reductionEnergy").setAttribute("readonly", "true");
		document.getElementById("reductionPhysical").value = reductionPhysical;
		document.getElementById("reductionEnergy").value = reductionEnergy;
	} else if ( hasDefaultedPrimary || hasDefaultedAdditional ) {
		document.getElementById("reductionPhysical").setAttribute("readonly", "true");
		document.getElementById("reductionEnergy").setAttribute("readonly", "true");
		document.getElementById("reductionPhysical").value = "    + " + reductionPhysical;
		document.getElementById("reductionEnergy").value =  "    + " + reductionEnergy;
	}
	// Populate weight
	if ( !hasDefaultedPrimary ) {
		if ( primaryArmorWeight == 0 ) {
			document.getElementById("primaryArmorWeight").removeAttribute("readonly");
			document.getElementById("primaryArmorWeight").value = "";
		} else {
			document.getElementById("primaryArmorWeight").setAttribute("readonly", "true");
			document.getElementById("primaryArmorWeight").value = primaryArmorWeight;
		}
	} else {
		document.getElementById("primaryArmorWeight").removeAttribute("readonly");
	}
	if ( !hasDefaultedAdditional ) {
		if ( additionalArmorWeight == 0 ) {
			document.getElementById("additionalArmorWeight").removeAttribute("readonly");
			document.getElementById("additionalArmorWeight").value = "";
		} else {
			document.getElementById("additionalArmorWeight").setAttribute("readonly", "true");
			document.getElementById("additionalArmorWeight").value = additionalArmorWeight;
		}
	} else {
		document.getElementById("additionalArmorWeight").removeAttribute("readonly");
	}
	// Populate skill penalty steps
	var skillsToGetPenalized = ['acrobatics','athletics','dodge','endurance','extremesports','stealth'];
	if ( primaryArmorWeight == 0 && additionalArmorWeight == 0 ) {
		stepsPenalty = 0;
	}
	for ( var skill in skillsToGetPenalized ) {
		if ( document.getElementById(skillsToGetPenalized[skill] + "Level").value != "" ) {
			document.getElementById(skillsToGetPenalized[skill] + "Steps").innerHTML = stepValueToDie(stepsPenalty);
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

// Populate weapons
function populateWeapons(e) {
	// Define properties for each known weapon
	var weapons =  { 'unarmed': ['','3','1d4+0/2 P','NL'],
	                 'club': ['','3','1d4+0/3 P','NL, +1dmg 2H'],
	                 'spear': ['','3','1d6+1/5 P','2H'],
	                 'knife': ['','3','1d4+1/4 P',''],
	                 'short sword': ['','3','1d6+1/5 P',''],
	                 'polearm': ['','4','1d6+1/5 P','2H, AP1'],
	                 'long sword': ['','3','1d6+1/5 P','+1dmg 2H'],
	                 'mace': ['','4','1d6+0/4 P','+1dmg 2H'],
	                 'bayonet': ['','4','1d6+1/5 P','2H'],
	                 'combat knife': ['','3','1d6+1/5 P',''],
	                 'tactical baton': ['','3','1d4+0/4 P','NL'],
	                 'stun gun': ['','3','1d6+0/2 E','Stun, NL'],
	                 'shock glove': ['','4','1d6+2/3 E','Stun, NL'],
	                 'vibroblade': ['','3','1d6+1/5 P','AP2, +1dmg 2H'],
	                 'chainsaw bayonet': ['','4','1d6+2/7 P','Bleed, 2H'],
	                 'forcespike bayonet': ['','3','1d6+2/7 P','AP1, 2H'],
	                 'diskos': ['','4','1d8+3/9 P','AP3, 2H'],
	                 'power gauntlet': ['','3','1d8+1/5 P','+1 step grap'],
	                 'force hammer': ['','4','1d8+2/7 P','MB3, 2H'],
	                 'nega-glaive': ['','4','1d12+3/9 E','Irradiate, 2H'],
	                 'star sword': ['','3','1d10+3/9 E','+1dmg 2H'],
	                 'bolas': ['C','4','1d4+0/3 P',''],
	                 'javelin': ['M','3','1d6+1/4 P',''],
	                 'sling': ['L','4','1d4+0/4 P','R1'],
	                 'bow': ['L','3','1d6+0/3 P','R1'],
	                 'crossbow': ['L','3','1d6+0/4 P','R3, AP3'],
	                 'musket, flintlock': ['M','4','1d10+0/4 P','R5'],
	                 'pistol, flintlock': ['C','4','1d8+0/4 P','R3'],
	                 'revolver': ['M','3','1d6+1/6 P','M6'],
	                 'rifle, bolt-action': ['VL','4','1d8+2/6 P','M5'],
	                 'shotgun': ['M','4','1d8+0/5 P','M5, Brutal'],
	                 'pistol, light': ['M','3','1d6+1/5 P',''],
	                 'pistol, heavy': ['M','4','1d8+1/6 P',''],
	                 'rifle, assault': ['VL','3','1d8+2/8 P','M30, Auto'],
	                 'rifle, sniper': ['VL','4','1d8+2/8 P','Acc'],
	                 'smg': ['L','3','1d6+1/5 P','M20, Auto'],
	                 'flachette pistol': ['C','3','1d6+1/5 P','Brutal'],
	                 'flachette gun': ['M','3','1d6+1/5 P','M30,Auto,Brut'],
	                 'razor pistol': ['L','3','1d10+0/4 P','Bleed, M20'],
	                 'taser': ['C','3','1d4+0/1 E','R2, NL, Stun'],
	                 'laser pistol': ['L','3','1d6+0/6 E','Acc'],
	                 'laser rifle': ['VL','4','1d6+1/8 E','Acc, M20'],
	                 'sonic bore': ['C','4','1d8+0/5 E','Spread, Stun'],
	                 'plasma pistol': ['M','3','2d4/2d8 E',''],
	                 'plasma rifle': ['VL','4','2d6/2d12 E',''],
	                 'phase pistol': ['M','3','1d6+2/7 E','Acc, Ignite'],
	                 'phase rifle': ['Ex','3','1d6+4/9 E','Acc, Ignite, M20'],
	                 'disintegrator': ['L','3','1d10+0/6 E','AP3, Irradiate'],
	                 'light machinegun': ['VL','4','1d8+2/7 P','ImpAuto, M100'],
	                 'flamethrower': ['C','4','2d8 (1d8) E','B2(4),Ignite,M5'],
	                 'grenade, frag': ['','4','2d6 (1d8) P','B4(8)'],
	                 'grenade, smoke': ['','','','Area 4m'],
	                 'grenade launcher': ['L','4','by grenade','Ammo Loadout'],
	                 'grenade, concussion': ['','4','1d8+4(0) E','B3(6)'],
	                 'rocket, antitank': ['VL','5','1d10+1/6 E','AP3, MB2, R3'],
	                 'gauss rifle': ['VL','3','1d6+4/8 P','ImpAuto, M100'],
	                 'grenade, emp': ['','4','2d8 (1d10) E','B4(8), EMP'],
	                 'grenade, thermal': ['','4','1d8+6(2) E','B3(6), Ignite'],
	                 'laser minigun': ['Ex','3','1d6+3/7 E','Acc,ImpA,M50'],
	                 'rail rifle': ['Ex','5','1d8+4/8 P','AP3, M20'],
	                 'z-missle launcher': ['VL','3','by grenade','Ammo Loadout'],
	                 'neutron cannon': ['L','5','2d6/2d10 E','AP6, M20'],
	                 'grenade, swarm': ['','4','2d8 (1d10) P','B5(10)'],
	                 'plasma hurler': ['VL','4','1d8+7(3) E','B3(6), R1'],
	                 'razor gun': ['Ex','4','1d10+2/6 P','Bleed,ImpA,M50'],
	                 'matter beam': ['VL','4','2d6/2d12 E','AP6, M20'],
	                 'gravity render': ['Ex','3','1d6+5/10 E','ImpAuto, M50'],
	                 'grenade, null': ['','4','2d10 (2d10) E','B5(10), Irradiate'],
	                 'shock rifle': ['Ex','4','1d10+3/7 E','Acc, MB2']
	};
	// For each row, check if there's a weapon selected and populate adjacent fields
	for ( var i = 0; i < 6; i++ ) {
		var selectedWeapon = document.getElementById("weaponName" + i).value.toLowerCase();
		if ( selectedWeapon != "" && weapons[selectedWeapon] != null ) {
			document.getElementById("weaponRange" + i).setAttribute("readonly", "true");
			document.getElementById("weaponSpeed" + i).setAttribute("readonly", "true");
			document.getElementById("weaponDamage" + i).setAttribute("readonly", "true");
			document.getElementById("weaponSpecial" + i).setAttribute("readonly", "true");
			document.getElementById("weaponRange" + i).value = weapons[selectedWeapon][0];
			document.getElementById("weaponSpeed" + i).value = weapons[selectedWeapon][1];
			document.getElementById("weaponDamage" + i).value = weapons[selectedWeapon][2];
			document.getElementById("weaponSpecial" + i).value = weapons[selectedWeapon][3];
		} else {
			document.getElementById("weaponRange" + i).removeAttribute("readonly");
			document.getElementById("weaponSpeed" + i).removeAttribute("readonly");
			document.getElementById("weaponDamage" + i).removeAttribute("readonly");
			document.getElementById("weaponSpecial" + i).removeAttribute("readonly");
		}
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
		var characterLevel = parseInt(document.getElementById("characterLevel").value);
		var skillLevel = parseInt(document.getElementById(characterSkill + "Level").value);
		skillLevel = ( skillLevel > 0 ? skillLevel : 0 );
		if ( skillLevel < 1 ) {
			skillLevel = 0;
			document.getElementById(characterSkill + "Level").value = "";
		} else if ( skillLevel > characterLevel + 5 ) {
			skillLevel = characterLevel + 5;
			document.getElementById(characterSkill + "Level").value = skillLevel;
		} else if ( skillLevel > 10 ) {
			skillLevel = 10;
			document.getElementById(characterSkill + "Level").value = skillLevel;
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

// Function which clears all selected talents
function clearTalents(e) {
	for ( var i = 0; i < 12; i++ ) {
		document.getElementById("talent" + i).value = "";
	}
	talents(e);
}

// Make modifications to the charecater sheet based on talents selected
function talents(e, rebuildMenu = false) {
	// Get recquired character info
	var characterLevel = parseInt(document.getElementById("characterLevel").value);
	if ( isNaN(characterLevel) ) {
		characterLevel = 0;
	}
	var selectedSpecies = document.getElementById("selectedSpecies").value;

	// Create hierarchical talent structure
	var talentConstellations = {
		"Alertness": { "minimumLevel": "1" },
		"Closer": { "minimumLevel": "1" },
		"Commander": { "minimumLevel": "1" },
		"Commando": { "minimumLevel": "1" },
		"Dirty Fighting": { "minimumLevel": "1" },
		"Drone Expert": { "minimumLevel": "1" },
		"Elusive": { "minimumLevel": "1" },
		"Gearhead": { "minimumLevel": "1" },
		"Gunner": { "minimumLevel": "1" },
		"Gunslinger": { "minimumLevel": "1" },
		"Inventor": { "minimumLevel": "1" },
		"Martial Arts, Grappling": { "minimumLevel": "1" },
		"Martial Arts, Striking": { "minimumLevel": "1" },
		"Medic": { "minimumLevel": "1" },
		"Melee Expert": { "minimumLevel": "1" },
		"Rugged": { "minimumLevel": "1" },
		"Sniper": { "minimumLevel": "1" },
		"Spy": { "minimumLevel": "1" },
		"Trooper": { "minimumLevel": "1" },
		"Artificial Systems": { "minimumLevel": "1", "restrictedToSpecies": "Android" },
		"Powerful Build": { "minimumLevel": "1", "restrictedToSpecies": "Briith" },
		"Rapport": { "minimumLevel": "1", "restrictedToSpecies": "Nesh" },
		"Limb Articulation": { "minimumLevel": "1", "restrictedToSpecies": "Xayon" },
		"Self-Improvement": { "minimumLevel": "2" }
	};
	var talents = {
		"Hit the Dirt": { "constellation": "Alertness" },
		"Keen Senses": { "constellation": "Alertness" },
		"Prepared Action": { "constellation": "Alertness" },
		"Snapshot": { "constellation": "Alertness", "parent": "Prepared Action" },
		"Reactive Shout": { "constellation": "Alertness" },
		"Character Study": { "constellation": "Closer" },
		"Seductive": { "constellation": "Closer", "parent": "Character Study" },
		"Chameleon": { "constellation": "Closer" },
		"Cultural Sponge": { "constellation": "Closer", "parent": "Chameleon" },
		"Combat Leader": { "constellation": "Commander" },
		"Skills Coach": { "constellation": "Commander", "parent": "Combat Leader" },
		"Inspiration to All": { "constellation": "Commander", "parent": "Skills Coach" },
		"Flexible Tactics": { "constellation": "Commander" },
		"Rapid Reassessment": { "constellation": "Commander", "parent": "Flexible Tactics" },
		"Taunt": { "constellation": "Commander" },
		"Group Taunt": { "constellation": "Commander", "parent": "Taunt" },
		"Crucial Taunt": { "constellation": "Commander", "parent": "Group Taunt" },
		"Dash": { "constellation": "Commando" },
		"Serpentine": { "constellation": "Commando", "parent": "Dash" },
		"Grenadier": { "constellation": "Commando" },
		"Overwatch": { "constellation": "Commando" },
		"Skirmisher": { "constellation": "Commando" },
		"Silent Death": { "constellation": "Commando" },
		"Trained Spotter": { "constellation": "Commando" },
		"Bum Rush": { "constellation": "Dirty Fighting" },
		"Distracting Blow": { "constellation": "Dirty Fighting" },
		"Blinding Blow": { "constellation": "Dirty Fighting", "parent": "Distracting Blow" },
		"Make 'Em Hurt": { "constellation": "Dirty Fighting" },
		"Make 'Em Bleed": { "constellation": "Dirty Fighting", "parent": "Make 'Em Hurt" },
		"Overclocking": { "constellation": "Drone Expert" },
		"Rapid Scripting": { "constellation": "Drone Expert" },
		"Conditional Logic": { "constellation": "Drone Expert", "parent": "Rapid Scripting" },
		"Combat Crouch": { "constellation": "Elusive" },
		"Evasive Footwork": { "constellation": "Elusive" },
		"Instinctive Evasion": { "constellation": "Elusive", "parent": "Evasive Footwork" },
		"Lucky Miss": { "constellation": "Elusive" },
		"Built These Myself": { "constellation": "Gearhead" },
		"One of a Kind": { "constellation": "Gearhead", "parent": "Built These Myself" },
		"Fast Work": { "constellation": "Gearhead" },
		"Hit It Again": { "constellation": "Gearhead", "parent": "Fast Work" },
		"Saboteur": { "constellation": "Gearhead" },
		"Improvised Trap": { "constellation": "Gearhead", "parent": "Saboteur" },
		"Street Mod": { "constellation": "Gearhead" },
		"Cover Destruction": { "constellation": "Gunner" },
		"Dakka Dakka": { "constellation": "Gunner" },
		"Forward Observer": { "constellation": "Gunner" },
		"Shockwave": { "constellation": "Gunner", "parent": "Forward Observer" },
		"Blast Shaping": { "constellation": "Gunner", "parent": "Shockwave" },
		"Suppresive Fire": { "constellation": "Gunner" },
		"Unleash Hell": { "constellation": "Gunner", "parent": "Suppresive Fire" },
		"Strap It Down": { "constellation": "Gunner" },
		"Disarming Shot": { "constellation": "Gunslinger" },
		"Double Tap": { "constellation": "Gunslinger" },
		"Dramatic Reload": { "constellation": "Gunslinger" },
		"Free Reload": { "constellation": "Gunslinger", "parent": "Dramatic Reload" },
		"Dual Pistols": { "constellation": "Gunslinger" },
		"Dual Targeting": { "constellation": "Gunslinger", "parent": "Dual Pistols" },
		"Dual Deathdealer": { "constellation": "Gunslinger", "parent": "Dual Targeting" },
		"Gun Fu": { "constellation": "Gunslinger" },
		"Steady Hand": { "constellation": "Gunslinger" },
		"Distance Shot": { "constellation": "Gunslinger", "parent": "Steady Hand" },
		"Deadeye Shot": { "constellation": "Gunslinger", "parent": "Steady Hand" },
		"The Best Teacher": { "constellation": "Inventor" },
		"Not That One!": { "constellation": "Inventor", "parent": "The Best Teacher" },
		"Miraculous Invention": { "constellation": "Inventor" },
		"Improvisation": { "constellation": "Inventor" },
		"Resourcefulness": { "constellation": "Inventor" },
		"Disarming Lock": { "constellation": "Martial Arts, Grappling" },
		"Submission Lock": { "constellation": "Martial Arts, Grappling", "parent": "Disarming Lock" },
		"Judo Throw": { "constellation": "Martial Arts, Grappling" },
		"Defensive Flip": { "constellation": "Martial Arts, Grappling", "parent": "Judo Throw" },
		"Bodyslam": { "constellation": "Martial Arts, Grappling", "parent": "Defensive Flip" },
		"Takedown": { "constellation": "Martial Arts, Grappling" },
		"Ground and Pound": { "constellation": "Martial Arts, Grappling", "parent": "Takedown" },
		"Tight Clinch": { "constellation": "Martial Arts, Grappling" },
		"Combo Strike": { "constellation": "Martial Arts, Striking" },
		"Whirlwind Combo": { "constellation": "Martial Arts, Striking", "parent": "Combo Strike" },
		"Defensive Stance": { "constellation": "Martial Arts, Striking" },
		"Roll With the Punch": { "constellation": "Martial Arts, Striking", "parent": "Defensive Stance" },
		"Hands of Stone": { "constellation": "Martial Arts, Striking" },
		"Haymaker": { "constellation": "Martial Arts, Striking" },
		"Knockout Blow": { "constellation": "Martial Arts, Striking", "parent": "Haymaker" },
		"Don't You Quit on Me": { "constellation": "Medic" },
		"First Responder": { "constellation": "Medic" },
		"Emergency Treatment": { "constellation": "Medic", "parent": "First Responder" },
		"I've Seen Worse": { "constellation": "Medic" },
		"Physician, Heal Thyself": { "constellation": "Medic" },
		"Lunge": { "constellation": "Melee Expert" },
		"Overwhelming Lunge": { "constellation": "Melee Expert", "parent": "Lunge" },
		"Melee Combo": { "constellation": "Melee Expert" },
		"Melee Whirlwind": { "constellation": "Melee Expert", "parent": "Melee Combo" },
		"Parry": { "constellation": "Melee Expert" },
		"Riposte": { "constellation": "Melee Expert", "parent": "Parry" },
		"Disarming Riposte": { "constellation": "Melee Expert", "parent": "Riposte" },
		"Extra-Rugged I": { "constellation": "Rugged" },
		"Extra-Rugged II": { "constellation": "Rugged", "parent": "Extra-Rugged I" },
		"Extra-Rugged III": { "constellation": "Rugged", "parent": "Extra-Rugged II" },
		"Roll With It": { "constellation": "Rugged" },
		"Take It on the Armor": { "constellation": "Rugged", "parent": "Roll With It" },
		"Shake It Off": { "constellation": "Rugged" },
		"Inured the Pain": { "constellation": "Rugged", "parent": "Shake It Off" },
		"Suck It Up": { "constellation": "Rugged", "parent": "Inured the Pain" },
		"Controlled Breathing": { "constellation": "Sniper" },
		"Precise Sniper": { "constellation": "Sniper", "parent": "Controlled Breathing" },
		"Deadeye Sniper": { "constellation": "Sniper", "parent": "Precise Sniper" },
		"Extreme Range": { "constellation": "Sniper" },
		"Thousand-Meter Stare": { "constellation": "Sniper", "parent": "Extreme Range" },
		"Low Observables": { "constellation": "Sniper" },
		"Induce Panic": { "constellation": "Sniper", "parent": "Low Observables" },
		"Sighting In": { "constellation": "Sniper" },
		"Access": { "constellation": "Spy" },
		"Black Bag Specialist": { "constellation": "Spy" },
		"Safecracker": { "constellation": "Spy", "parent": "Black Bag Specialist" },
		"Brush Pass": { "constellation": "Spy" },
		"Expert Tail": { "constellation": "Spy" },
		"Vanish": { "constellation": "Spy" },
		"Controlled Burst": { "constellation": "Trooper" },
		"Focused Burst": { "constellation": "Trooper", "parent": "Controlled Burst" },
		"Deadly Reply": { "constellation": "Trooper" },
		"Imposing Threat": { "constellation": "Trooper" },
		"Over the Top": { "constellation": "Trooper" },
		"Spray and Pray": { "constellation": "Trooper" },
		"Covering Fire": { "constellation": "Trooper", "parent": "Spray and Pray" },
		"Stopping Power": { "constellation": "Trooper" },
		"Rock Steady": { "constellation": "Trooper", "parent": "Stopping Power" },
		"Hardened Systems": { "constellation": "Artificial Systems" },
		"Redundant Components": { "constellation": "Artificial Systems" },
		"Overdrive": { "constellation": "Artificial Systems", "parent": "Redundant Components" },
		"Social Programming": { "constellation": "Artificial Systems" },
		"Big Hitter": { "constellation": "Powerful Build" },
		"Bulldozer": { "constellation": "Powerful Build" },
		"Trample": { "constellation": "Powerful Build", "parent": "Bulldozer" },
		"Unstoppable": { "constellation": "Powerful Build", "parent": "Trample" },
		"Oversized Weapons": { "constellation": "Powerful Build" },
		"Thich Hide": { "constellation": "Powerful Build" },
		"Branching Network": { "constellation": "Rapport" },
		"Propagating Network": { "constellation": "Rapport" },
		"Rapid Communion": { "constellation": "Rapport" },
		"Euphoric Communion": { "constellation": "Rapport", "parent": "Rapid Communion" },
		"Forceful Communion": { "constellation": "Rapport", "parent": "Euphoric Communion" },
		"Ambiloader": { "constellation": "Limb Articulation" },
		"Dual Weapons": { "constellation": "Limb Articulation", "parent": "Ambiloader" },
		"Tripple Weapons": { "constellation": "Limb Articulation", "parent": "Dual Weapons" },
		"Feral Wrestler": { "constellation": "Limb Articulation" },
		"Flurry of Blows": { "constellation": "Limb Articulation" },
		"Feral Flurry": { "constellation": "Limb Articulation", "parent": "Flurry of Blows" },
		"Swift Quadruped": { "constellation": "Limb Articulation" },
		"Improve Strength": { "constellation": "Self-Improvement", "minimumLevel": "6" },
		"Improve Afility": { "constellation": "Self-Improvement", "minimumLevel": "6" },
		"Improve Vitality": { "constellation": "Self-Improvement", "minimumLevel": "6" },
		"Improve Intelligence": { "constellation": "Self-Improvement", "minimumLevel": "6" },
		"Improve Focus": { "constellation": "Self-Improvement", "minimumLevel": "6" },
		"Improve Personality": { "constellation": "Self-Improvement", "minimumLevel": "6" },
	};

	// Rebuild dropdown menu, if needed
	if ( rebuildMenu ) {
		menuHTML = "";
		for ( var constellation in talentConstellations ) {
			if ( characterLevel >= talentConstellations[constellation]["minimumLevel"]  && ( talentConstellations[constellation]["restrictedToSpecies"] == null || talentConstellations[constellation]["restrictedToSpecies"] == selectedSpecies ) ) {
				menuHTML += "<option value=\"" + constellation + "\">";
				for ( var talent in talents ) {
					if ( talents[talent]["constellation"] == constellation ) {
						if ( talents[talent]["minimumLevel"] == null || characterLevel >= talents[talent]["minimumLevel"] ) {
							if ( talents[talent]["parent"] != null ) {
								menuHTML += "<option value=\" - &gt; " + talent + "\">";
							} else {
								menuHTML += "<option value=\" &gt; " + talent + "\">";
							}
						}
					}
				}
			}
		}
		document.getElementById("talents").innerHTML = menuHTML;
	}

	// Populate array with values from the frontend
	var selectedTalents = [];
	for ( var i = 0; i < 12; i++ ) {
		selectedTalents.push(document.getElementById("talent" + i).value.replace(" > ","").replace(" -","").replace(" -",""));
	}

	// Generate propper tree from selected talents
	// Step 1: sort selected talents so they appear in the same order as in "talentConstellations" and "talents" objects
	var sortedTalents = [];
	for ( var constellation in talentConstellations ) {
		if ( selectedTalents.includes(constellation) ) {
			sortedTalents.push(constellation);
		}
		for ( var talent in talents ) {
			if ( talents[talent]["constellation"] == constellation && selectedTalents.includes(talent) ) {
				sortedTalents.push(talent);
			}
		}
	}
	// Step 2: populate selected talents with missing parent entries
	var expandedTalents = [];
	for ( var i = 0; i < sortedTalents.length; i++ ) {
		if ( talentConstellations[sortedTalents[i]] != null ) {
			expandedTalents.push(sortedTalents[i]);
			continue;
		}
		if ( talents[sortedTalents[i]] != null ) {
			if ( talents[sortedTalents[i]]["parent"] == null ) {
				expandedTalents.push(talents[sortedTalents[i]]["constellation"]);
				expandedTalents.push(" > " + sortedTalents[i]);
				continue;
			} else {
				if ( talents[talents[sortedTalents[i]]["parent"]]["parent"] == null ) {
					expandedTalents.push(talents[talents[sortedTalents[i]]["parent"]]["constellation"]);
					expandedTalents.push(" > " + talents[sortedTalents[i]]["parent"]);
					expandedTalents.push(" - > " + sortedTalents[i]);
					continue;
				} else {
					expandedTalents.push(talents[talents[talents[sortedTalents[i]]["parent"]]["parent"]]["constellation"]);
					expandedTalents.push(" > " + talents[talents[sortedTalents[i]]["parent"]]["parent"]);
					expandedTalents.push(" - > " + talents[sortedTalents[i]]["parent"]);
					expandedTalents.push(" - - > " + sortedTalents[i]);
				}
			}
		}
	}
	// Step 3: remove duplicates
	var finalTalents = [];
	for ( var i = 0; i < expandedTalents.length; i++ ) {
		if ( finalTalents.indexOf(expandedTalents[i]) == -1 ) {
			finalTalents.push(expandedTalents[i]);
		}
	}
	// Step 4: put final array back into the HTML
	for ( var i = 0; i < 12; i++ ) {
		if ( finalTalents[i] != null ) {
			document.getElementById("talent" + i).value = finalTalents[i];
		} else {
			document.getElementById("talent" + i).value = "";
		}
	}
	// Hide the Talent Notes Block if no talents are selected
	if ( finalTalents.filter(function(el) { return el != ""; }).length == 0 ) {
		document.getElementById("talentNotesBlock").style.display = "none";
	} else {
		document.getElementById("talentNotesBlock").style.display = "";
	}
}

// Make changes based on character level
function characterLevel(e) {
	// Validate input
	var characterLevel = parseInt(document.getElementById("characterLevel").value);
	if ( characterLevel < 1 ) {
		document.getElementById("characterLevel").value = characterLevel = 1;
	} else if ( characterLevel > 10 ) {
		document.getElementById("characterLevel").value = characterLevel = 10;
	}
	if ( isNaN(characterLevel) ) {
		document.getElementById("talentNumSpan").style.display = "none";
		document.getElementById("talentNum").innerHTML = "";
	} else {
		document.getElementById("talentNumSpan").style.display = "initial";
		document.getElementById("talentNum").innerHTML = characterLevel + 2;
	}

	// Update available hero points
	document.getElementById("characterHeroPoints").value = isNaN(characterLevel) ? "" : characterLevel * 5 + 10;

	// Set number of available talents
	for ( var i = 0; i < 12; i++ ) {
		if ( i < ( isNaN(characterLevel) ? 3 : characterLevel ) + 2 ) {
			document.getElementById("talentRow" + i).style.display = "";
		} else {
			document.getElementById("talentRow" + i).style.display = "none";
		}
	}

	// Clear current talents and rebuild dropdown menu
	clearTalents(e);
	talents(e, rebuildMenu = true);
}

// The following array and functions are used for handling the character import/export string
// List of all inputable IDs 
//
// The order of IDs is important. IDs for auto-populated fields need to be placed before the ID for the field which fires the event for auto-populating said fields.
// This way, there doesn't need to be a distinction in "save strings" between predefined values (weapons, species, gear) and custom inputs.
var valuesDefiningACharacter = [     "characterName",
                                     "characterArchetype",
                                     "characterLevel",
                                     "characterHeroPoints",
                                     "characterStr",
                                     "characterInt",
                                     "characterAgi",
                                     "characterFoc",
                                     "characterVit",
                                     "characterPer",
                                     "weaponRange0",
                                     "weaponSpeed0",
                                     "weaponDamage0",
                                     "weaponSpecial0",
                                     "weaponName0",
                                     "weaponRange1",
                                     "weaponSpeed1",
                                     "weaponDamage1",
                                     "weaponSpecial1",
                                     "weaponName1",
                                     "weaponRange2",
                                     "weaponSpeed2",
                                     "weaponDamage2",
                                     "weaponSpecial2",
                                     "weaponName2",
                                     "weaponRange3",
                                     "weaponSpeed3",
                                     "weaponDamage3",
                                     "weaponSpecial3",
                                     "weaponName3",
                                     "weaponRange4",
                                     "weaponSpeed4",
                                     "weaponDamage4",
                                     "weaponSpecial4",
                                     "weaponName4",
                                     "weaponRange5",
                                     "weaponSpeed5",
                                     "weaponDamage5",
                                     "weaponSpecial5",
                                     "weaponName5",
                                     "selectedSpeciesNotes1",
                                     "selectedSpeciesNotes2",
                                     "selectedSpeciesNotes3",
                                     "selectedSpecies",
                                     "primaryArmorWeight",
                                     "primaryArmor",
                                     "additionalArmorWeight",
                                     "additionalArmor",
                                     "otherGear1",
                                     "otherGearWeight1",
                                     "otherGear2",
                                     "otherGearWeight2",
                                     "otherGear3",
                                     "otherGearWeight3",
                                     "otherGear4",
                                     "otherGearWeight4",
                                     "otherGear5",
                                     "otherGearWeight5",
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
                                     "willpowerLevel",
                                     "talent0",
                                     "talent1",
                                     "talent2",
                                     "talent3",
                                     "talent4",
                                     "talent5",
                                     "talent6",
                                     "talent7",
                                     "talent8",
                                     "talent9",
                                     "talent10",
                                     "talent11"];

// Encode current character into a single string
function exportCharacter(e) {
	var characterSaveString = "";
	for ( var i in valuesDefiningACharacter ) {
		characterSaveString += document.getElementById(valuesDefiningACharacter[i]).value + "|";
	}
	document.getElementById("characterSaveString").value = btoa(encodeURIComponent(characterSaveString.slice(0, -1)));
}

// Decode the "save string" and populate character sheet
function importCharacter(e) {
	var characterSaveString = document.getElementById("characterSaveString").value;
	if ( characterSaveString == null || characterSaveString == "" ) {
		return;
	}
	if ( characterSaveString.length % 4 != 0 ) {
		alert("Invalid string!");
		return;
	}
	characterSaveString = decodeURIComponent(atob(characterSaveString)).split("|");
	if ( characterSaveString.length != valuesDefiningACharacter.length ) {
		alert("Invalid string!");
		return;
	}
	for ( var i in valuesDefiningACharacter ) {
		var currentElement = document.getElementById(valuesDefiningACharacter[i]);
		currentElement.focus();
		currentElement.value = characterSaveString[i];
		currentElement.blur();
	}
	window.scrollTo(0,0);
}
