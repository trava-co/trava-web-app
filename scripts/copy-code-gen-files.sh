#!/bin/bash

LAMBDA_TYPES_PATHS=( "amplify/backend/shared-types")
API_FILES=( "API.ts" "lambdaErrors.ts" )
GRAPHQL_FILES=(
    "mutations.ts"
    "lambda.ts"
    "queries.ts"
    "subscriptions.ts"
    "user.ts"
    "attractionSwipe.ts"
    "fragments.ts"
)

# Create the directory if it doesn't exist
mkdir -p amplify/backend/shared-types

for path in "${LAMBDA_TYPES_PATHS[@]}";
do
    for file in "${API_FILES[@]}";
    do
        cp app/api/$file $path
    done

    mkdir -p $path/graphql

    for file in "${GRAPHQL_FILES[@]}";
    do
        cp app/graphql/$file $path/graphql
    done
done