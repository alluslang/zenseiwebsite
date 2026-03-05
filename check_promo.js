import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uqbmjppllifwjrofpbeb.supabase.co',
    'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON'
);

async function checkPromo() {
    console.log("Fetching promo_content...");
    const { data, error } = await supabase.from('promo_content').select('*').limit(1);
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data:", data);
        if (data && data.length > 0) {
            console.log("Columns:", Object.keys(data[0]));
        }
    }
}

checkPromo();
