from datetime import datetime, timedelta
import boto3

dynamodb = boto3.resource('dynamodb')
sales_call_table = dynamodb.Table('salesCallsTable')

def add_data(body):
    utc_time = datetime.utcnow()
    ist_time = utc_time + timedelta(hours=5, minutes=30)
    ist_time_str = ist_time.isoformat()

    # Add data to salesCallTable
    item = {
        'timestamp': ist_time_str,
        **body
    }
    sales_call_table.put_item(Item=item)

    # Update agent_name_calls_table
    date_str = ist_time.strftime("%Y-%m-%d")
    call_type = body.get('call_type_for_dashboard_mapping', '')
    agent_name = body.get('answered_agent_name', "Agent").lower()
    table_name = agent_name + "_calls_table"
    print(table_name)
    agent_calls_table = dynamodb.Table(table_name)

    try:
        # Try to get existing item for the date and agent
        response = agent_calls_table.get_item(
            Key={
                'date': date_str,
                'agent_name': agent_name
            }
        )
        item = response.get('Item', {
            'date': date_str,
            'agent_name': agent_name,
            'ic_answered': 0,
            'oc_answered': 0,
            'oc_missed': 0,
            'total_calls': 0
        })

        # Update call counts
        if call_type == 'ic_answered':
            item['ic_answered'] += 1
        elif call_type == 'oc_answered':
            item['oc_answered'] += 1
        elif call_type == 'oc_missed':
            item['oc_missed'] += 1

        item['total_calls'] += 1

        # Update duration for answered calls
        if call_type in ['ic_answered', 'oc_answered']:
            duration = int(body.get('duration', 0))
            item['duration'] = item.get('duration', 0) + duration

        # Put updated item back to the table
        agent_calls_table.put_item(Item=item)

    except Exception as e:
        print(f"Error updating agent_name_calls_table: {str(e)}")

    return 'Data stored successfully'