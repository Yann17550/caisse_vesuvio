select column_name, data_type
from information_schema.columns
where table_name = 'daily_closings'
order by ordinal_position;
