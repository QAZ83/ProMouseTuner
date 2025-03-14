-- Create a function to execute SQL queries safely
-- This function allows executing read-only SQL queries from the client

CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check if the query is read-only (SELECT only)
  IF NOT (sql_query ~* '^\s*SELECT\s+') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;

  -- Execute the query and return the results as JSON
  EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || sql_query || ') t' INTO result;
  
  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;