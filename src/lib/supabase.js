import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqbmjppllifwjrofpbeb.supabase.co';
const supabaseKey = 'sb_publishable_YQroQhfV8SyHh3tMlrrSgg_ikpk4sON';

export const supabase = createClient(supabaseUrl, supabaseKey);
