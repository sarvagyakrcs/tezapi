import { Redis } from '@upstash/redis';
import { Hono } from 'hono'
import { env } from 'hono/adapter';
import { handle } from 'hono/vercel'

export const runtime = "edge"

const app = new Hono().basePath("/api");

type EnvConfig = {
    UPSTASH_REDIS_REST_TOKEN: string,
    UPSTASH_REDIS_REST_URL: string,
}

const start = performance.now();
//------------------------------

app.get("/search", async (c) => {
    try {
        const {
            UPSTASH_REDIS_REST_TOKEN,
            UPSTASH_REDIS_REST_URL
        } = env<EnvConfig>(c);
    
    
    
        const redis = new Redis({
            token: UPSTASH_REDIS_REST_TOKEN,
            url: UPSTASH_REDIS_REST_URL
        });
    
        const query = c.req.query("q")?.toUpperCase();
        if(!query){
            return c.json({
                message: "Invalid Search Query"
            }, {status: 400});
        }
    
        const response = []
        const rank = await redis.zrank("terms", query);
    
        if(rank !== null && rank !== undefined){
            const temp = await redis.zrange<string[]>("terms", rank, rank+100)
            for(const element of temp){
                if(!element.startsWith(query)) break;
                if(element.endsWith("*")) response.push(element.substring(0, element.length - 1))
            }
        }
        //----------------------
        const end = performance.now();
    
        return c.json({
            results: response,
            duration: end-start
        })
    } catch (error) {
        console.error(error);
        return c.json({
            results: [],
            message: "Something Went Wrong.",
        }, {status:500})
    }
})

export const GET = handle(app);
export const POST = handle(app);
export default app as never;