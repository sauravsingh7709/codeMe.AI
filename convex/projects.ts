import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";


// insert ,update and delete ke liye mutation function use karte hai convex db mein
export const create= mutation({
    args:{
        name:v.string(),
    },
    handler:async (ctx,args)=>{

        const identity = await verifyAuth(ctx);
        if (!identity) {
            return [];  // return empty instead of throwing
        }
        await ctx.db.insert("projects",{
            name:args.name,
            ownerId:identity?.subject,
            updatedAt:Date.now(),
        })
    }
})
export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);
        if (!identity) {
            return [];  
        }
        return await ctx.db.query("projects")
        .withIndex("by_owner",(q)=>q.eq("ownerId",identity?.subject))
        .collect();
    } 
})