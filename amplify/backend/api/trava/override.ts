import { AmplifyApiGraphQlResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper'

export function override(resources: AmplifyApiGraphQlResourceStackTemplate) {
  resources.opensearch.OpenSearchStreamingLambdaFunction.handler = 'index.lambda_handler'
  resources.opensearch.OpenSearchStreamingLambdaFunction.runtime = 'python3.9'
  resources.opensearch.OpenSearchStreamingLambdaFunction.timeout = 600 // Set the timeout value in seconds

  resources.opensearch.OpenSearchStreamingLambdaFunction.code = {
    zipFile: `
import base64
import json
import logging
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import time
import traceback
from urllib.parse import urlparse, quote
import boto3

from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.credentials import get_credentials
from botocore.endpoint import BotocoreHTTPSession
from botocore.session import Session
from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal

# We have access to the opensearch endpoint, but we need the env name and table suffix, which we cannot provide as env vars
# since adding env to override fn isn't yet supported for the API category: https://github.com/aws-amplify/amplify-cli/issues/9063#issuecomment-1490911445
# We can use the following mapping to find the env name and table suffix
ENV_MAPPING = [
    {
        "open_search_string_identifier": "a7yen7mvpzwi",
        "env_name": "dima",
        "env_table_suffix": "tn4gpx6wknd2tg675cunakk32a-dima",
    },
    {
        "open_search_string_identifier": "11h9u17btfvbr",
        "env_name": "nick",
        "env_table_suffix": "rwiizapb7bcxxg3b3dksxdi3ta-nick",
    },
    {
        "open_search_string_identifier": "fl64eqa4wayp",
        "env_name": "dev",
        "env_table_suffix": "eau3ishqorgfrgmifn5g3qdqvu-dev",
    },
    {
        "open_search_string_identifier": "c4medx2kndk",
        "env_name": "rn",
        "env_table_suffix": "t4t7w4rz2zci7afkrwgx3xg56u-rn",
    },
    {
        "open_search_string_identifier": "1t6vcejlch7tv",
        "env_name": "neal",
        "env_table_suffix": "yuddm7elirat7dwycysqp7ppwm-neal",
    },
    {
        "open_search_string_identifier": "51av0y91w8p4",
        "env_name": "anay",
        "env_table_suffix": "tsgpy7vfhfgkpgznf5ne4lzs44-anay",
    },
    {
        "open_search_string_identifier": "cdttgakbf2s6",
        "env_name": "staging",
        "env_table_suffix": "gvlbegr2ofdgjh4fr5h673lo2u-staging",
    },
    {
        "open_search_string_identifier": "ff8sb6wl2tlk",
        "env_name": "prod",
        "env_table_suffix": "uo6dsm4sofbmrewbjz46tpwwma-prod",
    },
]

# Update the function to find the environment name and table suffix using the above mapping
def get_env_name_and_table_suffix():
    opensearch_endpoint = os.environ['OPENSEARCH_ENDPOINT']

    for mapping in ENV_MAPPING:
        if mapping["open_search_string_identifier"] in opensearch_endpoint:
            env_name = mapping["env_name"]
            env_table_suffix = mapping["env_table_suffix"]
            return env_name, env_table_suffix

    raise ValueError(f'No environment name and table suffix found for OpenSearch endpoint: {opensearch_endpoint}')

# Replace the following two lines in your code with the new function call
ENV, ENV_TABLE_SUFFIX = get_env_name_and_table_suffix()


def remap_cost(type_attraction, cost):
    if type_attraction == 'DO':
        if cost == 'FREE':
            return 'Free'
        elif cost == 'UNDER_TWENTY_FIVE':
            return 'Cheap'
        elif cost == 'TWENTY_FIVE_TO_FIFTY':
            return 'Moderately priced'
        elif cost == 'FIFTY_TO_SEVENTY_FIVE':
            return 'Expensive'
        elif cost == 'OVER_SEVENTY_FIVE':
            return 'Very expensive'
        else:
            return ''
    elif type_attraction == 'EAT':
        if cost == 'UNDER_TEN':
            return 'Cheap'
        elif cost == 'TEN_TO_THIRTY':
            return 'Moderately priced'
        elif cost == 'THIRTY_TO_SIXTY':
            return 'Expensive'
        elif cost == 'OVER_SIXTY':
            return 'Very expensive'
        else:
            return ''
    return ''
    
    
def get_reservation_description(reservation):
    if reservation == 'REQUIRED':
        return 'Reservation required'
    elif reservation == 'RECOMMENDED':
        return 'Reservation recommended'
    elif reservation == 'OPTIONAL':
        return 'Reservation optional'
    elif reservation == 'NOT_TAKEN':
        return 'Reservation not taken'
    else:
        return ''
    
    
def get_target_group_description(target_group):
    if target_group == 'RAINY':
        return 'rainy days'
    elif target_group == 'COUPLE':
        return 'couples'
    elif target_group == 'LARGE_GROUP':
        return 'large groups'
    elif target_group == 'KID':
        return 'kids'
    elif target_group == 'PET':
        return 'pet-friendly'
    elif target_group == 'BACHELOR':
        return 'bachelor parties'
    elif target_group == 'OUTDOOR':
        return 'outdoor enthusiasts'
    elif target_group == 'VEGETARIAN':
        return 'vegetarians'
    else:
        return ''
    
    
def get_best_visit_time_description(visit_time, index):
    if visit_time == 'AFTERNOON':
        return f"{index + 1}. afternoon"
    elif visit_time == 'BREAKFAST':
        return f"{index + 1}. breakfast time"
    elif visit_time == 'DINNER':
        return f"{index + 1}. dinner time"
    elif visit_time == 'EVENING':
        return f"{index + 1}. evening"
    elif visit_time == 'LUNCH':
        return f"{index + 1}. lunch time"
    elif visit_time == 'MORNING':
        return f"{index + 1}. morning"
    elif visit_time == 'NON_APPLICABLE':
        return ''
    elif visit_time == 'SNACK':
        return f"{index + 1}. snack time"
    else:
        return ''
    
    
def get_attraction_category_description(category):
    if category == 'ACTION_AND_ADVENTURE':
        return 'action and adventure'
    elif category == 'ARTS_AND_CULTURE':
        return 'arts and culture'
    elif category == 'ENTERTAINMENT':
        return 'entertainment'
    elif category == 'LEISURE':
        return 'leisure'
    elif category == 'NATURE':
        return 'nature'
    elif category == 'NIGHTLIFE_AND_DRINKING':
        return 'nightlife and drinking'
    elif category == 'SHOPPING':
        return 'shopping'
    elif category == 'SIGHTS_AND_LANDMARKS':
        return 'sights and landmarks'
    else:
        return ''
    
    
def get_attraction_cuisine_description(cuisine_type):
    switcher = {
        "AFRICAN": "African cuisine",
        "AMERICAN_NEW": "New American cuisine",
        "AMERICAN_TRADITIONAL": "Traditional American cuisine",
        "BAKERY": "Bakery",
        "BARBEQUE": "Barbecue",
        "BREAKFAST": "Breakfast",
        "BRUNCH": "Brunch",
        "BURGERS": "Burgers",
        "CAJUN_CREOLE": "Cajun & Creole cuisine",
        "CARIBBEAN": "Caribbean cuisine",
        "CHINESE": "Chinese cuisine",
        "COFFEE_AND_TEA": "Coffee and tea",
        "CUBAN": "Cuban cuisine",
        "EUROPEAN": "European cuisine",
        "FARMERS_MARKET": "Farmers market",
        "FAST_FOOD": "Fast food",
        "FINE_DINING": "Fine dining",
        "FOOD_HALL": "Food hall",
        "FRENCH": "French cuisine",
        "FUSION": "Fusion cuisine",
        "GERMAN": "German cuisine",
        "GREEK": "Greek cuisine",
        "HAWAIIAN": "Hawaiian cuisine",
        "ICE_CREAM_AND_DESSERTS": "Ice cream and desserts",
        "INDIAN": "Indian cuisine",
        "ITALIAN": "Italian cuisine",
        "JAPANESE": "Japanese cuisine",
        "KOREAN": "Korean cuisine",
        "LATIN_AMERICAN": "Latin American cuisine",
        "MEDITERRANEAN": "Mediterranean cuisine",
        "MEXICAN": "Mexican cuisine",
        "MIDDLE_EASTERN": "Middle Eastern cuisine",
        "MODERN": "Modern cuisine",
        "OTHER": "Other cuisine",
        "PERUVIAN": "Peruvian cuisine",
        "PIZZA": "Pizza",
        "PUB": "Pub food",
        "SANDWICHES": "Sandwiches",
        "SEAFOOD": "Seafood",
        "SOUL": "Soul food",
        "SOUTHERN": "Southern cuisine",
        "SOUTHWESTERN": "Southwestern cuisine",
        "STEAKHOUSE": "Steakhouse",
        "SUSHI": "Sushi",
        "SPANISH": "Spanish cuisine",
        "TAPAS_AND_SMALL_PLATES": "Tapas and small plates",
        "TEX": "Tex-Mex cuisine",
        "THAI": "Thai cuisine",
        "VEGAN": "Vegan cuisine",
        "VEGETARIAN": "Vegetarian cuisine",
        "VIETNAMESE": "Vietnamese cuisine"
    }
    return switcher.get(cuisine_type, "")

def get_recommendation_badge_description(badge):
    switcher = {
        "MICHELIN_BIB_GOURMAND": "Michelin Bib Gourmand",
        "MICHELIN_ONE_STAR": "Michelin One Star",
        "MICHELIN_TWO_STAR": "Michelin Two Star",
        "MICHELIN_THREE_STAR": "Michelin Three Star",
        "TIMEOUT": "Timeout",
        "EATER": "Eater",
        "INFATUATION": "Infatuation",
        "THRILLIST": "Thrillist",
        "CONDE_NAST": "Conde Nast",
        "TRIP_ADVISOR": "Trip Advisor",
        "TRAVAS_CHOICE": "Trava's Choice"
    }
    return switcher.get(badge, "")

def get_state_full_name(state_abbreviation):
    states = {
        'AL': 'Alabama',
        'AK': 'Alaska',
        'AZ': 'Arizona',
        'AR': 'Arkansas',
        'CA': 'California',
        'CO': 'Colorado',
        'CT': 'Connecticut',
        'DE': 'Delaware',
        'FL': 'Florida',
        'GA': 'Georgia',
        'HI': 'Hawaii',
        'ID': 'Idaho',
        'IL': 'Illinois',
        'IN': 'Indiana',
        'IA': 'Iowa',
        'KS': 'Kansas',
        'KY': 'Kentucky',
        'LA': 'Louisiana',
        'ME': 'Maine',
        'MD': 'Maryland',
        'MA': 'Massachusetts',
        'MI': 'Michigan',
        'MN': 'Minnesota',
        'MS': 'Mississippi',
        'MO': 'Missouri',
        'MT': 'Montana',
        'NE': 'Nebraska',
        'NV': 'Nevada',
        'NH': 'New Hampshire',
        'NJ': 'New Jersey',
        'NM': 'New Mexico',
        'NY': 'New York',
        'NC': 'North Carolina',
        'ND': 'North Dakota',
        'OH': 'Ohio',
        'OK': 'Oklahoma',
        'OR': 'Oregon',
        'PA': 'Pennsylvania',
        'RI': 'Rhode Island',
        'SC': 'South Carolina',
        'SD': 'South Dakota',
        'TN': 'Tennessee',
        'TX': 'Texas',
        'UT': 'Utah',
        'VT': 'Vermont',
        'VA': 'Virginia',
        'WA': 'Washington',
        'WV': 'West Virginia',
        'WI': 'Wisconsin',
        'WY': 'Wyoming'
    }
    
    return states.get(state_abbreviation, state_abbreviation)

def get_openai_api_key():
    ssm = boto3.client('ssm', region_name='us-east-1')
    parameter_name = f'/amplify/d3nzalola22yka/{ENV}/AMPLIFY_main_OPENAI_API_KEY'
    response = ssm.get_parameter(Name=parameter_name, WithDecryption=True)
    return response['Parameter']['Value']

def safe_access(d, *keys):
    """Safely access nested dictionary keys and list indices."""
    for key in keys:
        if isinstance(d, dict):
            d = d.get(key)
        elif isinstance(d, list) and isinstance(key, int) and 0 <= key < len(d):
            d = d[key]
        else:
            return None
    return d

def create_openai_embedding(attraction_data):
    api_key = get_openai_api_key()

    name = attraction_data.get('name', '')
    type = attraction_data.get('type', '')
    cost = attraction_data.get('cost', '')
    reservation = attraction_data.get('reservation', '')
    description_short = attraction_data.get('descriptionShort', '')
    description_long = attraction_data.get('descriptionLong', '')
    attraction_categories = attraction_data.get('attractionCategories', [])
    best_visited = attraction_data.get('bestVisited', [])
    attraction_target_groups = attraction_data.get('attractionTargetGroups', [])
    attraction_cuisine = attraction_data.get('attractionCuisine', [])
    locations = attraction_data.get('locations', [])
    recommendation_badges = attraction_data.get('recommendationBadges', [])

    # get first location's startLoc's googlePlace's data
    googlePlaceData = safe_access(locations, 0, 'startLoc', 'googlePlace', 'data')

    city = f"City: {googlePlaceData['city']} | " if googlePlaceData and googlePlaceData.get('city') else ''
    state = f"State: {get_state_full_name(googlePlaceData['state'])} | " if googlePlaceData and googlePlaceData.get('state') else ''
    country = f"Country: {googlePlaceData['country']} | " if googlePlaceData and googlePlaceData.get('country') else ''

    description_short_transformed = f"{description_short} | " if description_short else ''
    description_long_transformed = f"{description_long} | " if description_long else ''

    type_transformed = 'Activity' if type == 'DO' else 'Restaurant'
    best_visited_transformed = f"Best visited: {', '.join([get_best_visit_time_description(visit_time, index) for index, visit_time in enumerate(best_visited)])} | " if best_visited else ''
    reservation_transformed = f"Reservation: {get_reservation_description(reservation)} | " if reservation else ''
    target_groups_transformed = f"Great for: {', '.join([get_target_group_description(group) for group in attraction_target_groups])} | " if attraction_target_groups else ''

    cost_transformed = f"Cost: {remap_cost(type, cost)} | " if cost else ''

    categories = f"Categories: {', '.join([get_attraction_category_description(category) for category in attraction_categories])} | " if attraction_categories else ''
    cuisines = f"Cuisines: {', '.join([get_attraction_cuisine_description(cuisine) for cuisine in attraction_cuisine])} | " if attraction_cuisine else ''

    recommendation_badges_transformed = f"Featured on: {', '.join([get_recommendation_badge_description(badge) for badge in recommendation_badges])} | " if recommendation_badges else ''

    attraction_input = f"{name} | {description_short_transformed}{description_long_transformed}{type_transformed} | {best_visited_transformed} {cost_transformed}{reservation_transformed}{target_groups_transformed}{categories}{cuisines}{recommendation_badges_transformed}{city}{state}{country}".rstrip(' | ')

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    data = {
        "input": attraction_input,
        "model": "text-embedding-3-large"
    }
    
    req = Request(
        "https://api.openai.com/v1/embeddings",
        headers=headers,
        data=json.dumps(data).encode('utf-8'),
        method='POST'
    )

    try:
        with urlopen(req) as response:
            response_json = json.load(response)
            embedding = response_json["data"][0]["embedding"]
            return embedding
    except HTTPError as error:
        print(f"[createEmbeddings error] Error: {error.code}, {error.read().decode()}")
        raise ValueError("Error creating embedding")
    except Exception as error:
        print("[createEmbeddings error]", error)
        raise ValueError("Error creating embedding")

def get_author_details(authorId):
    dynamodb = boto3.resource('dynamodb')
    user_table_name = f"User-{ENV_TABLE_SUFFIX}"
    user_table = dynamodb.Table(user_table_name)
    response = user_table.get_item(Key={'id': authorId})

    if 'Item' in response:
        name = response['Item'].get('name', 'Unknown Author')
        username = response['Item'].get('username', 'Unknown Username')
        avatar = response['Item'].get('avatar', None)

        if avatar:
            bucket = avatar.get('bucket')
            key = avatar.get('key')
            region = avatar.get('region')
            avatar_data = {"bucket": bucket, "key": key, "region": region}
        else:
            avatar_data = None

        return {"id": authorId, "name": name, "username": username, "avatar": avatar_data}
    else:
        return {"id": None, "name": None, "username": None, "avatar": None}

def get_destination_details(destinationId):
    dynamodb = boto3.resource('dynamodb')
    destination_table_name = f"Destination-{ENV_TABLE_SUFFIX}"
    destination_table = dynamodb.Table(destination_table_name)
    response = destination_table.get_item(Key={'id': destinationId})

    if 'Item' in response:
        name = response['Item'].get('name', 'Unknown Destination')
        return {"id": destinationId, "name": name}
    else:
        return {"id": None, "name": None}

def get_google_place_details_from_location(location):
    dynamodb = boto3.resource('dynamodb')
    googlePlaceId = location.get('googlePlaceId')

    googlePlace_table_name = f"GooglePlace-{ENV_TABLE_SUFFIX}"
    googlePlace_table = dynamodb.Table(googlePlace_table_name)
    response = googlePlace_table.get_item(Key={'id': googlePlaceId})
    
    if 'Item' in response:
        data = response['Item'].get('data')
        # get name, city, state, country, coords, formattedAddress, businessStatus, rating, isValid (fields used + required fields for GooglePlace)
        name = data.get('name')
        city = data.get('city')
        state = data.get('state')
        country = data.get('country')
        coords = data.get('coords')
        formattedAddress = data.get('formattedAddress')
        businessStatus = data.get('businessStatus')
        rating = data.get('rating')
        isValid = data.get('isValid')
        return {"name": name, "city": city, "state": state, "country": country, "coords": coords, "formattedAddress": formattedAddress,"businessStatus": businessStatus, "rating": rating, "isValid": isValid}
            

def transform_coords(location):
    longitude = location["googlePlace"]["data"]["coords"]["long"]
    latitude = location["googlePlace"]["data"]["coords"]["lat"]

    # Ensure the coordinates are numeric (float) values
    if not isinstance(longitude, (int, float)):
        longitude = float(longitude)
    if not isinstance(latitude, (int, float)):
        latitude = float(latitude)

    return [longitude, latitude]


def transform_destination_coords(coords):
    longitude = coords["long"]
    latitude = coords["lat"]

    # Ensure the coordinates are numeric (float) values
    if not isinstance(longitude, (int, float)):
        longitude = float(longitude)
    if not isinstance(latitude, (int, float)):
        latitude = float(latitude)

    return [longitude, latitude]

# The following parameters are required to configure the OpenSearch cluster
OPENSEARCH_ENDPOINT = os.environ['OPENSEARCH_ENDPOINT']
OPENSEARCH_REGION = os.environ['OPENSEARCH_REGION']
DEBUG = True if os.environ['DEBUG'] == "1" else False
OPENSEARCH_USE_EXTERNAL_VERSIONING = True if os.environ['OPENSEARCH_USE_EXTERNAL_VERSIONING'] == "true" else False

# Multiple mapping types in an index is deprecated in OpenSearch ver 7.10+. Default to _doc.
DOC_TYPE = '_doc'
OPENSEARCH_MAX_RETRIES = 3 # Max number of retries for exponential backoff

logger = logging.getLogger()
logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)
logger.info("Streaming to OpenSearch")

# Extend the DDBTypesEncoder to handle both sets and Decimals.
class DDBTypesEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, Decimal):
            return float(obj)  # Convert Decimal to float for JSON serialization
        return json.JSONEncoder.default(self, obj)

# Subclass of boto's TypeDeserializer for DynamoDB to adjust for DynamoDB Stream format.
class StreamTypeDeserializer(TypeDeserializer):
    def _deserialize_n(self, value):
        val = float(value)
        if (val.is_integer()):
            return int(value)
        else:
            return val

    def _deserialize_b(self, value):
        return value  # Already in Base64


class Searchable_Exception(Exception):
    '''Capture status_code from request'''
    status_code = 0
    payload = ''

    def __init__(self, status_code, payload):
        self.status_code = status_code
        self.payload = payload
        Exception.__init__(
            self, 'Searchable_Exception: status_code={}, payload={}'.format(status_code, payload))


# Low-level POST data to Amazon OpenSearch Service generating a Sigv4 signed request
def post_data_to_opensearch(payload, region, creds, host, path, method='POST', proto='https://'):
    '''Post data to OpenSearch endpoint with SigV4 signed http headers'''
    req = AWSRequest(method=method, url=proto + host +
                    quote(path), data=payload, headers={'Host': host, 'Content-Type': 'application/json'})
    # SigV4Auth may be expecting 'es' but need to swap with 'os' or 'OpenSearch'
    SigV4Auth(creds, 'es', region).add_auth(req)
    http_session = BotocoreHTTPSession()
    res = http_session.send(req.prepare())
    if res.status_code >= 200 and res.status_code <= 299:
        return res._content
    else:
        raise Searchable_Exception(res.status_code, res._content)


# High-level POST data to Amazon OpenSearch Service with exponential backoff
# according to suggested algorithm: http://docs.aws.amazon.com/general/latest/gr/api-retries.html
def post_to_opensearch(payload):
    '''Post data to OpenSearch cluster with exponential backoff'''

    # Get aws_region and credentials to post signed URL to OpenSearch
    opensearch_region = OPENSEARCH_REGION or os.environ['AWS_REGION']
    session = Session({'region': opensearch_region})
    creds = get_credentials(session)
    opensearch_url = urlparse(OPENSEARCH_ENDPOINT)
    # Extract the domain name in OPENSEARCH_ENDPOINT
    opensearch_endpoint = opensearch_url.netloc or opensearch_url.path

    # Post data with exponential backoff
    retries = 0
    while retries < OPENSEARCH_MAX_RETRIES:
        if retries > 0:
            seconds = (2 ** retries) * .1
            logger.debug('Waiting for %.1f seconds', seconds)
            time.sleep(seconds)

        try:
            opensearch_ret_str = post_data_to_opensearch(
                payload, opensearch_region, creds, opensearch_endpoint, '/_bulk')
            logger.debug('Return from OpenSearch: %s', opensearch_ret_str)
            opensearch_ret = json.loads(opensearch_ret_str)

            if opensearch_ret['errors']:
                logger.error(
                    'OpenSearch post unsuccessful, errors present, took=%sms', opensearch_ret['took'])
                # Filter errors
                opensearch_errors = [item for item in opensearch_ret['items']
                            if item.get('index', {}).get('error')]
                logger.error('List of items with errors: %s',
                            json.dumps(opensearch_errors))
            else:
                logger.info('OpenSearch post successful, took=%sms', opensearch_ret['took'])
            break  # Sending to OpenSearch was ok, break retry loop
        except Searchable_Exception as e:
            if (e.status_code >= 500) and (e.status_code <= 599):
                retries += 1  # Candidate for retry
            else:
                raise  # Stop retrying, re-raise exception


# Extracts the DynamoDB table from an ARN
# ex: arn:aws:dynamodb:eu-west-1:123456789012:table/table-name/stream/2015-11-13T09:23:17.104 should return 'table-name'
def get_table_name_from_arn(arn):
    return arn.split(':')[5].split('/')[1]


# Compute a compound doc index from the key(s) of the object in lexicographic order: "k1=key_val1|k2=key_val2"
def compute_doc_index(keys_raw, deserializer, formatIndex=False):
    index = []
    for key in sorted(keys_raw):
        if formatIndex:
            index.append('{}={}'.format(
                key, deserializer.deserialize(keys_raw[key])))
        else:
            index.append(deserializer.deserialize(keys_raw[key]))
    return '|'.join(map(str,index))

def _lambda_handler(event, context):
    logger.debug('Event: %s', event)
    records = event['Records']

    ddb_deserializer = StreamTypeDeserializer()
    opensearch_actions = []  # Items to be added/updated/removed from OpenSearch - for bulk API
    cnt_insert = cnt_modify = cnt_remove = 0

    for record in records:
        # Handle both native DynamoDB Streams or Streams data from Kinesis (for manual replay)
        logger.debug('Record: %s', record)
        if record.get('eventSource') == 'aws:dynamodb':
            ddb = record['dynamodb']
            ddb_table_name = get_table_name_from_arn(record['eventSourceARN'])
            doc_seq = ddb['SequenceNumber']
        elif record.get('eventSource') == 'aws:kinesis':
            ddb = json.loads(base64.b64decode(record['kinesis']['data']))
            ddb_table_name = ddb['SourceTable']
            doc_seq = record['kinesis']['sequenceNumber']
        else:
            logger.error('Ignoring non-DynamoDB event sources: %s',
                        record.get('eventSource'))
            continue

        # Compute DynamoDB table, type and index for item
        doc_table = ddb_table_name.lower()
        doc_type = DOC_TYPE
        doc_table_parts = doc_table.split('-')
        doc_opensearch_index_name = doc_table_parts[0] if len(doc_table_parts) > 0  else doc_table

        # Dispatch according to event TYPE
        event_name = record['eventName'].upper()  # INSERT, MODIFY, REMOVE
        logger.debug('doc_table=%s, event_name=%s, seq=%s',
                    doc_table, event_name, doc_seq)

        # Treat events from a Kinesis stream as INSERTs
        if event_name == 'AWS:KINESIS:RECORD':
            event_name = 'INSERT'

        is_ddb_insert_or_update = (event_name == 'INSERT') or (event_name == 'MODIFY')
        is_ddb_delete = event_name == 'REMOVE'
        image_name = 'NewImage' if is_ddb_insert_or_update else 'OldImage'

        if image_name not in ddb:
            logger.warning(
                'Cannot process stream if it does not contain ' + image_name)
            continue
        logger.debug(image_name + ': %s', ddb[image_name])
        # Deserialize DynamoDB type to Python types
        doc_fields = ddb_deserializer.deserialize({'M': ddb[image_name]})

        if doc_opensearch_index_name == 'attraction':
            # Fetch the updated GooglePlace details and update the locations
            for location in doc_fields["locations"]:
                # Ensure nested structure for startLoc and endLoc
                location["startLoc"].setdefault("googlePlace", {}).setdefault("data", {})
                location["endLoc"].setdefault("googlePlace", {}).setdefault("data", {})

                # Update startLoc details
                start_loc_details = get_google_place_details_from_location(location["startLoc"])
                if start_loc_details:
                    location["startLoc"]["googlePlace"]["id"] = location["startLoc"]["googlePlaceId"]
                    location["startLoc"]["googlePlace"]["isValid"] = start_loc_details["isValid"]

                    location["startLoc"]["googlePlace"]["data"]["coords"] = start_loc_details["coords"]
                    location["startLoc"]["googlePlace"]["data"]["name"] = start_loc_details["name"]
                    location["startLoc"]["googlePlace"]["data"]["city"] = start_loc_details["city"]
                    location["startLoc"]["googlePlace"]["data"]["state"] = start_loc_details["state"]
                    location["startLoc"]["googlePlace"]["data"]["country"] = start_loc_details["country"]
                    location["startLoc"]["googlePlace"]["data"]["formattedAddress"] = start_loc_details["formattedAddress"]
                    location["startLoc"]["googlePlace"]["data"]["businessStatus"] = start_loc_details["businessStatus"]
                    location["startLoc"]["googlePlace"]["data"]["rating"] = start_loc_details["rating"]
                
                # Update endLoc details
                end_loc_details = get_google_place_details_from_location(location["endLoc"])
                if end_loc_details:
                    location["endLoc"]["googlePlace"]["id"] = location["endLoc"]["googlePlaceId"]
                    location["endLoc"]["googlePlace"]["isValid"] = end_loc_details["isValid"]
                    
                    location["endLoc"]["googlePlace"]["data"]["coords"] = end_loc_details["coords"]

            if is_ddb_insert_or_update:
                input_data = {
                    'name': doc_fields.get('name', ''),
                    'type': doc_fields.get('type', ''),
                    'cost': doc_fields.get('cost', ''),
                    'reservation': doc_fields.get('reservation', ''),
                    'descriptionShort': doc_fields.get('descriptionShort', ''),
                    'descriptionLong': doc_fields.get('descriptionLong', ''),
                    'attractionCategories': doc_fields.get('attractionCategories', []),
                    'bestVisited': doc_fields.get('bestVisited', []),
                    'attractionTargetGroups': doc_fields.get('attractionTargetGroups', []),
                    'attractionCuisine': doc_fields.get('attractionCuisine', []),
                    'locations': doc_fields.get('locations', []),
                    'recommendationBadges': doc_fields.get('recommendationBadges', [])
                }

                doc_fields['embedding'] = create_openai_embedding(input_data)

            # Retrieve the authorName using the authorId from the doc_fields
            authorId = doc_fields.get('authorId')
            if authorId:
                author_details = get_author_details(authorId)
                doc_fields['author'] = author_details
            
            destinationId = doc_fields.get('destinationId')
            if destinationId:
                destination_details = get_destination_details(destinationId)
                doc_fields['destination'] = destination_details

            # Create googlePlaceIds field on attraction to query for associated attractionId
            googlePlaceIds = []
            # Create startLoc_coords and endLoc_coords fields
            start_loc_coords = []
            end_loc_coords = []
            for location in doc_fields["locations"]:
                googlePlaceIds.append(location["startLoc"]["googlePlaceId"])
                googlePlaceIds.append(location["endLoc"]["googlePlaceId"])
                # Check if location.deleted exists and it is not set to True, and check if location.startLoc.businessStatus is not set to CLOSED_PERMANENTLY
                businessStatus = location["startLoc"]["googlePlace"]["data"].get("businessStatus")
                if not location.get("deleted", False) and businessStatus != "CLOSED_PERMANENTLY":
                    start_loc_coords.append(transform_coords(location["startLoc"]))
                    end_loc_coords.append(transform_coords(location["endLoc"]))
            # Set startLoc_coords and end_loc_coords as non-existent if they are empty arrays
            if start_loc_coords:
                doc_fields["startLoc_coords"] = start_loc_coords
            if end_loc_coords:
                doc_fields["endLoc_coords"] = end_loc_coords
            # Remove duplicates from googlePlaceIds
            googlePlaceIds = list(set(googlePlaceIds))
            doc_fields["googlePlaceIds"] = googlePlaceIds

            # need to query by seasons, but nested query too expensive. so, transform seasons array of Season objects (with startMonth: Int, startDay: Int, endMonth: Int, endDay: Int) to array of strings (MM-DD-MM-DD):
            # startMonth, startDay, endMonth, endDay are 0 indexed, so we need to add 1 to them
            seasons = doc_fields.get("seasons", [])
            seasons_str = []
            for season in seasons:
                startMonth = season.get("startMonth", 0)
                startDay = season.get("startDay", 0)
                endMonth = season.get("endMonth", 0)
                endDay = season.get("endDay", 0)
                seasons_str.append(f"{startMonth + 1:02d}-{startDay + 1:02d}-{endMonth + 1:02d}-{endDay + 1:02d}") # :02d pads the number with 0 if it's less than 2 digits
            doc_fields["seasons"] = seasons_str
        
        if doc_opensearch_index_name == 'destination':
            doc_fields["coords"] = transform_destination_coords(doc_fields["coords"])    
            nearby_things_to_do_count = doc_fields.get("nearbyThingsToDoCount", 0) or 0
            nearby_places_to_eat_count = doc_fields.get("nearbyPlacesToEatCount", 0) or 0
            doc_fields["nearbyExperiencesCount"] = nearby_things_to_do_count + nearby_places_to_eat_count
            doc_fields["isTravaCreated"] = bool(doc_fields.get("isTravaCreated", 0))
        
        # Sync enabled APIs do soft delete. We need to delete the record in OpenSearch if _deleted field is set
        if OPENSEARCH_USE_EXTERNAL_VERSIONING and event_name == 'MODIFY' and '_deleted' in  doc_fields and doc_fields['_deleted']:
            is_ddb_insert_or_update = False
            is_ddb_delete = True
            
         # Update counters
        if event_name == 'INSERT':
            cnt_insert += 1
        elif event_name == 'MODIFY':
            cnt_modify += 1
        elif event_name == 'REMOVE':
            cnt_remove += 1
        else:
            logger.warning('Unsupported event_name: %s', event_name)

        logger.debug('Deserialized doc_fields: %s', doc_fields)

        if ('Keys' in ddb):
            doc_id = compute_doc_index(ddb['Keys'], ddb_deserializer)
        else:
            logger.error('Cannot find keys in ddb record')

        # If DynamoDB INSERT or MODIFY, send 'index' to OpenSearch
        if is_ddb_insert_or_update:
            # Generate OpenSearch payload for item
            action = {'index': {'_index': doc_opensearch_index_name, '_id': doc_id}}
            # Add external versioning if necessary
            if OPENSEARCH_USE_EXTERNAL_VERSIONING and '_version' in doc_fields:
                action['index'].update([
                    ('version_type', 'external'),
                    ('version', doc_fields['_version'])
                ])
                doc_fields.pop('_ttl', None)
                doc_fields.pop('_version', None)
            # Append OpenSearch Action line with 'index' directive
            opensearch_actions.append(json.dumps(action))
            # Append JSON payload
            opensearch_actions.append(json.dumps(doc_fields, cls=DDBTypesEncoder))
            # migration step remove old key if it exists
            if ('id' in doc_fields) and (event_name == 'MODIFY') :
                action = {'delete': {'_index': doc_opensearch_index_name,
                    '_id': compute_doc_index(ddb['Keys'], ddb_deserializer, True)}}
                opensearch_actions.append(json.dumps(action))
        # If DynamoDB REMOVE, send 'delete' to OpenSearch
        elif is_ddb_delete:
            action = {'delete': {'_index': doc_opensearch_index_name, '_id': doc_id}}
            if OPENSEARCH_USE_EXTERNAL_VERSIONING and '_version' in doc_fields:
                action['delete'].update([
                    ('version_type', 'external'),
                    ('version', doc_fields['_version'])
                ])
            # Action line with 'delete' directive
            opensearch_actions.append(json.dumps(action))

    # Prepare bulk payload
    opensearch_actions.append('')  # Add one empty line to force final \\n
    opensearch_payload = '\\n'.join(opensearch_actions)
    logger.info('Posting to OpenSearch: inserts=%s updates=%s deletes=%s, total_lines=%s, bytes_total=%s',
                cnt_insert, cnt_modify, cnt_remove, len(opensearch_actions) - 1, len(opensearch_payload))
    post_to_opensearch(opensearch_payload)  # Post to OpenSearch with exponential backoff


# Global lambda handler - catches all exceptions to avoid dead letter in the DynamoDB Stream
def lambda_handler(event, context):
    try:
        return _lambda_handler(event, context)
    except Exception:
        logger.error(traceback.format_exc())

    `,
  }
}
