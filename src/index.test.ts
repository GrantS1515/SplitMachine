import { pipe } from 'fp-ts/lib/function.js' 
import * as B from "fp-ts/lib/boolean.js"
import * as Sm from "./index.js"
import { expect } from "chai"
import * as Op from "fp-ts/lib/Option.js"
import * as E from "fp-ts/lib/Either.js" 
import * as A from "fp-ts/lib/Array.js"
import * as SE from "fp-ts/lib/Separated.js"
import * as Sp from "SplitString/dist/index.js" 
import * as EqTo from "eq-to/dist/index.js"
import { produce } from "immer"

const sps0 = Sp.newSplitString("")("a")

const sps1 = produce(sps0, draft => {
	draft.sep = SE.separated("", "a")	
})

const sps2 = produce(sps0, draft => {
	draft.sep = SE.separated("a", "")	
})

const sps3 = produce(sps0, draft => {
	draft.sep = SE.separated("aa", "")	
})

const extLetterFn: Sm.StateFn = 
	sps =>
	pipe(
		sps,
		Sp.leadRight(1),
		E.map((s) => s.match(/^[a-z0-9]+$/i)),
		E.map(s => s !== null),
		E.chain(b => B.match(
			() => E.left(Sm.newErr("Not Letter")),
			() => Sp.shiftLeft(1)(sps),
		)(b) ),
		E.map(sp => ({ name: "State", id: "extLetter", split: sp }))
	)

const st0: Sm.State = {
	name: "State",
	id: "",
	split: Sp.newSplitString("")("")
}

const st1 = produce(st0, draft => {
	draft.split = Sp.newSplitString("a")("")
	draft.id = "extLetter"
})

const st2 = produce(st0, draft => {
	draft.split = Sp.newSplitString("a")("a")
	draft.id = "extLetter"
})

const st3 = produce(st0, draft => {
	draft.split = Sp.newSplitString("")("a")
	draft.id = "extLetter"
})

const st4 = produce(st0, draft => {
	draft.split = Sp.newSplitString("a")("")
	draft.id = "stop"
})

const st5 = produce(st0, draft => {
	draft.split = Sp.newSplitString("")("aa")
	draft.id = "extLetter"
})


describe("state fns", () => {
	it("external letter state -> right SplitString", () => {
		pipe(
			sps1,
			extLetterFn,
			E.match(
				() => expect.fail("fail"),
				(st) => pipe(
					Sm.stateEq([st, st1]),
					EqTo.toBool,
					b => expect(b).to.equal(true)
				)
			)
		)
	})
})

const mach1: Sm.Machine = {
	name: "Machine",
	transitions: new Map([
		["extLetter", [extLetterFn]],
	]),
	stopId: "stop",
}

const stopFn: Sm.StateFn = 
	sps =>
	pipe(
		sps,
		Sp.isRightEmpty,
		E.map(sp => ({ name: "State", id: "stop", split: sp }))
	)

const mach2: Sm.Machine = {
	name: "Machine",
	transitions: new Map([
		["extLetter", [extLetterFn, stopFn]],
	]),
	stopId: "stop",
}

describe("machine tests", () => {
	
	it("can transition to self letter state", () => {
		pipe(
			st3,
			Sm.nextState(mach1),
			(st) => [st, E.right(st1)],
			EqTo.checkEither(Sm.errEq, Sm.stateEq),
			EqTo.toBool,
			b => expect(b).to.equal(true),
		)
	})

	it("letter to stop state", () => {
		pipe(
			st1,
			Sm.nextState(mach2),
			(st) => [st, E.right(st4)],
			EqTo.checkEither(Sm.errEq, Sm.stateEq),
			EqTo.toBool,
			b => expect(b).to.equal(true),
		)
	})

	it("letter state and then stop", () => {
		pipe(
			st3,
			Sm.interp(mach2),
			(sps) => [sps, E.right(sps2)],
			EqTo.checkEither(Sm.errEq, Sp.splitStringEq),
			EqTo.toBool,
			b => expect(b).to.equal(true),
		)
	})

	it("letter letter stop", () => {
		pipe(
			st5,
			Sm.interp(mach2),
			(sps) => [sps, E.right(sps3)],
			EqTo.checkEither(Sm.errEq, Sp.splitStringEq),
			EqTo.toBool,
			b => expect(b).to.equal(true),
		)
	})

})
