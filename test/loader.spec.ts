import * as assert from "assert";
import * as loader from "../src/loader"

let forwardCount = 0;
let backwardCount = 0;
let finished = false;
let chain: loader.Chain<{
    start: ()=>void,
    end: ()=>void
}>;
let asyncChain: loader.AsyncChain<{
    start: ()=>void,
    end: ()=>void
}>;

describe("Loader utils",()=>{
    describe("#loader",()=>{
        const _loader = new loader.Loader();
        it("should start",()=>{
            try {
                _loader.start()
                return true
            } catch (e) {
                return false
            }
        })

        it("should succeed",()=>{
            _loader.succeed()
            assert(!_loader.ora.isSpinning)
        })

        it("should fail",()=>{
            _loader.start()
            _loader.fail()
            assert(!_loader.ora.isSpinning)
        })
    })

    describe("#chain",()=>{
        before(()=>{
            chain = new loader.Chain<{
                start: ()=>void,
                end: ()=>void
            }>((prev,next)=>{
                if(prev){
                    prev.end()
                }
                next.start()
            },()=>{
                finished = true;
            })

            chain.list = [
                {
                    start:()=>forwardCount++,
                    end:()=>backwardCount++
                },
                {
                    start:()=>forwardCount++,
                    end:()=>backwardCount++
                },
                {
                    start:()=>forwardCount++,
                    end:()=>backwardCount++
                },
                {
                    start:()=>forwardCount++,
                    end:()=>backwardCount++
                },
            ]
        })
        it("should progress naturally",()=>{
            chain
            .next()
            .next()
            .next()
            assert.strictEqual(forwardCount,3)
            chain.next()
            assert.strictEqual(backwardCount,3)
        })

        it("should finish",()=>{
            chain.finish()
            assert(finished && backwardCount == 3 && forwardCount == 4)
        })

        it("should restart",()=>{
            chain
            .restart()
            .next()
            .next()
            .next()
            assert.strictEqual(backwardCount, 5)
            assert.strictEqual(forwardCount, 7)
        })
    })

    describe("#async-chain",()=>{
        before(()=>{
            backwardCount = 0
            forwardCount = 0
            finished = false

            asyncChain = new loader.AsyncChain<{
                start: ()=>void,
                end: ()=>void
            }>(async (prev,next)=>{
                if(prev){
                    await prev.end()
                }
                await next.start()
            },()=>{
                finished = true;
            })

            asyncChain.list = [
                {
                    start:async()=>forwardCount++,
                    end:async()=>backwardCount++
                },
                {
                    start:async()=>forwardCount++,
                    end:async()=>backwardCount++
                },
                {
                    start:async()=>forwardCount++,
                    end:async()=>backwardCount++
                },
                {
                    start:async()=>forwardCount++,
                    end:async()=>backwardCount++
                },
            ]
        })
        it("should progress naturally",async ()=>{
            await asyncChain.next()
            await asyncChain.next()
            await asyncChain.next()
            assert.strictEqual(forwardCount,3)
            await asyncChain.next()
            assert.strictEqual(backwardCount,3)
        })

        it("should finish",async ()=>{
            await asyncChain.finish()
            assert(finished && backwardCount == 3 && forwardCount == 4)
        })

        it("should restart",async ()=>{
            await asyncChain.restart()
            await asyncChain.next()
            await asyncChain.next()
            await asyncChain.next()
            assert.strictEqual(backwardCount, 5)
            assert.strictEqual(forwardCount, 7)
        })
    })
})