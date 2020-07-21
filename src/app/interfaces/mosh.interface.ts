export interface Brief {
    num?: number;
    title?: string;
    sector?: string;
    descrip?: string;
}

export interface ShipStatus {
    primaryModules: {
        lifeSupport: string;
        command: string;
        armor?: string;
    };

    secondaryModules: {
        jumpDrives?: string;
        computer?: string;
        medicalBay?: string;
        galley?: string;
        cryochamber?: string;
        livingQuarters?: string;
        barracks?: string;
        cargohold?: {
            status: string;
            contents: Array<string>
        };
        scienceLab?: string;

        thrusters: string;
        engine: string;
        fuel: string;
        frame: string;
    };
}

export interface CharSheet {
    name: string;
    class: string;
    currMods: CharacterMods;
    statsArray: CharacterStats;
    savesArray: CharacterSaves;
    skillsArray: Array<CharacterSkills>;
    loadoutName: string;
    equipmentArray: Array<CharacterEquipment>;
    credits: number;
    trinket: CharacterTrinketPatch;
    patch: CharacterTrinketPatch;
    notes: string;
}

export interface CharacterMods {
    max_Health: number;
    strength: number;
    speed: number;
    intellect: number;
    combat: number;

    sanity: number;
    fear: number;
    body: number;
    armor: number;

    stress: number;
    resolve: number;
}

export interface CharacterStats {
    stress: number;
    resolve: number;
    max_Health: number;
    strength: number;
    speed: number;
    intellect: number;
    combat: number;
}

export interface CharacterSaves {
    sanity: number;
    fear: number;
    body: number;
    armor: number;
}

export interface CharacterSkills {
    title: string;
    percent: string;
    cost: number;
    pre: Array<string>;
    descrip: string;
}

export interface CharacterEquipment {
    title: string;
    dmg?: string;
    crit?: string;
    range?: string;
    ammo?: string;
    shots?: string;
    special?: string;
    descrip?: string;
}

export interface CharacterTrinketPatch {
    num: number;
    descrip: string;
}
