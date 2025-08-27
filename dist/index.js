import * as E from "fp-ts/lib/Either.js";
import { pipe } from 'fp-ts/lib/function.js';
import * as Op from "fp-ts/lib/Option.js";
import { produce } from "immer";
import * as Sp from "SplitString/dist/index.js";
import * as EqTo from "eq-to/dist/index.js";
const defaultErr = {
    name: "Err",
    msg: "SplitMachine Error"
};
export const newErr = msg => produce(defaultErr, draft => {
    draft.msg = msg;
});
export const stateSplitEq = v => pipe(v, EqTo.checkField("name")(EqTo.basicEq), E.chain(EqTo.checkField("nextState")(EqTo.basicEq)), E.chain(EqTo.checkField("split")(Sp.splitStringEq)));
export const nextState = st => sp => {
    if (st.stop(sp)) {
        return E.right(Op.none);
    }
};
// export type SepFn = (sep: SE.Separated<string, string>) => E.Either<Err, SE.Separated<string, string> >
// export type State = {
// 	name: "State",
// 	id: string, 
// 	entry: SepFn,
// 	transitions: Map<string, P.Predicate<SE.Separated<string, string>>>,
// 	stop: Op.Option<P.Predicate<string>>,
// }
// export const newMachine:
// 	(initial: State) =>
// 	(states: State[]) =>
// 	Machine =
// 	initial =>
// 	states =>
// 	pipe(
// 	)
// export type SepNext = {
// 	readonly name: "SepNext",
// 	readonly opNextState: Op.Option<State>, 
// 	readonly sep: SE.Separated<string, string>
// }
// export const processState:
// 	(mach: Machine) =>
// 	(st: State) =>
//  	(s: SE.Separated<string, string> ) =>
//  	E.Either< Err, SepNext > =
//  	match =>
//  	st =>
//  	sep => {
//  		const newSep = st.fn(sep)
//  		const stopBool = Op.match(
//  			() => false,
//  			(pred) => pred(newSep.right)
//  		)(st.stop)
//  		if (stopBool) {
//  			const temp = {
//  				name: "SepNext",
//  				opNextState: Op.none,
//  				sep: newSep,
//  			}
//  			return E.right(temp)
//  		}
//  	}
// const processStr:
// 	(mach: Machine) =>
// 	(s: string ) =>
// 	E.Either<Err, SE.Separated<string, string> > =
// 	mach =>
// 	s => 
// 	pipe(
// 	)
