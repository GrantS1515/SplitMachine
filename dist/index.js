import * as E from "fp-ts/lib/Either.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as Op from "fp-ts/lib/Option.js";
export const newErr = msg => ({ name: "Err", msg: msg });
export const newMachine = initial => states => pipe();
export const processState = match => st => sep => {
    const newSep = st.fn(sep);
    const stopBool = Op.match(() => false, (pred) => pred(newSep.right))(st.stop);
    if (stopBool) {
        const temp = {
            name: "SepNext",
            opNextState: Op.none,
            sep: newSep,
        };
        return E.right(temp);
    }
};
const processStr = mach => s => pipe();
