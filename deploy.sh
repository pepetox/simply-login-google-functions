#!/bin/bash
#gcloud beta functions deploy $1  --trigger-http --stage-bucket gs://staging.test-endpoints-uno.appspot.com


gcloud beta functions deploy signup --stage-bucket cloud-pepetox-functions --trigger-http
gcloud beta functions deploy login  --stage-bucket cloud-pepetox-functions --trigger-http
gcloud beta functions deploy auth  --stage-bucket cloud-pepetox-functions --trigger-http
