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
document.getElementById("weaponName1").addEventListener("focusout", populateWeapons);
document.getElementById("weaponName2").addEventListener("focusout", populateWeapons);
document.getElementById("weaponName3").addEventListener("focusout", populateWeapons);
document.getElementById("weaponName4").addEventListener("focusout", populateWeapons);

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
	document.getElementById("characterSpeed").value = ( characterSpeed > 20 ? 20 : characterSpeed );
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
	for ( var i = 0; i < 4; i++ ) {
		var selectedWeapon = document.getElementById("weaponName" + (i + 1)).value.toLowerCase();
		if ( selectedWeapon != "" && weapons[selectedWeapon] != null ) {
			document.getElementById("weaponRange" + (i + 1)).setAttribute("readonly", "true");
			document.getElementById("weaponSpeed" + (i + 1)).setAttribute("readonly", "true");
			document.getElementById("weaponDamage" + (i + 1)).setAttribute("readonly", "true");
			document.getElementById("weaponSpecial" + (i + 1)).setAttribute("readonly", "true");
			document.getElementById("weaponRange" + (i + 1)).value = weapons[selectedWeapon][0];
			document.getElementById("weaponSpeed" + (i + 1)).value = weapons[selectedWeapon][1];
			document.getElementById("weaponDamage" + (i + 1)).value = weapons[selectedWeapon][2];
			document.getElementById("weaponSpecial" + (i + 1)).value = weapons[selectedWeapon][3];
		} else {
			document.getElementById("weaponRange" + (i + 1)).removeAttribute("readonly");
			document.getElementById("weaponSpeed" + (i + 1)).removeAttribute("readonly");
			document.getElementById("weaponDamage" + (i + 1)).removeAttribute("readonly");
			document.getElementById("weaponSpecial" + (i + 1)).removeAttribute("readonly");
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
                                     "selectedSpeciesNotes1",
                                     "selectedSpeciesNotes2",
                                     "selectedSpeciesNotes3",
                                     "selectedSpecies",
                                     "primaryArmorWeight",
                                     "primaryArmor",
                                     "additionalArmorWeight",
                                     "additionalArmor",
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
