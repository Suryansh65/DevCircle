"use client";

import { User } from "@supabase/supabase-js";

type EmailPasswordAuthProps = {
    user:User | null;
};
export default function EmailPasswordAuth({user}:EmailPasswordAuthProps){
    return (
        <div>
            <h1>Email password Auth</h1>
        </div>
    )
}