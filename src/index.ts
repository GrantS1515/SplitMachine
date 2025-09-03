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
import * as Ma from "fp-ts/lib/Map.js"
import { Eq as strEq } from "fp-ts/lib/string.js"
import * as Utils from "fptsutils/dist/monoids.js"

export type Machine = {
	readonly name: "Machine",
	readonly transitions: Map<string, StateFn[]>,
	readonly stopId: string,
}

export const nextState:
	(mach: Machine) =>
	(state: State) =>
	E.Either<Err, State> =
	mach =>
	st => {
		return pipe(			
			mach.transitions.get(st.id),
			(v) => 
				v === undefined ? 
				E.left(newErr(`Undefined Transition to id ${st.id}`)) : 
				E.right(v),
			E.map(
				A.map((fn: StateFn) => 
					fn(st.split)
				)
			),
			E.chain(
				M.concatAll(Utils.leftMostEither(newErr(`No valid state given id ${st.id}`)))
			),
		)
	}

export const interp:
	(mach: Machine) =>
	(st: State) =>
	E.Either<Err, Sp.SplitString> =
	mach =>
	st => {

		const _interp:
			(mach: Machine) =>
			(st: State) =>
			E.Either<Err, State> =
			mach =>
			st => {
				if (st.id === mach.stopId) {
					return E.right(st)
				} else {
					return pipe(
						st,
						nextState(mach),
						E.chain(_interp(mach))
					)
				}
			}

		return pipe(
			st,
			_interp(mach),
			E.map(s => s.split)
		)
	}

export type Err = {
	readonly name: "Err",
	readonly msg: string,
}

export const errEq:
	(e: [Err, Err]) =>
	E.Either<EqTo.Err, [Err, Err]> =
	e =>
	pipe(
		e,
		EqTo.checkField("name")(EqTo.basicEq),
		E.chain(EqTo.checkField("msg")(EqTo.basicEq)),
	)

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

export type ShiftFnArgs = {
    name: "ShiftFnArgs",
    strLen: number,
	testFn: P.Predicate<string>,
}

export const newStateShiftFn:
    (id: string) =>
    (args: ShiftFnArgs) =>
	(sps: Sp.SplitString) =>
    E.Either<Err, State> =
    id =>
    args =>
    sps =>
    pipe(
		sps,
		Sp.leadRight(args.strLen),
		E.map(args.testFn),
		E.chain(b => B.match(
			() => E.left(newErr(`Input not recognized by testFn`)),
			() => Sp.shiftLeft(args.strLen)(sps),
		)(b) ),
		E.map(sp => ({ name: "State", id: id, split: sp }))
    )


export type GenFnArgs = {
    name: "GenFnArgs",
    strLen: number,
	testFn: P.Predicate<string>,
    splitFn: (sps: Sp.SplitString) => E.Either<Err, Sp.SplitString>,
}

export const newStateGenFn:
    (id: string) =>
    (args: GenFnArgs) =>
	(sps: Sp.SplitString) =>
    E.Either<Err, State> =
    id =>
    args =>
    sps =>
    pipe(
		sps,
		Sp.leadRight(args.strLen),
		E.map(args.testFn),
		E.chain(b => B.match(
			() => E.left(newErr(`Input not recognized by testFn`)),
			() => args.splitFn(sps),
		)(b) ),
		E.map(sp => ({ name: "State", id: id, split: sp }))
    )

export const newStopFn:
    (id: string) =>
    (sps: Sp.SplitString) =>
    E.Either<Err, State> =
    id =>
    sps =>
    pipe(
		sps,
		Sp.isRightEmpty,
		E.map(sp => ({ name: "State", id: id, split: sp }))
    )


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

