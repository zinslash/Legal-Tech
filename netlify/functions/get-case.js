const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  const caseId = event.queryStringParameters.id;
  if (!caseId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing ID' }) };

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', caseId)
      .single();

    if (error) throw error;
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    console.error('DB Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server Error' }) };
  }
};