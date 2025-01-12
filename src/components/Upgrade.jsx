export class Upgrade {
    constructor(id,
        currPhase,
        goalPhase,
        currSkill1,
        goalSkill1,
        currSkill2,
        goalSkill2,
        currSkill3,
        goalSkill3,
        currSkill4,
        goalSkill4,
        currECB,
        goalECB
    ) {
        this.id = id;
        this.currPhase = currPhase;
        this.goalPhase = goalPhase;
        this.currSkill1 = currSkill1;
        this.goalSkill1 = goalSkill1;
        this.currSkill2 = currSkill2;
        this.goalSkill2 = goalSkill2;
        this.currSkill3 = currSkill3;
        this.goalSkill3 = goalSkill3;
        this.currSkill4 = currSkill4;
        this.goalSkill4 = goalSkill4;
        this.currECB = currECB;
        this.goalECB = goalECB;
    }
}