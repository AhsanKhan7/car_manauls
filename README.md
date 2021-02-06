# carmanuals

## AWS creds
Install aws cli tools. use `aws configure` with the following credentials to log into AWS:
```
Access key ID	        Secret access key
AKIAW3C7CU6Q7WKO634L	l6vOcFUCN2tA5sFYbss62zuOcSvry8d3s5ogR/xU
```
## CSV with PDF data from S3
Run shell script 

`./generate-manuals-txt.sh`
 
to generate a txt file from s3 using `aws s3 ls`. Check to see that a file called `aws-manuals.txt` was generated. in the `tmp` directory.

Run 

`npm install`

`node car-manuals-csv-generator`
 
to generate a `csv` file and a list of files from S3 that could not be processed in the `tmp` directory.

(Dev only Optional)
To limit amount of files generated:

```
cd tmp
egrep -i 's3URL|Accent' car-manuals.csv > car-manuals2.csv
rm car-manuals.csv
mv car-manuals2.csv car-manuals.csv
```

## Other Car data

If you are a huge nerd, dont skip this step.

DB API data taken from https://www.car-database-api.com/. 

If missing, download the file into `externalData/data.xml` from: https://api.auto-data.net/?code=b9f509676d817dd412fe46eff7aec5fc

Generate JSON from the XML: `node convertToJSON.js`

In order to be able to query this data, we import it into Mongo DB. To do that, run: 

`docker-compose up` 

(you must have Docker up and running)

Then 

`docker-compose exec appdb bash` 

to get into the mongodb image.

Go to the appropriate directory 

`cd /home/bitnami`

Import into mongoDB 

`mongorestore mongodump/`

Confirm that the collections `models` and `brands` are imported. One possible tool to use for this is: https://robomongo.org/

### Dump/Restore Mongo Data
This usually will not be needed since we keep the dump in source control for now in the mongodump directory.

To Dump, from within the mongo Docker container:

`mongodump --db=carDBAPI --out=mongodump`

To Restore, again from inside the container:

``

If you have destroyed the `modifications` collection, to generate a text searchable index of relevant fields:

`
db.getCollection('modifications').createIndex({
     'brand._text': 'text',
     'model._text': 'text'
     })
`

## Putting it all together to generate HTML

From the root directory of the project

`gatsby develop` or `npm run develop`

To write some code

After you want to deploy, run 

`npm run build`

to build the site for production and finally

`aws2 s3 cp public/ s3://carmanuals.org/ --recursive`

To deploy it to AWS

backend code is in server-api folder.

Install serverless framework:

`npm i -g serverless`

Setup the same AWS keys as above:

`serverless configure`

Build and deploy
`serverless deploy`

After a deployment, check the URLs serverless prints and make sure you use the correct URLs in our code.