import * as E from "fp-ts/lib/Either.js" 
import * as B from "fp-ts/lib/boolean.js"
import { pipe } from 'fp-ts/lib/function.js' 
import * as A from "fp-ts/lib/Array.js"
import * as Eq from "fp-ts/lib/Eq.js"
import * as St from "fp-ts/lib/Set.js"
import * as Op from "fp-ts/lib/Option.js"
import * as M from "fp-ts/lib/Monoid.js"
import * as SE from "fp-ts/lib/Separated.js"
import * as P from "fp-ts/lib/Predicate.js"

export type Machine = {
	readonly name: "Machine",
}

export type Err = {
	readonly name: "Err",
	readonly msg: string,
}

export const newErr:
	(msg: string) =>
	Err =
	msg =>
	({ name: "Err", msg: msg })

export type SepFn = (sep: SE.Separated<string, string>) => E.Either<Err, SE.Separated<string, string> >

export type State = {
	name: "State",
	id: string, 
	entry: SepFn,
	transitions: Map<string, P.Predicate<SE.Separated<string, string>>>,
	stop: Op.Option<P.Predicate<string>>,
}

export const newMachine:
	(initial: State) =>
	(states: State[]) =>
	Machine =
	initial =>
	states =>
	pipe(

	)

export type SepNext = {
	readonly name: "SepNext",
	readonly opNextState: Op.Option<State>, 
	readonly sep: SE.Separated<string, string>
}

export const processState:
	(mach: Machine) =>
	(st: State) =>
 	(s: SE.Separated<string, string> ) =>
 	E.Either< Err, SepNext > =
 	match =>
 	st =>
 	sep => {
 		const newSep = st.fn(sep)

 		const stopBool = Op.match(
 			() => false,
 			(pred) => pred(newSep.right)
 		)(st.stop)

 		if (stopBool) {
 			const temp = {
 				name: "SepNext",
 				opNextState: Op.none,
 				sep: newSep,
 			}
 			return E.right(temp)
 		}

 	}
 	

const processStr:
	(mach: Machine) =>
	(s: string ) =>
	E.Either<Err, SE.Separated<string, string> > =
	mach =>
	s => 
	pipe(
	)