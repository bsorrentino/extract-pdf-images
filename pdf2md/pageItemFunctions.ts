import PageItem from './model/PageItem.js';
import LineItemBlock from './model/LineItemBlock';

export function minXFromBlocks(blocks:LineItemBlock[]) {
    var minX = 999;
    blocks.forEach(block => {
        block.items.forEach(item => {
            minX = Math.min(minX, item.x)
        });
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function minXFromPageItems(items:Array<any>) {
    var minX = 999;
    items.forEach(item => {
        minX = Math.min(minX, item.x)
    });
    if (minX == 999) {
        return null;
    }
    return minX;
}

export function sortByX(items:Array<any>) {
    items.sort((a, b) => {
        return a.x - b.x;
    });
}

export function sortCopyByX(items:Array<any>) {
    const copy = items.concat();
    sortByX(copy);
    return copy;
}