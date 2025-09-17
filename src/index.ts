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
import { newErr, Err } from "fptsutils/dist/error.js"

export type State = {
	readonly name: "State",
	readonly id: string,
	readonly split: Sp.SplitString, 
}

export const newState:
    (id: string) =>
    (sp: Sp.SplitString) =>
    State =
    id =>
    sp =>
    ({ name: "State", id: id, split: sp })

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

export type Machine = {
	readonly name: "Machine",
	readonly transitions: Map<string, StateFn[]>,
	readonly stopId: string,
}

export type StateFn = 
	(s: Sp.SplitString) => 
	E.Either<Err, State>

export const newMachineWDefStop:
    (transitions: Map<string, StateFn[]>) =>
    Machine =
    transitions => {
        const defStop: StateFn =
            sps =>
            pipe(
                ({
                    name: "State",
                    id: "stop",
                    split: sps, 
                }),
                (s: State) => s,
                E.right,
            ) 

        const appendDefStopFn:
            (stateFns: StateFn[]) =>
            StateFn[] =
            stateFns =>
            pipe(
                stateFns,
                A.concat([defStop])
            )

        return pipe(
            transitions,
            Ma.map(appendDefStopFn),
            t => ({
                name: "Machine",
                transitions: t,
                stopId: "stop" 
            }),
            (m: Machine) => m
        ) 
    }
    

export const _nextState:
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
				M.concatAll(Utils.leftMostEither(newErr(`No valid state given id ${st.id} ${st.split.sep.left}`)))
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
						_nextState(mach),
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


export const newStateShiftFn:
    (id: string) =>
    (pred: P.Predicate<string>) =>
	(sps: Sp.SplitString) =>
    E.Either<Err, State> =
    id =>
    pred =>
    sps => {
        const fnArgs = produce(defaultGenFnArgs, draft => {
           draft.strLen = 1
           draft.testFn = pred
           draft.splitFn = Sp.shiftLeft(1)
        }) 
        return pipe(
            sps,
            newStateGenFn(id)(fnArgs)
        )
    }

export type GenFnArgs = {
    name: "GenFnArgs",
    strLen: number,
	testFn: P.Predicate<string>,
    splitFn: (sps: Sp.SplitString) => E.Either<Err, Sp.SplitString>,
}

const defaultGenFnArgs: GenFnArgs = {
    name: "GenFnArgs",
    strLen: 1,
    testFn: () => false,
    splitFn: (sp) => E.right(sp),
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
    
// stop when right is empty
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



