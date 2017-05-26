#!/bin/bash
#gcloud beta functions deploy $1  --trigger-http --stage-bucket $2


gcloud beta functions deploy signup --stage-bucket your-bucket --trigger-http
gcloud beta functions deploy login  --stage-bucket your-bucket --trigger-http
gcloud beta functions deploy auth  --stage-bucket your-bucket --trigger-http
