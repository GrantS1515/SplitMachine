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
import { produce } from "immer"
import * as Sp from "SplitString/dist/index.js" 
import * as EqTo from "eq-to/dist/index.js"

export type Machine = {
	readonly name: "Machine",
	readonly transitions: Map<string, string[]>,
	readonly stopId: string,
}

export type Err = {
	readonly name: "Err",
	readonly msg: string,
}

const defaultErr: Err = {
	name: "Err",
	msg: "SplitMachine Error"
}

export const newErr:
	(msg: string) =>
	Err =
	msg =>
	produce(defaultErr, draft => {
		draft.msg = msg
	})

export type StateFn = 
	(s: Sp.SplitString) => 
	E.Either<Err, State>


export type State = {
	readonly name: "State",
	readonly id: string,
	readonly split: Sp.SplitString, 
}

export const stateEq:
	(v: [State, State]) =>
	E.Either<EqTo.Err, [State, State]> =
	v =>
	pipe(
		v,
		EqTo.checkField("name")(EqTo.basicEq),
		E.chain(EqTo.checkField("id")(EqTo.basicEq)),
		E.chain(EqTo.checkField("split")(Sp.splitStringEq)),
	)

// export type StateSplit = {
// 	readonly name: "StateSplit",
// 	readonly nextState: string,
// 	readonly split: Sp.SplitString,
// }

// export const stateSplitEq:
// 	(v: [StateSplit, StateSplit]) =>
// 	E.Either<EqTo.Err, [StateSplit, StateSplit]> =
// 	v =>
// 	pipe(
// 		v,
// 		EqTo.checkField("name")(EqTo.basicEq),
// 		E.chain(EqTo.checkField("nextState")(EqTo.basicEq)),
// 		E.chain(EqTo.checkField("split")(Sp.splitStringEq))
// 	)

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