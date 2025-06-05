import { inspect } from "util";

export default class Helper {
  public static comparePopulation(
    oldList: string[],
    newList: string[]
  ): { joined: string[]; left: string[] } {
    const oldSet = new Set(oldList);
    const newSet = new Set(newList);

    const joined = newList.filter((ign) => !oldSet.has(ign));
    const left = oldList.filter((ign) => !newSet.has(ign));

    return { joined, left };
  }

  public static cleanOutput(
    output: string,
    json?: boolean,
    rawHostname?: boolean
  ): any {
    if (!output) return null;

    let cleanOutput = output.replace(/\\n/g, "").trim();

    if (!rawHostname) {
      cleanOutput = cleanOutput.replace(/<color=[^>]+>|<\/color>/g, "");
    }

    try {
      const jsonObject = JSON.parse(cleanOutput);
      return json ? jsonObject : inspect(jsonObject, { depth: 3 });
    } catch (error) {
      return output;
    }
  }
}
