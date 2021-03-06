/*
  generated by https://github.com/uladkasach/sql-schema-generator @v0.18.3
*/
CREATE OR REPLACE FUNCTION upsert_photo(
  in_url varchar,
  in_description varchar
)
RETURNS bigint
LANGUAGE plpgsql
AS $$
  DECLARE
    v_static_id bigint;
    v_created_at timestamptz := now(); -- define a common created_at timestamp to use
  BEGIN
    -- find or create the static entity
    SELECT id INTO v_static_id -- try to find id of entity
    FROM photo
    WHERE 1=1
      AND (url = in_url)
      AND (description = in_description OR (description IS null AND in_description IS null));
    IF (v_static_id IS NULL) THEN -- if entity could not be already found, create the static entity
      INSERT INTO photo
        (uuid, created_at, url, description)
        VALUES
        (uuid_generate_v4(), v_created_at, in_url, in_description)
        RETURNING id INTO v_static_id;
    END IF;

    -- return the static entity id
    RETURN v_static_id;
  END;
$$
