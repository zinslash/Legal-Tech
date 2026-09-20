const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const payload = JSON.parse(event.body);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    // T9 OFFLINE SYNC CHECK
    if (payload.offline_uuid) {
      const { data: existingApp } = await supabase
        .from('applications')
        .select('application_number')
        .eq('offline_uuid', payload.offline_uuid)
        .single();

      if (existingApp) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Offline sync successful', application_number: existingApp.application_number })
        };
      }
    }

    // GENERATE UNIQUE APPLICATION ID
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const appNumber = `APP-${year}-${randomNum}`;

    // INSERT INTO DATABASE
    const { data: newApp, error } = await supabase
      .from('applications')
      .insert([{
        application_number: appNumber,
        offline_uuid: payload.offline_uuid || null,
        applicant_name: payload.applicant_name,
        is_proxy: payload.is_proxy || false,
        proxy_name: payload.proxy_name || null,
        intake_source: payload.intake_source || 'web_direct',
        raw_narrative: payload.raw_narrative || '',
        safe_contact_rules: payload.safe_contact_rules || null,
        incident_group_id: payload.incident_group_id || null
      }])
      .select()
      .single();

    if (error) throw error;

    // WRITE TO AUDIT LOG
    await supabase.from('audit_logs').insert([{
      entity_type: 'application',
      entity_id: newApp.id,
      action: 'APPLICATION_SUBMITTED',
      details: { source: payload.intake_source, proxy_used: payload.is_proxy }
    }]);

    return { statusCode: 200, body: JSON.stringify({ message: 'Success', application_number: appNumber }) };

  } catch (error) {
    console.error('DB Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server Error' }) };
  }
};