// import { pipe } from 'fp-ts/lib/function.js' 
// import * as B from "fp-ts/lib/boolean.js"
// import * as Sm from "./index.js"
// import { expect } from "chai"
// import * as Op from "fp-ts/lib/Option.js"
// import * as E from "fp-ts/lib/Either.js" 
// import * as A from "fp-ts/lib/Array.js"
// import * as I from "fp-ts/lib/Identity.js"
// import * as SE from "fp-ts/lib/Separated.js"
// import { Map } from "Immutable"
// const startQuote: Sm.State = {
// 	name: "State",
// 	id: "startQuote",
// 	entry: sep => pipe(
// 		I.Do,
// 		I.let("firstChar", () => pipe(
// 			sep.right,
// 			s => s.charAt(0),
// 		)),
// 		I.let("newSep", ({ firstChar }) => pipe(
// 			firstChar,
// 			(s) => s === "\"",
// 			B.match(
// 				() => E.left(Sm.newErr("StartQuoteFailure")),
// 				() => pipe(
// 					SE.separated(
// 						sep.left + firstChar, 
// 						sep.right.substring(1, sep.right.length)),
// 					(s: SE.Separated<string, string>) => s,
// 					E.right,
// 				)
// 			),
// 			(e: E.Either<Sm.Err, SE.Separated<string, string>>) => e,
// 		)),
// 		I.map(({ newSep }) => newSep ),
// 	),
// 	transitions: Map({
// 		letter: (sep: SE.Separated<string, string>) => pipe(
// 			sep.right,
// 			s => s.charAt(0),
// 			s => s.match(/[a-z]/i),
// 			s => s !== null,
// 		) 
// 	}),
// 	stop: Op.none,
// }
// describe("Basic String", () => {
// 	// it("hello -> same", () => {
// 	// 	const myString = "\"hello\""
// 	// 	pipe(
// 	// 		myString,
// 	// 		Sm.processStr(mach1),
// 	// 		E.match(
// 	// 			() => expect.fail("fail"),
// 	// 			(sep) => {
// 	// 				expect(sep.left).to.equal(myString)
// 	// 				expect(sep.right).to.equal("")
// 	// 			}
// 	// 		),
// 	// 	)		
// 	// })
// })
