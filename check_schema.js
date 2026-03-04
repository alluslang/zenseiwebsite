import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uqbmjppllifwjrofpbeb.supabase.co',
    'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON'
);

async function checkSchema() {
    const tables = ['hero_content', 'products', 'about_slides', 'social_links'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        console.log(`\n--- TABLE: ${table} ---`);
        if (error) {
            console.log('Error:', error.message);
        } else if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('Table is empty but fetch succeeded.');
        }
    }
}

checkSchema();
