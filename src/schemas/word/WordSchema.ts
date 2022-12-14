import { PrivateUtils } from "../../utils/helpers/PrivateUtils.js";
import { SchemaField } from "../SchemaField.js";
import WORDS, { ILanguageWord } from "./constants/index.js";

type Languages = "es" | "en";

type WordProps = {
  language?: Languages;
};

export class WordSchema {
  /**
   * Returns a adjective from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.adjective() // Schema
   * @example schemas.word.adjective().getValue() // 'clever'
   * @returns string
   */
  adjective(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "adjective",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).adjectives),
      args || {},
    );
  }

  /**
   * Returns a conjuction from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.conjuction() // Schema
   * @example schemas.word.conjuction().getValue() // 'but'
   * @returns string
   */
  conjuction(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "conjuction",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).conjuctions),
      args || {},
    );
  }

  /**
   * Returns a interjection from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.interjection() // Schema
   * @example schemas.word.interjection().getValue() // 'hey!'
   * @returns string
   */
  interjection(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "interjection",
      (a) =>
        PrivateUtils.oneOfArray(this.filterWords(a.language).interjections),
      args || {},
    );
  }

  /**
   * Returns a preposition from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.preposition() // Schema
   * @example schemas.word.preposition().getValue() // 'at'
   * @returns string
   */
  preposition(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "preposition",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).prepositions),
      args || {},
    );
  }

  /**
   * Returns a adverb from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.adverb() // Schema
   * @example schemas.word.adverb().getValue() // 'here'
   * @returns string
   */
  adverb(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "adverb",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).adverbs),
      args || {},
    );
  }

  /**
   * Returns a verb from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.verb() // Schema
   * @example schemas.word.verb().getValue() // 'had'
   * @returns string
   */
  verb(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "verb",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).verbs),
      args || {},
    );
  }

  /**
   * Returns a noun from a selected lenguage
   * @param args.language word language (`en` | `es`). Defaults `en`
   * @example schemas.word.noun() // Schema
   * @example schemas.word.noun().getValue() // 'car'
   * @returns string
   */
  noun(args?: WordProps) {
    return new SchemaField<string, WordProps>(
      "noun",
      (a) => PrivateUtils.oneOfArray(this.filterWords(a.language).nouns),
      args || {},
    );
  }

  private filterWords(lan: Languages | undefined): ILanguageWord {
    if (typeof lan === "string") {
      const languageSelected = WORDS[lan];
      if (languageSelected) return languageSelected;
      else return WORDS["en"];
    } else return WORDS["en"];
  }
}
