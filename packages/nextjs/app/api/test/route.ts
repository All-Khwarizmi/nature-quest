// runs the checkQuest step.  takes in two classifications, if they are the same, then it goes, if not, it doesn't.  
import { NextResponse } from "next/server";
import assert from "assert";
import { isQuestCompleted, checkIfQuestsAreCompleted } from "~~/services/quest-agent";
import { moveQuestToCompleted } from "~~/src/actions/userActions";

export async function GET(request: Request) {
    const quest1 = 'tree'
    const quest2 = 'tree'
    const quest3 = 'dog'
    
    console.log("isQuestcompleted Tests ----------------")
    console.log("Quest 1 & 2:", isQuestCompleted(quest1, quest2));
    console.log("Quest 1 & 3:", isQuestCompleted(quest1, quest3));
    console.log("isQuestcompleted DONE ----------------")
    console.log("\n")
    console.log("\n")
    assert.strictEqual(isQuestCompleted(quest1, quest2), true, 'should be true')
    assert.strictEqual(isQuestCompleted(quest1, quest3), false, 'should be false')

    console.log("moveQuestToCompleted Tests ----------------");

    const userAddress = "0xCc0c18042C4a91726329DF1EEaED8BA1f432F987";
    const questToMove = "Tree Spotter";
    
    // moveQuestToCompleted(userAddress, questToMove).then((result) => {
    //     console.log("Updated User Quests:", result);
    // }).catch((error) => {
    //     console.log("Error:", error.message);
    // });
    
    console.log("moveQuestToCompleted DONE ----------------");
    console.log("\n")
    console.log("\n")

    console.log("checkIfQuestsAreCompleted Tests ----------------");
    const pendingQuests1 = ["tree", "dog", "bird"];
    const pendingQuests2 = ["cat", "fish", "horse"];

    console.log("Pending Quests 1:", pendingQuests1);
    console.log("Capture Classification:", quest1);
    checkIfQuestsAreCompleted(quest1, pendingQuests1);

    console.log("\n");
    console.log("Pending Quests 2:", pendingQuests2);
    console.log("Capture Classification:", quest1);
    checkIfQuestsAreCompleted(quest1, pendingQuests2);
    
    console.log("checkIfQuestsAreCompleted DONE ----------------");
    console.log("\n");
    console.log("\n");

    // Assertions
    assert.strictEqual(isQuestCompleted(quest1, quest2), true, "should be true");
    assert.strictEqual(isQuestCompleted(quest1, quest3), false, "should be false");

    return NextResponse.json({})
}
