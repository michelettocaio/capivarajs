import * as _ from 'lodash';
import { Common } from './common';

export default function(source, context) {
    const referenceSelf = 'this.', regex = /\$*[a-z0-9.$]+\s*/gi, keys = source.match(regex);

    const replaceAt = (input, search, replace, start, end) => {
        return input.slice(0, start)
        + input.slice(start, end).replace(search, replace)
        + input.slice(end);
    };

    const getIndexStart = (arr, currentIndex) => {
        if (currentIndex === 0) { return 0; }
        const getPreviousSize = (i, size) => {
            const index = i - 1;
            if (index === -1) { return size; }
            size += arr[index].length;
            return getPreviousSize(index, size);
        };
        return getPreviousSize(currentIndex, 0);
    };

    keys.forEach((str, i) => {
        const key = str.replace(/\s/g, ''),
            indexStart = getIndexStart(keys, i);
        const indexEnd = indexStart + source.substring(indexStart, source.length).indexOf(key) + key.length;
        if (!key.includes(referenceSelf)) {
            if (context.hasOwnProperty(Common.getFirstKey(key))) {
                source = replaceAt(source, key, `this.${key}`, indexStart, indexEnd);
            }
        }
    });

    return function(str) {
        return eval(str);
    }.call(context, source);
}
