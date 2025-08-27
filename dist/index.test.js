// import { pipe } from 'fp-ts/lib/function.js' 
// import * as B from "fp-ts/lib/boolean.js"
// import * as Sm from "./index.js"
// import { expect } from "chai"
// import * as Op from "fp-ts/lib/Option.js"
// import * as E from "fp-ts/lib/Either.js" 
// import * as A from "fp-ts/lib/Array.js"
// import * as SE from "fp-ts/lib/Separated.js"
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
