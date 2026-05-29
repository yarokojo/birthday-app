const { supabase } = require('./lib/supabase');

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');
  
  const tables = ['profiles', 'posts', 'comments', 'likes', 'stories', 'friends', 'wallets'];
  let success = true;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
        success = false;
      } else {
        console.log(`✅ ${table}: Ready`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Connection error`);
      success = false;
    }
  }
  
  if (success) {
    console.log('\n🎉 All tables are ready! Your app is connected to Supabase!');
  } else {
    console.log('\n⚠️ Some tables are missing. Please run the SQL in Supabase dashboard first.');
    console.log('📋 Go to: https://supabase.com/dashboard/project/rxjpjeyzwxdcqxnvtulq/sql/new');
  }
}

checkTables();
