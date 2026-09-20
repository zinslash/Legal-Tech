const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const payload = JSON.parse(event.body);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    // 1. Generate a formal Case ID
    const caseNumber = `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 2. Update the application status in the database
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'accepted' })
      .eq('id', payload.id)
      .select()
      .single();

    if (error) throw error;

    // 3. Write to the Audit Log (Golden Thread G10 compliance)
    await supabase.from('audit_logs').insert([{
      entity_type: 'application',
      entity_id: payload.id,
      action: 'APPLICATION_ACCEPTED',
      details: { assigned_case_number: caseNumber }
    }]);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: 'Success', case_number: caseNumber }) 
    };
  } catch (error) {
    console.error('DB Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server Error' }) };
  }
};