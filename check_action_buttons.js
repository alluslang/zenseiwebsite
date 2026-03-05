import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uqbmjppllifwjrofpbeb.supabase.co',
    'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON'
);

async function checkButtons() {
    console.log("Fetching action_buttons...");
    const { data, error } = await supabase.from('action_buttons').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data:", data);
        console.log("Count:", data?.length);
    }
}

checkButtons();
