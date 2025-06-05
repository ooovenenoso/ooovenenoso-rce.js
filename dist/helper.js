"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Helper {
    static comparePopulation(oldList, newList) {
        const oldSet = new Set(oldList);
        const newSet = new Set(newList);
        const joined = newList.filter((ign) => !oldSet.has(ign));
        const left = oldList.filter((ign) => !newSet.has(ign));
        return { joined, left };
    }
    static cleanOutput(output, json, rawHostname) {
        if (!output)
            return null;
        let cleanOutput = output.replace(/\\n/g, "").trim();
        if (!rawHostname) {
            cleanOutput = cleanOutput.replace(/<color=[^>]+>|<\/color>/g, "");
        }
        try {
            const jsonObject = JSON.parse(cleanOutput);
            return json ? jsonObject : (0, util_1.inspect)(jsonObject, { depth: 3 });
        }
        catch (error) {
            return output;
        }
    }
}
exports.default = Helper;
//# sourceMappingURL=helper.js.map