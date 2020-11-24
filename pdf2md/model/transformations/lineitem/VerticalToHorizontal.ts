import ToLineItemTransformation from '../ToLineItemTransformation';
import ParseResult from '../../ParseResult';
import LineItem from '../../LineItem';
import StashingStream from '../../StashingStream';
import { REMOVED_ANNOTATION, ADDED_ANNOTATION } from '../../Annotation';
import { Word } from '../../Word';

// Converts vertical text to horizontal
export default class VerticalToHorizontal extends ToLineItemTransformation {

    constructor() {
        super("Vertical to Horizontal Text");
    }

    transform(parseResult:ParseResult) {
        var foundVerticals = 0;
        parseResult.pages.forEach(page => {
            const stream = new VerticalsStream();
            stream.consumeAll(page.items);
            page.items = stream.complete();
            foundVerticals += stream.foundVerticals;
        });

        return {
            ...parseResult,
            messages: ["Converted " + foundVerticals + " verticals"]
        }
    }

}

class VerticalsStream extends StashingStream {
    foundVerticals = 0;

    constructor() { super(); }

    shouldStash(item:LineItem) {
        return item.words.length == 1 && item.words[0].string.length == 1;
    }

    doMatchesStash(lastItem:LineItem, item:LineItem) {
        return lastItem.y - item.y > 5 && lastItem.words[0].type === item.words[0].type;
    }

    doFlushStash(stash:Array<LineItem>, results:Array<LineItem>) {
        if (stash.length > 5) { // unite
            var combinedWords = Array<Word>()
            var minX = 999;
            var maxY = 0;
            var sumWidth = 0;
            var maxHeight = 0;
            stash.forEach(oneCharacterLine => {
                oneCharacterLine.annotation = REMOVED_ANNOTATION;
                results.push(oneCharacterLine);
                combinedWords.push(oneCharacterLine.words[0]);
                minX = Math.min(minX, oneCharacterLine.x);
                maxY = Math.max(maxY, oneCharacterLine.y);
                sumWidth += oneCharacterLine.width;
                maxHeight = Math.max(maxHeight, oneCharacterLine.height);
            });
            results.push(new LineItem({
                ...stash[0],
                x: minX,
                y: maxY,
                width: sumWidth,
                height: maxHeight,
                words: combinedWords,
                annotation: ADDED_ANNOTATION
            }));
            this.foundVerticals++;
        } else { //add as singles
            results.push(...stash);
        }
    }
}
