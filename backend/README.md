# LHacks Portal Flask Backend

## Setup

### Create and activate a venv
```
python3 -m venv .venv;

source .venv/bin/activate;
```

### Install the required packages
```
pip3 install -r requirements.txt;
```

### Set the environment variables in the `.env` file

```
AUTH0_CLIENT_ID=<YOUR_AUTH0_CLIENT_ID>
AUTH0_CLIENT_SECRET=<YOUR_AUTH0_CLIENT_SECRET>
AUTH0_DOMAIN=<YOUR_AUTH0_DOMAIN>
APP_SECRET_KEY=<YOUR_APP_SECRET_KEY>
CONNECTION_STRING=postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>
```

### Run the API

```
flask --app api run;
```
