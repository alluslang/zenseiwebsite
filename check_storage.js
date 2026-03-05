import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uqbmjppllifwjrofpbeb.supabase.co',
    'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON'
);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error fetching buckets:', error);
    } else {
        console.log('Available buckets:', data.map(b => b.name));
    }
}

checkBuckets();
