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

describe("machine tests", () => {
	
})

// describe("nextState", () => {
// 	it("if stop -> right none", () => {
// 		pipe(
// 			Sp.newSplitString("a")(""),
// 			Sm.nextState(letterState),
// 			E.match(
// 				() => expect.fail('fail'),
// 				() => Op.match(
// 					() => expect(true).to.equal(true),
// 					() => expect.fail('fail'),
// 				)
// 			)
// 		)
// 	})

// 	it("if valid next state -> right id", () => {
// 		pipe(
// 			Sp.newSplitString("")("a"),
// 			Sm.nextState(letterState),
// 			E.match(
// 				() => expect.fail('fail left'),
// 				() => Op.match(
// 					() => expect.fail('fail op none'),
// 					(ssp: Sm.StateSplit) => pipe(
// 						Sm.stateSplitEq([ssp, stateSplit0 ]),
// 						EqTo.toBool,
// 						(b: boolean) => expect(b).to.equal(true)
// 					)

// 				)
// 			)
// 		)
// 	})
// })


// // simple direct match state
// const shiftLeft: Sm.State = {
// 	name: "State",
// 	id: "shiftLeft",
// 	fn: sep => {
// 		const left = sep.left
// 		const right = sep.right
// 		const newLeft = right.charAt(0)
// 		const newRight: string = right.substring(1, right.length)
// 		const newSE: SE.Separated<string, string> = SE.separated(newLeft, newRight)
// 		return E.right(newSE)
// 	},
// 	transitions: [],
// 	stop: Op.some(() => true)
// }

// const mach1: Sm.Machine = Sm.newMachine(shiftLeft)([])

// describe("Test terminal", () => {
// 	it("if stop -> return none state", () => {
// 		pipe(
// 			SE.separated("", "a"),
// 			Sm.processState(mach1)(shiftLeft),
// 			E.map(sepNext => sepNext.sep),
// 			E.match(
// 				() => expect.fail("fail"),
// 				() => E.match(
// 					() => expect.fail("fail"),
// 					(sep) => expect(sep.left).to.equal("a"),
// 				),
// 				// sep => expect(sep.left).to.equal("a"),
// 			)
			
// 		)
// 	})
// })


// const startQuote: Sm.State = {
// 	name: "State",
// 	id: "startQuote",
// 	fn: sep => {
// 		const left = sep.left
// 		const right = sep.right
// 		const newLeft = right.charAt(0)
// 		const newRight: string = right.substring(1, right.length)
// 		const newSE: SE.Separated<string, string> = SE.separated(newLeft, newRight)
// 		return E.right(newSE)
// 	},
// 	transitions: [],
// 	stop: Op.some(() => true)
// }

// const letter: Sm.State = {
// 	name: "State",
// 	id: "letter",
// 	fn: sep => {
// 		const left = sep.left
// 		const right = sep.right
// 		const newLeft = right.charAt(0)
// 		const newRight: string = right.substring(1, right.length)
// 		const newSE: SE.Separated<string, string> = SE.separated(newLeft, newRight)
// 		return E.right(newSE)
// 	},
// 	transitions: [],
// 	stop: Op.some(() => true)
// }

// const endQuote: Sm.State = {
// 	name: "State",
// 	id: "endQuote",
// 	fn: sep => {
// 		const left = sep.left
// 		const right = sep.right
// 		const newLeft = right.charAt(0)
// 		const newRight: string = right.substring(1, right.length)
// 		const newSE: SE.Separated<string, string> = SE.separated(newLeft, newRight)
// 		return E.right(newSE)
// 	},
// 	transitions: [],
// 	stop: Op.some(() => true)
// }

// const mach2: Sm.Machine = Sm.newMachine
// 	(startQuote)
// 	([letter, endQuote])

// describe("", () => {
// 	it("direct match a quote", () => {

// 	})

// })