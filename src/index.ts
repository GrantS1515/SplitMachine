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
	readonly transitions: Map<string, StateFn[]>,
	readonly stopId: string,
	readonly currentState: State,
}

export const nextState:
	(mach: Machine) =>
	(initialId: string) =>
	(sps: Sp.SplitString) =>
	E.Either<Err, State> =
	mach =>
	initialId =>
	sps => {

		

		return pipe(
			// get the current sps
			// get the transitions and get the next state
			// check that stopId is not hit
			// recurse

		)
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

