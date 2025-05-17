var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseOutputParser } from '@langchain/core/output_parsers';
class LineListOutputParser extends BaseOutputParser {
    constructor(args) {
        var _a;
        super();
        this.key = 'questions';
        this.lc_namespace = ['langchain', 'output_parsers', 'line_list_output_parser'];
        this.key = (_a = args === null || args === void 0 ? void 0 : args.key) !== null && _a !== void 0 ? _a : this.key;
    }
    static lc_name() {
        return 'LineListOutputParser';
    }
    parse(text) {
        return __awaiter(this, void 0, void 0, function* () {
            text = text.trim() || '';
            const regex = /^(\s*(-|\*|\d+\.\s|\d+\)\s|\u2022)\s*)+/;
            const startKeyIndex = text.indexOf(`<${this.key}>`);
            const endKeyIndex = text.indexOf(`</${this.key}>`);
            if (startKeyIndex === -1 || endKeyIndex === -1) {
                return [];
            }
            const questionsStartIndex = startKeyIndex === -1 ? 0 : startKeyIndex + `<${this.key}>`.length;
            const questionsEndIndex = endKeyIndex === -1 ? text.length : endKeyIndex;
            const lines = text
                .slice(questionsStartIndex, questionsEndIndex)
                .trim()
                .split('\n')
                .filter((line) => line.trim() !== '')
                .map((line) => line.replace(regex, ''));
            return lines;
        });
    }
    getFormatInstructions() {
        throw new Error('Not implemented.');
    }
}
export default LineListOutputParser;
