import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://uqbmjppllifwjrofpbeb.supabase.co',
    'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON'
);

async function checkImages() {
    const { data } = await supabase.from('hero_content').select('image_url').limit(1);
    console.log('Hero Image URL:', data);
}

checkImages();
