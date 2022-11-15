import { FileConfig } from "../utils/interfaces/export.interface.js";
import { Generator } from "./Generator.js";
import { JavascriptGenerator } from "./JavascriptGenerator.js";
import fs from "fs";
import { PrivateUtils } from "../utils/helpers/PrivateUtils.js";

export class TypescriptGenerator extends Generator {
  private interfacesCode = "";
  private interfacesCreated: string[] = [];

  constructor(data: any, config: FileConfig) {
    super(data, "ts", config);
  }

  public async generateFile(): Promise<string> {
    let allCode = "";
    let javascriptCode = "";
    let code = "";

    const nameCapitalizaed = PrivateUtils.camelCaseText(this.config.fileName);

    if (Array.isArray(this.data)) {
      javascriptCode = new JavascriptGenerator(
        this.data,
        this.config,
      ).generateSchemaArray(this.data);
      code = `const ${nameCapitalizaed} :  ${this.generateSchemaInterface()}[] = ${javascriptCode};\n`;
    } else {
      javascriptCode = javascriptCode = new JavascriptGenerator(
        this.data,
        this.config,
      ).generateObject(this.data);
      code = `const ${nameCapitalizaed} :  ${this.generateObjectInterface(
        PrivateUtils.capitalizeCamelCase(this.config.fileName),
        this.data,
      )} = ${javascriptCode};\n`;
    }

    allCode += code;

    await fs.promises.writeFile(
      this.route,
      this.interfacesCode + allCode,
      "utf8",
    );

    return this.route;
  }

  private generateSchemaInterface(): string {
    const interfaceName = `I${PrivateUtils.capitalizeCamelCase(
      this.config.fileName,
    )}`;
    let interfaceCode = `interface ${interfaceName}{\n`;

    for (const key of Object.keys(this.data[0])) {
      const allValues = this.data.map((el: any) => el[key]);

      const retInt: string[] = [];
      for (const val of allValues) {
        if (Array.isArray(val)) retInt.push(this.generateArrayInterface(val));
        else retInt.push(this.generateInterfaceByValue(val));
      }

      const uniqueInt = new Set(retInt);
      const uniqueValues: string[] = [];
      uniqueInt.forEach((el) => uniqueValues.push(el));

      let keyInterface: string;
      if (uniqueValues.length <= 1) keyInterface = `${uniqueValues[0]}`;
      else {
        let str = "(";
        for (let i = 0; i < uniqueValues.length; i++) {
          if (i !== uniqueValues.length - 1) str += `${uniqueValues[i]} |`;
          else str += `${uniqueValues[i]}`;
        }
        str += ")";
        keyInterface = str;
      }

      interfaceCode += `${key}: ${keyInterface};`;
    }

    interfaceCode += "}\n";
    this.interfacesCode += interfaceCode;

    return interfaceName;
  }

  private generateObjectInterface(
    interfaceName: string,
    doc: {
      [path: string]: any;
    },
  ): string {
    const foundInterface = this.interfacesCreated.find(
      (el) => el === interfaceName,
    );

    if (!foundInterface) {
      let interfaceCode = `interface ${interfaceName}{\n\t`;
      for (const [key, value] of Object.entries(doc)) {
        interfaceCode += `${key}: ${this.generateInterfaceByValue(value)};`;
      }
      interfaceCode += "}\n";

      this.interfacesCode += interfaceCode;

      this.interfacesCreated.push(interfaceName);
    }

    return interfaceName;
  }

  private generateInterfaceByValue(value: any): string {
    let returnValue = "undefined";

    if (typeof value == "string") returnValue = "string";
    else if (typeof value === "number") returnValue = "number";
    else if (typeof value === "boolean") returnValue = "boolean";
    else if (value === null) returnValue = "null";
    else if (typeof value == "object") {
      if (Array.isArray(value)) {
        returnValue = this.generateArrayInterface(value);
      } else if (value instanceof Date) returnValue = "Date";
      else {
        let name = `Object`;
        const keys = Object.keys(value);
        for (const key of keys) name += key;
        returnValue = this.generateObjectInterface(name, value);
      }
    }

    return returnValue;
  }

  private generateArrayInterface(array: Array<any>): string {
    let interfaceCode = ``;

    const allTypes = array.map((el) => this.generateInterfaceByValue(el));
    const uniqueTypes = new Set(allTypes);

    if (uniqueTypes.size <= 1) {
      interfaceCode += `${allTypes[0]}`;
    } else {
      const unique: string[] = [];
      uniqueTypes.forEach((el) => unique.push(el));

      let str = "(";
      for (let i = 0; i < unique.length; i++) {
        if (i !== unique.length - 1) {
          str += `${unique[i]} |`;
        } else {
          str += `${unique[i]}`;
        }
      }
      str += ")";

      interfaceCode += `${str}`;
    }

    interfaceCode += `[]`;

    return interfaceCode;
  }
}
